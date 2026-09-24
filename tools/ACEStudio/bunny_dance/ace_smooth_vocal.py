#!/usr/bin/env python3
"""
Bunny Dance - suaviza los cortes de la pista Sing "Ella - Kid" en ACE Studio.

La transcripcion (vocal-to-midi) deja huecos minimos entre notas seguidas y el
cantante AI los canta como micro-cortes. Este script alarga cada nota hasta la
siguiente cuando el hueco es menor que MAX_GAP (una semicorchea por defecto).
No cambia ninguna altura, posicion, letra ni idioma: solo duraciones. Los
silencios reales (la congelacion tras el STOP, los huecos entre frases) son
mucho mas largos que MAX_GAP y no se tocan.

Uso (en el Mac, con ACE Studio abierto):
  python3 ace_smooth_vocal.py              # vista previa, NO escribe nada
  python3 ace_smooth_vocal.py --apply      # escribe (1 sola entrada de undo)
  python3 ace_smooth_vocal.py --max-gap 60 # mas conservador (fusa)
Deshacer: acestudio-cli history undo
"""

import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ace_copy_sections import LANGUAGE, TPB, TRACK_INDEX, TRACK_UUID, ace, find_notes  # noqa: E402


def smooth(notes, max_gap):
    notes = sorted(notes, key=lambda n: n["pos"])
    out, changed = [], []
    for i, n in enumerate(notes):
        dur = n["dur"]
        if i + 1 < len(notes):
            gap = notes[i + 1]["pos"] - (n["pos"] + dur)
            if 0 < gap <= max_gap:
                dur += gap
                changed.append((n["pos"], gap))
            elif gap < 0:
                dur = notes[i + 1]["pos"] - n["pos"]      # nunca solapar: voz monofonica
        out.append({"pos": n["pos"], "dur": dur, "pitch": n["pitch"], "lyric": n["lyric"],
                    "language": LANGUAGE})
    return out, changed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--apply", action="store_true", help="escribir en ACE Studio (sin esto solo vista previa)")
    ap.add_argument("--max-gap", type=int, default=TPB // 4, help="hueco maximo a rellenar, en ticks (120 = semicorchea)")
    args = ap.parse_args()

    track = json.loads(ace("track", "get", "--track-index", str(TRACK_INDEX), "--json"))
    if track.get("trackUuid") != TRACK_UUID:
        sys.exit(f"La pista {TRACK_INDEX} ya no es 'Ella - Kid' ({track.get('trackName')}). No escribo nada.")
    clip = json.loads(ace("clip", "list", "--track-uuid", TRACK_UUID, "--json"))["clips"][0]
    raw = json.loads(ace("clip", "note-content", "--track-index", str(TRACK_INDEX), "--clip-index", "0", "--json"))
    notes = find_notes(raw)
    new, changed = smooth(notes, args.max_gap)

    print(f"{len(notes)} notas; {len(changed)} huecos de <= {args.max_gap} ticks rellenados "
          f"(alturas, posiciones y letra sin cambios)")
    for pos, gap in changed[:15]:
        print(f"  c{pos // (4 * TPB) + 1:02d} t{(pos % (4 * TPB)) / TPB + 1:.2f}: +{gap} ticks")
    if len(changed) > 15:
        print(f"  ... y {len(changed) - 15} mas")
    if not args.apply:
        print("\nVista previa: no se ha escrito nada. Para aplicar: python3 ace_smooth_vocal.py --apply")
        return
    backup = os.path.expanduser(f"~/bunny_notes_backup_{time.strftime('%Y%m%d_%H%M%S')}.json")
    with open(backup, "w") as fh:
        json.dump(raw, fh)
    cmd = ["clip", "replace-content", "--clip-uuid", clip["clipUuid"], "--notes", json.dumps(new), "--json"]
    if isinstance(raw, dict) and raw.get("fingerprint"):
        cmd += ["--if-match", raw["fingerprint"]]
    print(f"\nCopia de seguridad: {backup}")
    print(ace(*cmd))
    print("Hecho. Para deshacer: acestudio-cli history undo")


if __name__ == "__main__":
    main()
