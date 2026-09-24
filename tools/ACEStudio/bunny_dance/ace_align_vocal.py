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

  python3 ace_align_vocal.py status
      Solo lectura: dice si cada pista esta sin tocar, cortada a medias o ya alineada.

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
MIN_MATCHED = 3             # frases con menos palabras emparejadas heredan el desplazamiento de la anterior
TOL = TPB // 4              # tolerancia al localizar cortes (ACE puede redondear un par de ticks)
MAX_PHRASE = 8 * TPB        # frases de mas de 4 s (a 120 BPM) se parten por su pausa interna mayor


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


TEMP = {"sing": None}       # una sola pista Sing temporal para todo el analisis


def transcribe(track_uuid, label):
    """vocal-to-midi de cada clip de audio -> pista Sing temporal -> (notas globales, clips saltados)."""
    skipped = []
    sing = TEMP["sing"]
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
            sing = TEMP["sing"] = new.pop() if len(new) == 1 else None
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
        for sc in clips_of(sing):              # vaciar la pista temporal para la siguiente
            subprocess.run([ACE, "clip", "delete", "--clip-uuid", sc["clipUuid"]], capture_output=True)
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
                            "offset": None, "last_end": lo, "words": "(clip corto, sigue a la frase anterior)"})
            continue
        inside = [n for n in target["notes"] if lo <= n["pos"] < hi]
        cuts = [lo]
        if inside and inside[0]["pos"] - lo > MIN_GAP:     # silencio inicial: se separa y se queda quieto
            cuts.append(inside[0]["pos"] - MIN_GAP // 2)
        for a, b in zip(inside, inside[1:]):
            if b["pos"] - a["end"] >= MIN_GAP:
                cuts.append((a["end"] + b["pos"]) // 2)
        cuts.append(hi)
        changed = True
        while changed:                          # partir frases largas por su mayor hueco interno
            changed = False
            for s, e in zip(cuts, cuts[1:]):
                seg = [n for n in inside if s <= n["pos"] < e]
                if len(seg) < 2 or seg[-1]["end"] - seg[0]["pos"] <= MAX_PHRASE:
                    continue
                centre = (seg[0]["pos"] + seg[-1]["end"]) / 2
                a, b = max(zip(seg, seg[1:]),       # mayor hueco; a igualdad, el mas centrado
                           key=lambda ab: (ab[1]["pos"] - ab[0]["end"], -abs(ab[1]["pos"] - centre)))
                cut = (a["end"] + b["pos"]) // 2 if b["pos"] > a["end"] else b["pos"]
                if s < cut < e:
                    cuts = sorted(set(cuts + [cut]))
                    changed = True
                    break
        for s, e in zip(cuts, cuts[1:]):
            offs = [o for t, o in offset_of.items() if s <= t < e]
            label = " ".join(w for w, t in tgt_w if s <= t < e)
            silent = not any(s <= n["pos"] < e for n in inside)
            last_end = max((n["end"] for n in inside if s <= n["pos"] < e), default=s)
            phrases.append({"clip": clip["clipUuid"], "start": s, "end": e, "matched": len(offs), "silent": silent,
                            "last_end": last_end,
                            "offset": 0 if silent else int(statistics.median(offs)) if len(offs) >= MIN_MATCHED else None,
                            "words": label or "(silencio)"})

    reliable = [p for p in phrases if p["offset"] is not None and not p["silent"]]
    last = None
    for p in phrases:                      # frases poco fiables: siguen a la frase fiable anterior (el conteo va con su STOP)
        if p["offset"] is None:
            src = last or next((r for r in reliable if r["start"] > p["start"]), None)
            p["offset"] = src["offset"] if src else 0
            p["inherited"] = True
        elif not p["silent"]:
            last = p
    prev_new = -1
    for p in phrases:
        if p["silent"]:                    # los trozos de silencio no se mueven
            p["new"] = p["start"]
            continue
        p["new"] = max(p["start"] + p["offset"], prev_new + 1, 0)   # nunca invertir el orden de las frases
        prev_new = p["new"]
    moving = [p for p in phrases if not p["silent"]]
    for i in range(len(moving) - 2, -1, -1):  # de atras adelante: si una frase pisaria la siguiente, se adelanta lo justo
        a, b = moving[i], moving[i + 1]
        tail = a.get("last_end", a["start"]) - a["start"]
        if a["new"] + tail > b["new"]:
            floor = moving[i - 1]["new"] + 1 if i else 0
            fitted = max(b["new"] - tail, floor)
            if fitted < a["new"]:
                a["new"], a["fitted"] = fitted, True
    for a, b in zip(moving, moving[1:]):   # lo que aun no quepa se avisa
        cut = a.get("last_end", a["start"]) + (a["new"] - a["start"]) - b["new"]
        a["clipped"] = cut if cut > TPB // 40 else 0      # < 25 ms no se considera recorte
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
    for idx in [int(x) for x in (args.targets or "21,23,24,25").split(",") if x.strip()]:
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
    if TEMP["sing"]:
        idx = jace("track", "get", "--track-uuid", TEMP["sing"])["trackIndex"]
        state["temp_sing"] = TEMP["sing"]
        with open(STATE, "w") as fh:
            json.dump(state, fh)
        print(f"Pista Sing temporal (vacia) {TEMP['sing']}: es la n.o {idx + 1} en la pantalla de ACE. "
              "Seleccionala y borrala a mano (ACE no deja borrarla por comando).")
    print("Siguiente: python3 ace_align_vocal.py plan")


def cmd_plan(args):
    state = json.load(open(STATE))
    for t in selected(state, args):
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
            flag = (" *" if p.get("inherited") else "") + (" ~" if p.get("fitted") else "")
            warn = f"  !! recorta {p['clipped'] / TPB * 0.5:.2f}s de su ultima palabra" if p.get("clipped") else ""
            print(f"  {p['start'] / TPB * 0.5:7.2f}s -> {p['new'] / TPB * 0.5:7.2f}s  ({d:+.3f}s{flag}, "
                  f"{p['matched']} pal.)  {p['words'][:55]}{warn}")
        clipped = [p for p in phrases if p.get("clipped")]
        print(f"  (* = desplazamiento tomado de la frase fiable anterior; ~ = ajustada para no pisar la siguiente; "
              f"{len(clipped)} frases recortarian una palabra)")
    print("\nVista previa: no se ha escrito nada. Para aplicar: python3 ace_align_vocal.py apply")


def near(tick, ticks, tol):
    best = min(ticks, key=lambda x: abs(x - tick), default=None)
    return best if best is not None and abs(best - tick) <= tol else None


def apply_target(ref_notes, t):
    try:
        _, _, _, phrases = build_plan(ref_notes, t)
    except ValueError as err:
        print(f"  [{t['index']}] la salto: {err}")
        return
    expected = [c["clipBegin"] for c in t["clips"]] + [p["start"] for p in phrases]
    current = clips_of(t["uuid"])
    # Se acepta la pista tal como la dejo 'analyze' o ya cortada (parcial o totalmente) por un 'apply' anterior;
    # ACE puede colocar un corte a un par de ticks del pedido, por eso se compara con tolerancia.
    strays = [c["clipBegin"] for c in current if near(c["clipBegin"], expected, TOL) is None]
    lost = [c["clipBegin"] for c in t["clips"] if near(c["clipBegin"], [x["clipBegin"] for x in current], TOL) is None]
    if strays or lost:
        secs = lambda ticks: ", ".join(f"{x / TPB * 0.5:.2f}s" for x in sorted(ticks)[:6])
        print(f"  [{t['index']}] ha cambiado desde 'analyze' (no solo cortes de este script): la salto; "
              "vuelve a ejecutar analyze.")
        print(f"      clips al analizar: {len(t['clips'])}, ahora: {len(current)}")
        if strays:
            print(f"      clips que empiezan donde no se esperaba ({len(strays)}): {secs(strays)}")
        if lost:
            print(f"      clips del analisis que ya no estan ({len(lost)}): {secs(lost)}")
        return
    for p in phrases:
        if near(p["start"], [c["clipBegin"] for c in clips_of(t["uuid"])], TOL) is not None:
            continue                                  # ya hay un corte aqui (de este o de un apply anterior)
        holder = [c for c in clips_of(t["uuid"]) if c["clipBegin"] < p["start"] < c["clipEnd"]]
        if len(holder) != 1:
            sys.exit(f"[{t['index']}] no encuentro el clip que contiene el tick {p['start']}; no muevo nada.")
        ace("clip", "split", "--clip-uuid", holder[0]["clipUuid"], "--pos", f"{p['start']}t")
    clips, used, found = clips_of(t["uuid"]), set(), {}
    for p in phrases:
        begin = near(p["start"], [c["clipBegin"] for c in clips if c["clipUuid"] not in used], TOL)
        if begin is None:
            sys.exit(f"[{t['index']}] tras cortar no encuentro la frase de {p['start'] / TPB * 0.5:.2f}s; no muevo nada.")
        clip = next(c for c in clips if c["clipBegin"] == begin and c["clipUuid"] not in used)
        used.add(clip["clipUuid"])
        found[id(p)] = clip
    todo = [p for p in phrases if p["new"] != p["start"]]
    for p in todo:                                   # apartar, para no chocar al recolocar
        ace("clip", "move", "--clip-uuid", found[id(p)]["clipUuid"], "--move-later", PARK)
    for p in todo:                                   # en orden: cada frase solo puede recortar la cola de la anterior
        dest = found[id(p)]["clipBegin"] + (p["new"] - p["start"])   # mismo desplazamiento aunque el corte redondeara
        ace("clip", "move", "--clip-uuid", found[id(p)]["clipUuid"], "--pos", f"{max(dest, 0)}t", "--on-occupied", "cover")
    print(f"  [{t['index']}] {t['name'][:40]}: {len(todo)} de {len(phrases)} frases movidas")


def selected(state, args):
    if not args.targets:
        return state["targets"]
    wanted = {int(x) for x in args.targets.split(",") if x.strip()}
    return [t for t in state["targets"] if t["index"] in wanted]


def cmd_apply(args):
    state = json.load(open(STATE))
    print("Alineando con la referencia (la referencia no se toca)...")
    for t in selected(state, args):
        apply_target(state["ref"]["notes"], t)
    print("Hecho. Escucha cada pista; si algo no te gusta, history undo o revierte el proyecto guardado.")


def cmd_status(args):
    """Solo lectura: para cada pista del analisis, ¿esta sin tocar, solo cortada o ya alineada?"""
    state = json.load(open(STATE))
    for t in selected(state, args):
        try:
            _, _, _, phrases = build_plan(state["ref"]["notes"], t)
        except ValueError as err:
            print(f"[{t['index']}] {t['name']}: sin plan ({err})")
            continue
        begins = [c["clipBegin"] for c in clips_of(t["uuid"])]
        moved = [p for p in phrases if p["new"] != p["start"]]
        at_new = sum(1 for p in moved if near(p["new"], begins, TOL) is not None)
        at_old = sum(1 for p in moved if near(p["start"], begins, TOL) is not None)
        if len(begins) == len(t["clips"]):
            verdict = "SIN TOCAR (como al analizar)"
        elif at_new >= 0.8 * len(moved):
            verdict = "YA ALINEADA con este plan"
        elif at_old >= 0.8 * len(moved):
            verdict = "CORTADA pero SIN MOVER (un apply se quedo a medias)"
        else:
            verdict = "MODIFICADA de otra forma"
        print(f"[{t['index']}] {t['name']}: {verdict} — clips ahora {len(begins)}, "
              f"frases en su sitio nuevo {at_new}/{len(moved)}, en su sitio original {at_old}/{len(moved)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("phase", choices=["analyze", "plan", "apply", "status"])
    ap.add_argument("--ref", type=int, default=22, help="indice CLI de la pista de referencia (analyze)")
    ap.add_argument("--targets", default=None,
                    help="analyze: indices CLI a alinear (por defecto 21,23,24,25); apply/plan: solo estos del analisis")
    args = ap.parse_args()
    {"analyze": cmd_analyze, "plan": cmd_plan, "apply": cmd_apply, "status": cmd_status}[args.phase](args)


if __name__ == "__main__":
    main()
