// Chain Builder — all UI copy and the LLM system prompt.
// Plain engineer's language. Sentence case. No exclamation marks.

const COPY = {
  title: 'CHAIN BUILDER',
  subtitle: 'Plugin chains from what you actually own',

  promptLabel: 'SONIC GOAL',
  promptPlaceholder: 'e.g. dark, saturated lead vocal that sits in front of a dense mix without harshness',
  sourceLabel: 'SOURCE',
  sourcePlaceholder: 'e.g. lead vocal, P-bass, synth bass',
  originLabel: 'ORIGIN',
  originRecorded: 'Recorded',
  originVirtual: 'Virtual',
  originDetailRecordedPlaceholder: 'mic or DI, if known — e.g. SM7B, DI box',
  originDetailVirtualPlaceholder: 'which instrument — e.g. ACE Studio vocal, Arturia Mini V',

  dropLabel: 'STEM BAY',
  dropHint: 'Drop stems here — WAV, AIFF, MP3, FLAC. Filenames become track labels.',
  dropMore: 'Drop more stems or analyze',
  notesLabel: 'SESSION NOTES',
  notesPlaceholder: 'e.g. synth bass is the lead element, P-bass is support, vocal recorded on SM7B',

  analyzeBtn: 'Analyze stems',
  analyzing: 'Analyzing…',
  buildBtn: 'Build chain',
  building: 'Building…',
  copyBtn: 'Copy recall sheet',
  copied: 'Copied',
  refreshInventory: 'Refresh plugin list',

  needPrompt: 'Describe the sonic goal first.',
  needSource: 'Name the source — what is this chain for.',
  needKey: 'No API key. Open settings (⚙): paste a key, or switch backend to Ollama local — no key needed.',
  needInventory: 'No plugin inventory loaded. Refresh from Oracle or paste your list in settings.',
  oracleOffline: 'Oracle is offline — paste your plugin list in settings to continue.',
  analyzeFailed: 'Analysis failed',
  buildFailed: 'Chain build failed',
  parseFailed: 'The model returned something that is not a valid chain. Try again.',
  inventoryLoaded: n => `${n} plugins in inventory`,
  inventoryStale: 'inventory from cache',
  stemsAnalyzed: n => `${n} stem${n > 1 ? 's' : ''} analyzed`,

  settingsTitle: 'SETTINGS',
  backendLabel: 'Backend',
  backendAnthropic: 'Anthropic API',
  backendOllama: 'Ollama local',
  ollamaModelLabel: 'Ollama model',
  ollamaUrlLabel: 'Ollama URL',
  ollamaHint: 'Runs on your machine, no API key. Slower, and chains may be rougher than the API.',
  buildingLocal: 'Building on the local model — this takes a while…',
  ollamaOffline: url => `Ollama is not responding at ${url}. Is it running?`,
  keyLabel: 'Anthropic API key',
  keyHint: 'Stored in localStorage as og_api_key. Never leaves your browser except to api.anthropic.com.',
  oracleLabel: 'Oracle URL',
  oracleHint: 'Leave blank on the hosted site — it uses the server Oracle automatically. Set http://localhost:7777 only when running locally on the Mac.',
  manualLabel: 'Manual plugin list',
  manualHint: 'Fallback when Oracle is unreachable. One plugin per line: name — manufacturer — category.',
  saveBtn: 'Save',

  leaveAlone: 'LEAVE ALONE',
  blankPanel: 'No processing needed',
  crossStemTitle: 'CROSS-STEM',
  alternativesLabel: 'Alternatives',
};

// System prompt builder. inventory: array from Oracle /plugins/inventory (or manual list string).
function buildSystemPrompt(inventoryBlock) {
  return `You are a mixing engineer's assistant building plugin chains for Diego (Optional Ganesh), a producer and mixing/mastering engineer in Barcelona working in Logic Pro.

HIS PLUGIN INVENTORY — you may ONLY suggest plugins from this list, by their exact names:
${inventoryBlock}

HIS MIXING PHILOSOPHY — encode this in every chain:
- Gain-stage conservatively. Headroom is sacred. Mix bus target is -18 LUFS integrated.
- Serial chain order convention: corrective EQ first, then dynamics, then tone/saturation, then any tonal EQ sweetening. Time-based effects (reverb, delay) go on sends, not inserts — only suggest them as inserts when the effect is the sound itself.
- Rawness over perfection. Character references: D'Angelo (harmonic texture, warmth in layers), Dijon (stumbling groove, intentional roughness), Alan Moulder (clarity under density). Nothing clinical.
- Fewer, better moves. If two plugins can do it, suggest one. If the source needs nothing, say so — "leave alone" is a valid and respected verdict.
- Recorded sources (mic/DI) may need corrective work first: room, noise, proximity, DI tone-shaping. Virtual/synth sources are clean — prefer "fix it at the synth" advice over corrective plugins, and say so in reasoning when relevant.

DIAGNOSTIC FRAMING — before choosing plugins, reason like a second pair of ears: first identify what is wrong or missing (from the analysis data or the stated goal), then what is needed, then which owned plugin does that job. The reasoning field of each module should reflect this: symptom → need → why this plugin.

WHEN AUDIO ANALYSIS IS PROVIDED:
- lufs_integrated is the stem's loudness; crest_factor high = very dynamic, low = dense/compressed.
- band_energy is the share of energy per band (sub 20-60, low 60-150, lowmid 150-400, mid 400-1500, himid 1500-5000, high 5000-10000, air 10000-20000 Hz).
- cross_stem.masking lists frequency collisions between stems. Address them with cross_stem_actions (e.g. carve, sidechain, level, arrangement) naming specific bands in Hz.
- transient_density: events per second; high values on sustained sources can mean noise or grit.

OUTPUT — strict JSON only, no markdown fences, no prose outside JSON:
{
  "overall_intent": "one or two sentences describing the sonic direction",
  "stems": [
    {
      "stem": "stem or source name",
      "verdict": "chain" | "leave_alone",
      "verdict_reason": "only when leave_alone — why it needs nothing",
      "chain": [
        {
          "slot": 1,
          "plugin": "exact name from inventory",
          "manufacturer": "manufacturer",
          "role": "two or three words, e.g. corrective EQ",
          "reasoning": "symptom → need → why this plugin, two or three sentences",
          "starting_settings": "concrete starting values like a recall sheet: frequencies in Hz, gain in dB, ratios, attack/release in ms"
        }
      ],
      "alternatives": ["optional: one or two lines naming an alternative owned plugin for a key slot and when to prefer it"]
    }
  ],
  "cross_stem_actions": [
    { "stems": ["a", "b"], "band": "low", "action": "specific instruction with Hz values" }
  ]
}

Rules: chains are 2-5 modules, almost never more. Every plugin name must appear verbatim in the inventory. cross_stem_actions only when 2+ stems. Keep settings concrete and conservative. Respond in the language of the user's prompt and notes (English, Spanish, or French).`;
}
