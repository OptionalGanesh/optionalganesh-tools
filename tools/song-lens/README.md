# Song Lens

Private browser-based song analysis and lead-feedback MVP for Optional Ganesh.

## Run

From this folder:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## What works

- Analyze a local audio upload without sending the file to a server.
- Resolve public song-page URLs across Spotify, Apple Music, YouTube Music,
  YouTube, Deezer, Tidal, SoundCloud, Bandcamp and other catalog platforms.
- Attach an official Spotify or YouTube player when a mapped player URL exists.
- Analyze a direct audio URL when the remote server allows cross-origin access.
- Measure average RMS, peak, crest factor, section movement, stereo width,
  estimated tempo and relative tonal weight.
- Compare the result against five intention-based industry profiles.
- Save an Optional Ganesh listening lens, private reference measurements and
  reviewed lead drafts in browser `localStorage`.
- Generate editable DM, email and voice-note drafts.

## Limits

- Streaming-page links attach a cross-platform listening reference. The tool
  does not download, ingest or derive measurements from streaming-platform
  audio. A catalog-analysis provider is still required for link-only Quick Read.
- Measurements are exploratory listening support, not mastering compliance
  reports. For delivery decisions, verify with dedicated metering tools.
- Data currently lives only in the browser profile where you use the tool.
