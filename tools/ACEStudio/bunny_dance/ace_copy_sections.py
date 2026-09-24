#!/usr/bin/env python3
"""
Bunny Dance - iguala versos y coros en la pista Sing de ACE Studio.

Lee las notas de la pista Sing "Ella - Kid" (creada con vocal-to-midi a partir
de Vocal_Bunny dance) y reescribe el clip para que:
  - los versos 2-5 sean copia exacta del verso 1 (c02 -> STOP de c09),
    transportados al tono de su ciclo y con su palabra (Red/Blue/Baby/Everybody);
  - los coros 2-4 (el conteo "One hop / Two hops / Three hops") sean copia
    exacta del coro 1 (c09-c12), transportados al tono de su ciclo.
Cada copia de verso se alinea por su STOP con el STOP del audio (el ciclo 5,
que no tiene STOP, por su primera silaba); cada coro, por su "One".
El ciclo 1 no se toca.

Uso (en el Mac, con ACE Studio abierto):
  python3 ace_copy_sections.py            # vista previa, NO escribe nada
  python3 ace_copy_sections.py --apply    # escribe (1 sola entrada de undo)
Deshacer: acestudio-cli history undo
"""

import argparse
import json
import os
import subprocess
import sys
import time

ACE = os.environ.get("ACE", "/Applications/ACE Studio.app/Contents/Helpers/acestudio-cli")
TRACK_UUID = "{7570c6c8-dc13-4e86-b6cb-ef71e22e1287}"   # pista Sing "Ella - Kid"
TRACK_INDEX = 13
TPB = 480                                               # ticks por negra (4/4)
LANGUAGE = "ENG"   # sin esto ACE aplica el idioma por defecto de la pista y la letra no se entiende


def T(bar, beat=1.0):
    """Compas/tiempo (desde 1) -> tick."""
    return round(((bar - 1) * 4 + beat - 1) * TPB)


REF_VERSE = (T(2), T(9, 3.5))      # verso 1: "Yellow bunny ..." hasta el STOP
REF_COUNT = (T(9, 3.5), T(13))     # coro 1: "One hop ... hop hop hop"
KEEP_BEFORE = T(16)                # todo lo anterior (ciclo 1) se conserva tal cual
CYCLES = [
    {"name": "Ciclo 2 - Red", "win": (T(16), T(30)), "shift": 0, "word": "Red", "anchor": "stop"},
    {"name": "Ciclo 3 - Blue", "win": (T(30), T(41)), "shift": 1, "word": "Blue", "anchor": "stop"},
    {"name": "Ciclo 4 - Baby", "win": (T(41), T(52)), "shift": 2, "word": "Baby", "anchor": "stop"},
    {"name": "Ciclo 5 - Everybody", "win": (T(52), None), "shift": 3, "word": "Everybody", "anchor": "first"},
]
# Silabas que sustituyen a "Yel-low" (2 notas). "Everybody" ocupa ademas las
# 2 notas de "bun-ny", como en el audio original.
WORD_SYLLABLES = {"Red": ["Red", "-"], "Blue": ["Blue", "-"], "Baby": ["Baby#1", "Baby#2"]}
NOTE_NAMES = "C C# D D# E F F# G G# A A# B".split()


def ace(*args):
    res = subprocess.run([ACE, *args], capture_output=True, text=True)
    if res.returncode != 0:
        sys.exit(f"acestudio-cli {' '.join(args)} fallo:\n{res.stderr or res.stdout}")
    return res.stdout


def find_notes(obj):
    if isinstance(obj, list) and obj and isinstance(obj[0], dict) and "pitch" in obj[0]:
        return obj
    children = obj.values() if isinstance(obj, dict) else obj if isinstance(obj, list) else []
    for child in children:
        found = find_notes(child)
        if found:
            return found
    return []


def base(lyric):
    return lyric.split("#")[0].strip().lower()


def first(notes, lo, hi, pred=lambda n: True):
    for n in notes:
        if lo <= n["pos"] < (hi if hi is not None else float("inf")) and pred(n):
            return n
    return None


def is_stop(n):
    return base(n["lyric"]).startswith("stop")


def is_one(n):
    return base(n["lyric"]) == "one"


def relyric(verse, word):
    out, pending = [], 0
    for n in verse:
        lyric = n["lyric"]
        if base(lyric) == "yellow":
            idx = int(lyric.split("#")[1]) if "#" in lyric else 1
            if word == "Everybody":
                lyric = f"Everybody#{idx}"
                if idx == 2:
                    pending = 2
            else:
                lyric = WORD_SYLLABLES[word][idx - 1]
        elif base(lyric) == "bunny" and pending:
            lyric = f"Everybody#{5 - pending}"
            pending -= 1
        out.append(dict(n, lyric=lyric))
    return out


def shifted(notes, offset, semitones):
    return [{"pos": n["pos"] + offset, "dur": n["dur"], "pitch": n["pitch"] + semitones,
             "lyric": n["lyric"], "language": LANGUAGE} for n in notes]


def build(notes):
    notes = sorted(notes, key=lambda n: n["pos"])
    ref_v = [n for n in notes if REF_VERSE[0] <= n["pos"] < REF_VERSE[1]]
    ref_c = [n for n in notes if REF_COUNT[0] <= n["pos"] < REF_COUNT[1]]
    v_stop = first(ref_v, *REF_VERSE, is_stop)
    c_one = first(ref_c, *REF_COUNT, is_one)
    if not (ref_v and ref_c and v_stop and c_one):
        sys.exit("No encuentro el verso 1 / STOP / coro 1 donde se esperaban (c02-c12). No escribo nada.")
    print(f"Referencia verso 1: {len(ref_v)} notas, STOP en tick {v_stop['pos']}")
    print(f"Referencia coro 1:  {len(ref_c)} notas, 'One' en tick {c_one['pos']}")

    new = [{"pos": n["pos"], "dur": n["dur"], "pitch": n["pitch"], "lyric": n["lyric"], "language": LANGUAGE}
           for n in notes if n["pos"] < KEEP_BEFORE]
    for cyc in CYCLES:
        lo, hi = cyc["win"]
        if cyc["anchor"] == "stop":
            anchor = first(notes, lo, hi, is_stop)
            ref_anchor = v_stop
        else:
            anchor = first(notes, lo, hi)
            ref_anchor = ref_v[0]
        if not anchor:
            sys.exit(f"{cyc['name']}: no encuentro el punto de anclaje ({cyc['anchor']}). No escribo nada.")
        offset = anchor["pos"] - ref_anchor["pos"]
        new += shifted(relyric(ref_v, cyc["word"]), offset, cyc["shift"])
        line = f"{cyc['name']}: verso anclado en tick {anchor['pos']} ({cyc['shift']:+d} st)"
        one = first(notes, lo, hi, is_one)
        if one:
            new += shifted(ref_c, one["pos"] - c_one["pos"], cyc["shift"])
            line += f", coro anclado en tick {one['pos']}"
        print(line)

    new.sort(key=lambda n: n["pos"])
    trims = 0
    for a, b in zip(new, new[1:]):
        if a["pos"] + a["dur"] > b["pos"]:
            a["dur"] = b["pos"] - a["pos"]
            trims += 1
            if a["dur"] <= 0:
                sys.exit(f"Dos notas empiezan en el mismo tick {a['pos']}: revisa anclajes. No escribo nada.")
    if new[0]["pos"] < 0:
        sys.exit("Una copia empezaria antes del inicio del clip. No escribo nada.")
    print(f"Notas: {len(notes)} originales -> {len(new)} nuevas ({trims} recortadas para evitar solapes)")
    return new


def summary(new, from_bar=16):
    bars = {}
    for n in new:
        bar, beat = n["pos"] // (4 * TPB) + 1, (n["pos"] % (4 * TPB)) / TPB + 1
        if bar >= from_bar:
            name = f"{NOTE_NAMES[n['pitch'] % 12]}{n['pitch'] // 12 - 1}"
            bars.setdefault(bar, []).append(f"{name}({n['lyric']})@{beat:.2f}")
    for bar in sorted(bars):
        print(f"c{bar:02d}: " + "  ".join(bars[bar]))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="escribir en ACE Studio (sin esto solo vista previa)")
    args = ap.parse_args()

    track = json.loads(ace("track", "get", "--track-index", str(TRACK_INDEX), "--json"))
    if track.get("trackUuid") != TRACK_UUID:
        sys.exit(f"La pista {TRACK_INDEX} ya no es 'Ella - Kid' ({track.get('trackName')}). No escribo nada.")
    clips = json.loads(ace("clip", "list", "--track-uuid", TRACK_UUID, "--json"))["clips"]
    if len(clips) != 1 or clips[0].get("clipBegin", 0) != 0:
        sys.exit("Esperaba 1 clip que empiece en el tick 0 en la pista Sing. No escribo nada.")
    clip = clips[0]
    raw = json.loads(ace("clip", "note-content", "--track-index", str(TRACK_INDEX), "--clip-index", "0", "--json"))
    notes = find_notes(raw)
    fingerprint = raw.get("fingerprint") if isinstance(raw, dict) else None

    new = build(notes)
    end = clip.get("clipEnd")
    if end and new[-1]["pos"] + new[-1]["dur"] > end:
        print(f"AVISO: la ultima nota acaba despues del final del clip (tick {end}).")
    print()
    summary(new)

    if not args.apply:
        print("\nVista previa: no se ha escrito nada. Para aplicar: python3 ace_copy_sections.py --apply")
        return
    backup = os.path.expanduser(f"~/bunny_notes_backup_{time.strftime('%Y%m%d_%H%M%S')}.json")
    with open(backup, "w") as fh:
        json.dump(raw, fh)
    cmd = ["clip", "replace-content", "--clip-uuid", clip["clipUuid"], "--notes", json.dumps(new), "--json"]
    if fingerprint:
        cmd += ["--if-match", fingerprint]
    print(f"\nCopia de seguridad de las notas originales: {backup}")
    print(ace(*cmd))
    print("Hecho. Para deshacer: acestudio-cli history undo")


if __name__ == "__main__":
    main()
