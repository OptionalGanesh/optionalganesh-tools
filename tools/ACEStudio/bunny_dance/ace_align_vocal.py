#!/usr/bin/env python3
"""
Bunny Dance - alinea una pista de voz (audio) con otra de referencia, palabra a palabra.

Fases (cada una se ejecuta por separado, en el Mac con ACE Studio abierto):

  python3 ace_align_vocal.py analyze [--ref 22] [--targets 21,23,24,25]
      Transcribe con vocal-to-midi (gratis) cada clip de la pista de referencia y de
      las pistas a alinear, en pistas Sing temporales; guarda palabras y tiempos en
      ~/bunny_align.json y borra las pistas temporales. No toca el audio.
      Los numeros son los indices de la CLI (track list); se guardan como UUID, asi
      que plan/apply siguen funcionando aunque luego cambien las posiciones.

  python3 ace_align_vocal.py plan
      Empareja las palabras de ambas pistas (alineamiento de secuencias, tolera
      palabras de mas o de menos), corta la pista a alinear en frases por sus
      pausas y calcula cuanto mover cada frase. Solo imprime; no escribe nada.

  python3 ace_align_vocal.py apply
      Corta los clips de la pista a alinear en esas frases y mueve cada frase a su
      sitio. La pista de referencia no se toca. Guarda el proyecto antes.

Las frases se mueven enteras (no se estira el audio): cada frase queda en la
posicion que mejor encaja sus palabras con las de la referencia (mediana).
"""

import argparse
import json
import os
import re
import statistics
import subprocess
import sys

ACE = os.environ.get("ACE", "/Applications/ACE Studio.app/Contents/Helpers/acestudio-cli")
STATE = os.path.expanduser("~/bunny_align.json")
TPB = 480
MIN_GAP = TPB // 2          # pausa minima (corchea) para cortar frase
PARK = "400bar"             # aparcamiento temporal durante apply
MIN_SEC, MAX_SEC = 2.0, 240.0   # limites de vocal-to-midi por clip


def ace(*args, check=True):
    res = subprocess.run([ACE, *args], capture_output=True, text=True)
    if check and res.returncode != 0:
        sys.exit(f"acestudio-cli {' '.join(args)} fallo:\n{res.stderr or res.stdout}")
    return res.stdout


def jace(*args):
    return json.loads(ace(*args, "--json"))


def clips_of(track_uuid):
    return jace("clip", "list", "--track-uuid", track_uuid)["clips"]


def sing_tracks():
    return {t["trackUuid"] for t in jace("track", "list", "--type", "sing")["tracks"]}


def find_notes(obj):
    if isinstance(obj, list) and obj and isinstance(obj[0], dict) and "pitch" in obj[0]:
        return obj
    children = obj.values() if isinstance(obj, dict) else obj if isinstance(obj, list) else []
    for child in children:
        found = find_notes(child)
        if found:
            return found
    return []


def transcribe(track_uuid, label):
    """vocal-to-midi de cada clip de audio -> una pista Sing temporal -> (notas globales, clips saltados)."""
    sing, skipped = None, []
    try:
        for i, clip in enumerate(clips_of(track_uuid)):
            length = clip["clipEndSec"] - clip["clipBeginSec"]
            tag = f"  {label}: clip {i + 1} ({clip['clipBeginSec']:.1f}s-{clip['clipEndSec']:.1f}s)"
            if not MIN_SEC <= length <= MAX_SEC:
                print(f"{tag} salto: {length:.1f}s (vocal-to-midi acepta {MIN_SEC:g}-{MAX_SEC:g}s)")
                skipped.append(clip["clipUuid"])
                continue
            before = sing_tracks()
            args = ["generative", "vocal-to-midi", "--clip-uuid", clip["clipUuid"], "--language", "english",
                    "--apply-pitch", "false", "--wait"]
            if sing:
                args += ["--track-uuid", sing]
            print(f"{tag}...", flush=True)
            res = subprocess.run([ACE, *args], capture_output=True, text=True)
            if not sing:
                new = sing_tracks() - before
                sing = new.pop() if len(new) == 1 else None
            if res.returncode != 0:
                print(f"{tag} fallo, lo salto: {(res.stderr or res.stdout).strip().splitlines()[0]}")
                skipped.append(clip["clipUuid"])
        notes = []
        if sing:
            index = jace("track", "get", "--track-uuid", sing)["trackIndex"]
            for k, sc in enumerate(clips_of(sing)):
                raw = jace("clip", "note-content", "--track-index", str(index), "--clip-index", str(k))
                off = sc.get("clipBegin", 0)
                for n in find_notes(raw):
                    notes.append({"pos": off + n["pos"], "end": off + n["pos"] + n["dur"], "lyric": n.get("lyric", "")})
    finally:
        if sing and subprocess.run([ACE, "track", "delete", "--track-uuid", sing], capture_output=True).returncode != 0:
            print(f"  AVISO: no pude borrar la pista Sing temporal {sing}; borrala a mano.")
    notes.sort(key=lambda n: n["pos"])
    return notes, skipped


def words(notes):
    """Primera silaba de cada palabra: 'Yellow#1' cuenta, 'Yellow#2' y '-' no."""
    out = []
    for n in notes:
        lyr = n["lyric"].strip()
        if not lyr or lyr == "-" or re.search(r"#([2-9]|\d\d)$", lyr):
            continue
        w = re.sub(r"[^a-z]", "", lyr.split("#")[0].lower())
        if w:
            out.append((w, n["pos"]))
    return out


def align(ref, tgt):
    """Needleman-Wunsch sobre palabras; desempata por posicion relativa en la cancion."""
    n, m = len(ref), len(tgt)
    r0, r1 = ref[0][1], max(ref[-1][1], ref[0][1] + 1)
    t0, t1 = tgt[0][1], max(tgt[-1][1], tgt[0][1] + 1)
    gap = -1.0
    score = [[0.0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        score[i][0] = i * gap
    for j in range(1, m + 1):
        score[0][j] = j * gap
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            same = ref[i - 1][0] == tgt[j - 1][0]
            drift = abs((ref[i - 1][1] - r0) / (r1 - r0) - (tgt[j - 1][1] - t0) / (t1 - t0))
            s = (2.0 - 3.0 * drift) if same else -1.0
            score[i][j] = max(score[i - 1][j - 1] + s, score[i - 1][j] + gap, score[i][j - 1] + gap)
    pairs, i, j = [], n, m
    while i > 0 and j > 0:
        same = ref[i - 1][0] == tgt[j - 1][0]
        drift = abs((ref[i - 1][1] - r0) / (r1 - r0) - (tgt[j - 1][1] - t0) / (t1 - t0))
        s = (2.0 - 3.0 * drift) if same else -1.0
        if score[i][j] == score[i - 1][j - 1] + s:
            if same:
                pairs.append((i - 1, j - 1))
            i, j = i - 1, j - 1
        elif score[i][j] == score[i - 1][j] + gap:
            i -= 1
        else:
            j -= 1
    return pairs[::-1]


def build_plan(ref_notes, target):
    ref_w, tgt_w = words(ref_notes), words(target["notes"])
    if not ref_w or not tgt_w:
        raise ValueError("la transcripcion no tiene palabras")
    pairs = align(ref_w, tgt_w)
    offset_of = {tgt_w[j][1]: ref_w[i][1] - tgt_w[j][1] for i, j in pairs}

    phrases = []
    skipped = set(target.get("skipped", []))
    for clip in target["clips"]:
        lo, hi = clip["clipBegin"], clip["clipEnd"]
        if clip["clipUuid"] in skipped:          # sin transcripcion (clip corto): se mueve con la frase anterior
            phrases.append({"clip": clip["clipUuid"], "start": lo, "end": hi, "matched": 0, "silent": False,
                            "offset": None, "words": "(clip corto, sigue a la frase anterior)"})
            continue
        inside = [n for n in target["notes"] if lo <= n["pos"] < hi]
        cuts = [lo]
        if inside and inside[0]["pos"] - lo > MIN_GAP:     # silencio inicial: se separa y se queda quieto
            cuts.append(inside[0]["pos"] - MIN_GAP // 2)
        for a, b in zip(inside, inside[1:]):
            if b["pos"] - a["end"] >= MIN_GAP:
                cuts.append((a["end"] + b["pos"]) // 2)
        cuts.append(hi)
        for s, e in zip(cuts, cuts[1:]):
            offs = [o for t, o in offset_of.items() if s <= t < e]
            label = " ".join(w for w, t in tgt_w if s <= t < e)
            silent = not any(s <= n["pos"] < e for n in inside)
            phrases.append({"clip": clip["clipUuid"], "start": s, "end": e, "matched": len(offs), "silent": silent,
                            "offset": 0 if silent else int(statistics.median(offs)) if offs else None,
                            "words": label or "(silencio)"})

    last = 0
    for p in phrases:                      # frases sin palabras emparejadas heredan el desplazamiento anterior
        if p["offset"] is None:
            p["offset"] = last
        if not p["silent"]:
            last = p["offset"]
    prev_new = -1
    for p in phrases:
        if p["silent"]:                    # los trozos de silencio no se mueven
            p["new"] = p["start"]
            continue
        p["new"] = max(p["start"] + p["offset"], prev_new + 1, 0)   # nunca invertir el orden de las frases
        prev_new = p["new"]
    return pairs, ref_w, tgt_w, phrases


def resolve(index):
    res = subprocess.run([ACE, "track", "get", "--track-index", str(index), "--json"], capture_output=True, text=True)
    if res.returncode != 0:
        return None, f"(no existe la pista {index})", ""
    track = json.loads(res.stdout)
    if not track.get("trackUuid"):                     # hueco vacio del arreglo: sin UUID ni nombre
        return None, f"(pista {index} vacia: {track.get('trackType', '?')})", track.get("trackType", "")
    return track["trackUuid"], track.get("trackName", ""), track.get("trackType", "")


def cmd_analyze(args):
    ref_uuid, ref_name, _ = resolve(args.ref)
    if not ref_uuid:
        sys.exit(f"No existe la pista de referencia {args.ref}.")
    print(f"Referencia: [{args.ref}] {ref_name}")
    targets = []
    for idx in [int(x) for x in args.targets.split(",") if x.strip()]:
        uuid, name, kind = resolve(idx)
        if not uuid or kind != "Audio" or uuid == ref_uuid:
            why = "no existe o esta vacia" if not uuid else "es la referencia" if uuid == ref_uuid else f"no es de audio ({kind})"
            print(f"  Salto [{idx}] {name}: {why}")
            continue
        targets.append({"index": idx, "uuid": uuid, "name": name})
    if not targets:
        sys.exit("No hay ninguna pista de audio que alinear.")
    print("Pistas a alinear: " + ", ".join(f"[{t['index']}] {t['name']}" for t in targets))
    print("Transcribiendo (vocal-to-midi es gratis; crea y borra pistas Sing temporales)...")
    ref_notes, _ = transcribe(ref_uuid, f"referencia [{args.ref}]")
    state = {"ref": {"uuid": ref_uuid, "name": ref_name, "notes": ref_notes}, "targets": []}
    for t in targets:
        t["clips"] = clips_of(t["uuid"])
        t["notes"], t["skipped"] = transcribe(t["uuid"], f"[{t['index']}] {t['name'][:30]}")
        state["targets"].append(t)
    with open(STATE, "w") as fh:
        json.dump(state, fh)
    print(f"OK: referencia {len(state['ref']['notes'])} notas; "
          + ", ".join(f"[{t['index']}] {len(t['notes'])}" for t in state["targets"]) + f" -> {STATE}")
    print("Siguiente: python3 ace_align_vocal.py plan")


def cmd_plan(_):
    state = json.load(open(STATE))
    for t in state["targets"]:
        try:
            pairs, ref_w, tgt_w, phrases = build_plan(state["ref"]["notes"], t)
        except ValueError as err:
            print(f"\n=== [{t['index']}] {t['name']} ===\nLa salto: {err}")
            continue
        moved = [p for p in phrases if p["new"] != p["start"]]
        print(f"\n=== [{t['index']}] {t['name']} ===")
        print(f"Palabras: referencia {len(ref_w)}, esta pista {len(tgt_w)}, emparejadas {len(pairs)}; "
              f"frases {len(phrases)} ({len(moved)} se mueven)")
        for p in phrases:
            d = (p["new"] - p["start"]) / TPB * 0.5          # 120 BPM: 1 negra = 0.5 s
            print(f"  {p['start'] / TPB * 0.5:7.2f}s -> {p['new'] / TPB * 0.5:7.2f}s  ({d:+.3f}s, "
                  f"{p['matched']} pal.)  {p['words'][:55]}")
    print("\nVista previa: no se ha escrito nada. Para aplicar: python3 ace_align_vocal.py apply")


def apply_target(ref_notes, t):
    now = {c["clipUuid"]: c for c in clips_of(t["uuid"])}
    if set(now) != {c["clipUuid"] for c in t["clips"]}:
        print(f"  [{t['index']}] ha cambiado desde 'analyze': la salto (vuelve a ejecutar analyze).")
        return
    try:
        _, _, _, phrases = build_plan(ref_notes, t)
    except ValueError as err:
        print(f"  [{t['index']}] la salto: {err}")
        return
    for p in phrases:
        if p["start"] == now[p["clip"]]["clipBegin"]:
            continue
        # tras cada corte cambian los clips: buscar el que contiene este punto ahora mismo
        holder = [c for c in clips_of(t["uuid"]) if c["clipBegin"] < p["start"] < c["clipEnd"]]
        if len(holder) != 1:
            sys.exit(f"[{t['index']}] no encuentro el clip que contiene el tick {p['start']}; revisa en ACE (history undo).")
        ace("clip", "split", "--clip-uuid", holder[0]["clipUuid"], "--pos", f"{p['start']}t")
    by_start = {c["clipBegin"]: c["clipUuid"] for c in clips_of(t["uuid"])}
    missing = [p for p in phrases if p["start"] not in by_start]
    if missing:
        sys.exit(f"[{t['index']}] tras cortar no encuentro {len(missing)} frases; revisa en ACE (history undo).")
    todo = [p for p in phrases if p["new"] != p["start"]]
    for p in todo:                                   # apartar, para no chocar al recolocar
        ace("clip", "move", "--clip-uuid", by_start[p["start"]], "--move-later", PARK)
    for p in todo:                                   # en orden: cada frase solo puede recortar la cola de la anterior
        ace("clip", "move", "--clip-uuid", by_start[p["start"]], "--pos", f"{p['new']}t", "--on-occupied", "cover")
    print(f"  [{t['index']}] {t['name'][:40]}: {len(todo)} de {len(phrases)} frases movidas")


def cmd_apply(_):
    state = json.load(open(STATE))
    print("Alineando con la referencia (la referencia no se toca)...")
    for t in state["targets"]:
        apply_target(state["ref"]["notes"], t)
    print("Hecho. Escucha cada pista; si algo no te gusta, history undo o revierte el proyecto guardado.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("phase", choices=["analyze", "plan", "apply"])
    ap.add_argument("--ref", type=int, default=22, help="indice CLI de la pista de referencia (analyze)")
    ap.add_argument("--targets", default="21,23,24,25", help="indices CLI de las pistas a alinear (analyze)")
    args = ap.parse_args()
    {"analyze": cmd_analyze, "plan": cmd_plan, "apply": cmd_apply}[args.phase](args)


if __name__ == "__main__":
    main()
