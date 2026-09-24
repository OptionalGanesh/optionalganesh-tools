#!/usr/bin/env python3
"""
Bunny Dance - pista de voz guia para ACE Studio (Cleo & Cuquin).

Genera `bunny_dance_vocal_guide.mid` en la carpeta actual:
  - 118.0 BPM, 4/4 estricto, 480 ticks por negra.
  - 1 pista, 1 canal (0), monofonica: nunca hay dos notas solapadas.
  - Velocity constante 100.
  - 4 ciclos de 8 compases con EXACTAMENTE el mismo patron ritmico y de
    silencios. Las alturas del ciclo 3 son las del ciclo 1 + 1 semitono.
  - Eventos de letra (meta `lyrics`) por silaba, para que ACE Studio los
    importe junto con las notas.

Uso:
  pip install mido
  python3 bunny_dance_vocal_guide.py
      -> genera la guia desde el patron cuadrado definido abajo.
  python3 bunny_dance_vocal_guide.py --source cancion.mid --track 13
      -> corrige el track de voz (13) del MIDI de la cancion por secciones:
         cada VERSO se sustituye por una copia exacta del PRIMER verso y cada
         CORO (el conteo "One hop / Two hops / Three hops") por una copia
         exacta del PRIMER coro. Lo que queda fuera de esas secciones no se
         toca. Escribe <cancion>_vocal_fixed.mid (cancion completa con el
         track corregido) y bunny_dance_vocal_guide.mid (solo la voz).

      Por defecto: versos de 4 compases en 1, 9, 17, 25 y coros de 4
      compases en 5, 13, 21, 29; el ciclo 3 y 4 suben +1 semitono (igual que
      CYCLES). Si tu cancion tiene otra forma, indicalo asi (compases desde 1,
      la primera posicion de cada lista es la referencia; "@+1" = transponer):
         --verses 1,9,17@+1,25@+1 --choruses 5,13,21@+1,29@+1
         --verse-bars 4 --chorus-bars 4
"""

import argparse
import os

import mido

OUTPUT_FILE = "bunny_dance_vocal_guide.mid"
BPM = 118.0
TPB = 480                  # ticks por negra
BAR = 4 * TPB              # compas 4/4
Q = TPB                    # negra
E = TPB // 2               # corchea
H = 2 * TPB                # blanca
CHANNEL = 0
VELOCITY = 100

C4, D4, E4, F4, G4, A4, C5 = 60, 62, 64, 65, 67, 69, 72

# ---------------------------------------------------------------------------
# PATRON BASE DEL CICLO (8 compases, Do Mayor, rango C4-D5)
# Cada evento: (compas 0-7, tiempo en negras desde el inicio del compas,
#               duracion en ticks, nota, slot de letra)
# Todo cae en la rejilla de corchea. Lo que no figura aqui es silencio.
# ---------------------------------------------------------------------------
PATTERN = [
    # Compas 1: motivo C-E-G  -> "Yel-low bun-ny, hop hop hop"
    (0, 0.0, E, C4, "w1"), (0, 0.5, E, C4, "w2"),
    (0, 1.0, E, E4, "w3"), (0, 1.5, E, E4, "w4"),
    (0, 2.0, Q, G4, "hop"), (0, 3.0, E, G4, "hop"), (0, 3.5, E, G4, "hop"),
    # Compas 2: "hop hop hop" (t.1-2), "down" (t.3), "up" (t.4)
    (1, 0.0, E, G4, "hop"), (1, 0.5, E, G4, "hop"), (1, 1.0, Q, A4, "hop"),
    (1, 2.0, Q, E4, "down"),
    (1, 3.0, Q, C5, "up"),
    # Compas 3: repeticion simetrica del compas 1
    (2, 0.0, E, C4, "w1"), (2, 0.5, E, C4, "w2"),
    (2, 1.0, E, E4, "w3"), (2, 1.5, E, E4, "w4"),
    (2, 2.0, Q, G4, "hop"), (2, 3.0, E, G4, "hop"), (2, 3.5, E, G4, "hop"),
    # Compas 4: "STOP!" blanca en t.1-2 | t.3-4 SILENCIO ABSOLUTO (congelacion)
    (3, 0.0, H, C5, "STOP!"),
    # Compas 5: "One hop" (t.1-2) -> "HOP!" corchea en t.3, resto en silencio
    (4, 0.0, Q, C4, "One"), (4, 1.0, Q, E4, "hop"),
    (4, 2.0, E, G4, "HOP!"),
    # Compas 6: "Two hops" (t.1-2) -> "hop, hop" corcheas en t.3 y t.4
    (5, 0.0, Q, D4, "Two"), (5, 1.0, Q, F4, "hops"),
    (5, 2.0, E, G4, "hop,"), (5, 3.0, E, G4, "hop"),
    # Compas 7: "Three hops" (t.1-2) -> "hop, hop, hop" corcheas en 3, 3.5, 4
    (6, 0.0, Q, E4, "Three"), (6, 1.0, Q, G4, "hops"),
    (6, 2.0, E, C5, "hop,"), (6, 2.5, E, C5, "hop,"), (6, 3.0, E, C5, "hop"),
    # Compas 8: compas completo de silencio / puente
]
CYCLE_BARS = 8

# ---------------------------------------------------------------------------
# CICLOS: solo cambia la letra de las 4 primeras silabas y la transposicion.
# Ritmo, silencios y contorno son identicos en los 4 ciclos.
# ---------------------------------------------------------------------------
CYCLES = [
    {"name": "Ciclo 1 - Yellow Bunny", "transpose": 0,
     "words": ["Yel-", "low", "bun-", "ny,"]},
    {"name": "Ciclo 2 - Red Bunny", "transpose": 0,
     "words": ["Red", "red", "bun-", "ny,"]},
    {"name": "Ciclo 3 - Up and Down (+1 st)", "transpose": +1,
     "words": ["Up", "and", "down", "now,"]},
    # Tutti final: se mantiene en la tonalidad subida (+1). Cambiar a 0 para
    # volver a Do Mayor.
    {"name": "Ciclo 4 - Blue Bunny (Tutti)", "transpose": +1,
     "words": ["Blue", "blue", "bun-", "ny,"]},
]


def build_events():
    """Devuelve lista de (tick_absoluto, orden, mensaje)."""
    events = []
    for c, cycle in enumerate(CYCLES):
        base = c * CYCLE_BARS * BAR
        events.append((base, 0, mido.MetaMessage("marker", text=cycle["name"])))
        for bar, beat, dur, note, slot in PATTERN:
            start = base + bar * BAR + int(beat * TPB)
            pitch = note + cycle["transpose"]
            text = cycle["words"][int(slot[1]) - 1] if slot in ("w1", "w2", "w3", "w4") else slot
            events.append((start, 1, mido.MetaMessage("lyrics", text=text)))
            events.append((start, 2, mido.Message("note_on", channel=CHANNEL,
                                                  note=pitch, velocity=VELOCITY)))
            # orden -1: el note_off se escribe antes que un note_on en el mismo tick
            events.append((start + dur, -1, mido.Message("note_off", channel=CHANNEL,
                                                         note=pitch, velocity=0)))
    events.sort(key=lambda e: (e[0], e[1]))
    return events


def validate(events):
    notes = [e for e in events if e[2].type in ("note_on", "note_off")]
    active = None
    for tick, _, msg in notes:
        if msg.type == "note_on":
            assert active is None, f"Solapamiento en tick {tick}: voz no monofonica"
            assert msg.velocity == VELOCITY
            assert tick % E == 0, f"Nota fuera de rejilla de corchea en tick {tick}"
            active = msg.note
        else:
            assert active == msg.note
            active = None
    # Ciclos 1, 2 y 4 identicos en ritmo; ciclo 3 = ciclo 1 + 1 st exacto.
    per_cycle = [[] for _ in CYCLES]
    for tick, _, msg in notes:
        if msg.type == "note_on":
            c = tick // (CYCLE_BARS * BAR)
            per_cycle[c].append((tick % (CYCLE_BARS * BAR), msg.note))
    ref = per_cycle[0]
    for c, seq in enumerate(per_cycle):
        assert [t for t, _ in seq] == [t for t, _ in ref], f"Ritmo distinto en ciclo {c + 1}"
        shift = CYCLES[c]["transpose"]
        assert [n for _, n in seq] == [n + shift for _, n in ref], f"Alturas distintas en ciclo {c + 1}"
    pitches = [n for seq in per_cycle for _, n in seq]
    return min(pitches), max(pitches), len(ref)


def parse_sections(spec):
    """'1,9,17@+1' -> [(0, 0), (8, 0), (16, 1)]  (compas 0-based, semitonos)"""
    out = []
    for item in spec.split(","):
        bar, _, shift = item.strip().partition("@")
        out.append((int(bar) - 1, int(shift or 0)))
    return out


def read_notes(track):
    """[(inicio, fin, nota, velocity)] en ticks absolutos + el resto de mensajes."""
    tick, open_notes, notes, others = 0, {}, [], []
    for msg in track:
        tick += msg.time
        if msg.type == "note_on" and msg.velocity > 0:
            open_notes[msg.note] = (tick, msg.velocity, msg.channel)
        elif msg.type in ("note_on", "note_off"):
            if msg.note in open_notes:
                on, vel, ch = open_notes.pop(msg.note)
                notes.append((on, tick, msg.note, vel, ch))
        elif msg.type != "end_of_track":
            others.append((tick, msg))
    return notes, others, tick


def replicate_source(args):
    src = mido.MidiFile(args.source)
    tpb = src.ticks_per_beat
    ts = next((m for t in src.tracks for m in t if m.type == "time_signature"), None)
    bar = tpb * 4 * ts.numerator // ts.denominator if ts else 4 * tpb
    print(f"Fuente: {args.source} ({len(src.tracks)} tracks, {tpb} tpb, compas = {bar} ticks)")
    for i, t in enumerate(src.tracks):
        name = next((m.name for m in t if m.type == "track_name"), "")
        n = sum(1 for m in t if m.type == "note_on" and m.velocity > 0)
        print(f"  [{i:2d}] {name!r:40} {n} notas{'  <- voz' if i == args.track else ''}")

    notes, others, end_tick = read_notes(src.tracks[args.track])
    groups = [("VERSO", parse_sections(args.verses), args.verse_bars),
              ("CORO", parse_sections(args.choruses), args.chorus_bars)]

    replaced = []          # rangos [lo, hi) que se reescriben
    pasted = []            # notas nuevas
    for label, sections, nbars in groups:
        ref_bar, ref_shift = sections[0]
        lo, hi = ref_bar * bar, (ref_bar + nbars) * bar
        ref = [(on - lo, min(off, hi) - on, n - ref_shift, v, ch)
               for on, off, n, v, ch in notes if lo <= on < hi]
        if not ref:
            raise SystemExit(f"El primer {label} (compas {ref_bar + 1}) no tiene notas: "
                             "revisa --track / --verses / --choruses")
        print(f"  {label} referencia: compases {ref_bar + 1}-{ref_bar + nbars}, {len(ref)} notas")
        for sbar, shift in sections[1:]:
            base = sbar * bar
            replaced.append((base, base + nbars * bar))
            pasted += [(base + rel, base + rel + dur, n + shift, v, ch) for rel, dur, n, v, ch in ref]
            print(f"    -> {label} en compas {sbar + 1}{f' ({shift:+d} st)' if shift else ''}: copiado")

    def inside(t):
        return any(lo <= t < hi for lo, hi in replaced)

    kept = [x for x in notes if not inside(x[0])]
    # Las letras viejas de las secciones reescritas ya no coinciden con las notas
    # nuevas: se quitan (la letra se reescribe en ACE Studio).
    others = [(t, m) for t, m in others if not (m.type == "lyrics" and inside(t))]

    events = [(t, 0, m) for t, m in others]
    for on, off, n, v, ch in kept + pasted:
        events.append((on, 2, mido.Message("note_on", channel=ch, note=n, velocity=v)))
        events.append((off, 1, mido.Message("note_off", channel=ch, note=n, velocity=0)))
    events.sort(key=lambda e: (e[0], e[1]))

    new_track = mido.MidiTrack()
    last = 0
    for tick, _, msg in events:
        new_track.append(msg.copy(time=tick - last))
        last = tick
    new_track.append(mido.MetaMessage("end_of_track", time=max(0, end_tick - last)))

    full = mido.MidiFile(type=src.type, ticks_per_beat=tpb)
    full.tracks = [new_track if i == args.track else t for i, t in enumerate(src.tracks)]
    fixed = os.path.splitext(os.path.basename(args.source))[0] + "_vocal_fixed.mid"
    full.save(fixed)

    guide = mido.MidiFile(type=1, ticks_per_beat=tpb)
    conductor = mido.MidiTrack(m for m in src.tracks[0] if m.is_meta and m.type in
                               ("set_tempo", "time_signature", "end_of_track"))
    guide.tracks = [conductor, new_track]
    guide.save(OUTPUT_FILE)
    print(f"OK -> {fixed} y {OUTPUT_FILE}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", help="MIDI de la cancion con el track de voz")
    ap.add_argument("--track", type=int, default=13, help="indice del track de voz (por defecto 13)")
    ap.add_argument("--verses", default="1,9,17@+1,25@+1",
                    help="compases de inicio de cada verso; el primero es la referencia")
    ap.add_argument("--choruses", default="5,13,21@+1,29@+1",
                    help="compases de inicio de cada coro (conteo); el primero es la referencia")
    ap.add_argument("--verse-bars", type=int, default=4)
    ap.add_argument("--chorus-bars", type=int, default=4)
    args = ap.parse_args()
    if args.source:
        replicate_source(args)
        return

    events = build_events()
    low, high, per_cycle = validate(events)

    mid = mido.MidiFile(type=0, ticks_per_beat=TPB)
    track = mido.MidiTrack()
    mid.tracks.append(track)
    track.append(mido.MetaMessage("track_name", name="Bunny Dance - Vocal Guide", time=0))
    track.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM), time=0))
    track.append(mido.MetaMessage("time_signature", numerator=4, denominator=4,
                                  clocks_per_click=24, notated_32nd_notes_per_beat=8, time=0))

    last = 0
    for tick, _, msg in events:
        track.append(msg.copy(time=tick - last))
        last = tick
    # Cierre exacto al final del ultimo compas (compas 8 de silencio incluido)
    total = len(CYCLES) * CYCLE_BARS * BAR
    track.append(mido.MetaMessage("end_of_track", time=total - last))

    mid.save(OUTPUT_FILE)
    print(f"OK -> {OUTPUT_FILE}")
    print(f"  {BPM} BPM, 4/4, {len(CYCLES)} ciclos x {CYCLE_BARS} compases = "
          f"{len(CYCLES) * CYCLE_BARS} compases ({mid.length:.2f} s)")
    print(f"  {per_cycle} notas por ciclo, rango MIDI {low}-{high}, velocity {VELOCITY}, canal {CHANNEL + 1}")


if __name__ == "__main__":
    main()
