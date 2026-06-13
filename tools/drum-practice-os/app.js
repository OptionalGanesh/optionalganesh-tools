const modules = [
  {
    id: "pulse",
    title: "Pulse + Subdivision",
    kicker: "Foundation",
    minutes: 20,
    brief: "Build the internal clock first. You are training the body to feel quarter notes, eighths, and sixteenths as one stable grid.",
    listen: ["The click should confirm you, not rescue you.", "The subdivision stays even when notes disappear.", "No tempo jump when accents move."],
    cues: {
      learn: "Count 1 e & a out loud, then clap only the accents.",
      drill: "Loop 4 bars. Raise tempo only if the sound stays relaxed.",
      music: "Turn the accent line into a hi-hat phrase over kick on 1 and 3."
    },
    exercises: [
      laneExercise("Quarter-note anchor", "Hold the pulse while the hands play only the downbeats.", 56, 88, "Base", "4 bars", "H:1000100010001000 S:0000000000000000 K:1000100010001000 T:0000000000000000"),
      laneExercise("Sixteenth ghost grid", "Play all sixteenths soft, accent only the marked notes.", 52, 92, "Base", "5 min", "H:1111111111111111 S:1000100010001000 K:1000000010000000 T:0000000000000000"),
      laneExercise("Offbeat click", "Feel the click on the & without losing the quarter-note body pulse.", 45, 72, "Intermediate", "3 min", "H:0010001000100010 S:0000100000001000 K:1000000010000000 T:0000000000000000")
    ]
  },
  {
    id: "rudiments",
    title: "Rudiments",
    kicker: "Hands",
    minutes: 25,
    brief: "Rudiments are vocabulary, not gym work. Learn the sticking, control the rebound, then make it say something on the kit.",
    listen: ["Both hands sound like the same drummer.", "Second doubles do not disappear.", "Accents are clear without tension."],
    cues: {
      learn: "Say the sticking before you play it.",
      drill: "Use open-close-open: slow, faster, slow again.",
      music: "Move accents to toms and keep the unaccented notes low on snare."
    },
    exercises: [
      laneExercise("Single strokes", "Alternate R L with equal height, tone, and timing.", 50, 120, "Base", "3 curves", "H:0000000000000000 S:1111111111111111 K:1000100010001000 T:0000000000000000"),
      laneExercise("Double strokes", "Two notes per hand with controlled rebound.", 45, 105, "Base", "5 min", "H:0000000000000000 S:1100110011001100 K:1000000010000000 T:0000000000000000"),
      laneExercise("Paradiddle accents", "Use RLRR LRLL as an accent melody.", 48, 105, "Intermediate", "8 rounds", "H:1000101010001010 S:1111111111111111 K:1000000010000000 T:0000100000001000")
    ]
  },
  {
    id: "first-beats",
    title: "First Beats",
    kicker: "Kit",
    minutes: 22,
    brief: "The first usable drum language: steady hat, clear backbeat, intentional kick, relaxed body.",
    listen: ["Hi-hat stays low and even.", "Snare lands like a decision.", "Kick does not pull the hands around."],
    cues: {
      learn: "Build the groove one limb at a time.",
      drill: "Keep the hat unchanged while kick notes move.",
      music: "Play 3 bars groove, 1 bar simple fill, crash on 1."
    },
    exercises: [
      laneExercise("Money beat", "Hi-hat eighths, snare on 2 and 4, kick on 1 and 3.", 55, 105, "Base", "3 min", "H:1010101010101010 S:0000100000001000 K:1000000010000000 T:0000000000000000"),
      laneExercise("Kick variation", "Change the kick while the hat and snare stay boringly stable.", 55, 95, "Base", "8 loops", "H:1010101010101010 S:0000100000001000 K:1000101000001010 T:0000000000000000"),
      laneExercise("Crash back to 1", "Practice leaving a fill and landing the next downbeat cleanly.", 60, 100, "Intermediate", "12 reps", "H:1010101010100000 S:0000100000001111 K:1000000010000001 T:0000000000000110")
    ]
  },
  {
    id: "coordination",
    title: "Coordination",
    kicker: "Four limbs",
    minutes: 30,
    brief: "Coordination is attention design. One limb anchors, one reads, one gives form, and nothing should knock over the pulse.",
    listen: ["The anchor limb does not react to the hard part.", "Backbeat remains musical.", "Slow still feels like music."],
    cues: {
      learn: "Choose the anchor limb and protect it.",
      drill: "Add one voice at a time, then remove one and check the grid.",
      music: "Use the pattern as a groove for 60 seconds without stopping."
    },
    exercises: [
      laneExercise("Hat grid + kick reading", "Read the kick line while hat and snare hold the frame.", 50, 92, "Base", "6 min", "H:1010101010101010 S:0000100000001000 K:1000110010100010 T:0000000000000000"),
      laneExercise("Left foot checkpoint", "Add hi-hat foot on 2 and 4 without moving the hands.", 45, 85, "Intermediate", "5 min", "H:1010101010101010 S:0000100000001000 K:1000100010001010 T:0000000000000000"),
      laneExercise("Ostinato + solo voice", "Keep feet stable and let snare/toms phrase the written rhythm.", 45, 78, "Advanced", "4 rounds", "H:1000100010001000 S:1001010010010100 K:1000100010001000 T:0001000000010000")
    ]
  },
  {
    id: "groove",
    title: "Groove + Feel",
    kicker: "Pocket",
    minutes: 30,
    brief: "Groove is microdecision: where notes sit, how much they weigh, and what space they leave.",
    listen: ["The groove survives repetition.", "Ghost notes stay under the backbeat.", "Every variation has a reason."],
    cues: {
      learn: "Strip the groove to hat, kick, snare.",
      drill: "Record 30 seconds and listen only to the backbeat.",
      music: "Play it as verse, chorus, and breakdown with different dynamics."
    },
    exercises: [
      laneExercise("Backbeat authority", "Make a simple backbeat feel finished before adding anything.", 70, 105, "Base", "3 min", "H:1010101010101010 S:0000100000001000 K:1000000010100010 T:0000000000000000"),
      laneExercise("Funk with space", "Use syncopated kick and quiet ghost notes without crowding the pocket.", 72, 105, "Intermediate", "4 min", "H:1111111111111111 S:0010101000101010 K:1000110010100000 T:0000000000000000"),
      laneExercise("Behind the beat", "Place the snare slightly relaxed while the hat stays centered.", 68, 92, "Advanced", "2 min", "H:1010101010101010 S:0000100000001000 K:1000001010000010 T:0000000000000000")
    ]
  },
  {
    id: "fills",
    title: "Fills + Flow",
    kicker: "Movement",
    minutes: 28,
    brief: "A fill is not an interruption. It is a sentence that returns to the groove with the band still trusting you.",
    listen: ["The 1 is never a surprise to your body.", "Toms have shape, not panic.", "The fill answers the groove."],
    cues: {
      learn: "Sing the last beat of the fill and the next 1.",
      drill: "Loop 3 bars groove plus 1 bar fill.",
      music: "Use the same fill at three dynamic levels."
    },
    exercises: [
      laneExercise("One-bar exit", "Three bars beat, one bar simple fill, crash with kick on 1.", 60, 105, "Base", "12 reps", "H:1010101010100000 S:0000100000001111 K:1000000010000001 T:0000000000000110"),
      laneExercise("RLLK cell", "Use R L L Kick as a flow cell across snare and tom.", 45, 88, "Intermediate", "8 cycles", "H:0000000000000000 S:1000100010001000 K:0001000100010001 T:0110011001100110"),
      laneExercise("Six-note crossing", "Play a six-note idea across 4/4 and resolve clearly.", 45, 76, "Advanced", "12 bars", "H:0000000000000000 S:1011011011011011 K:0000100001000010 T:0100100100100100")
    ]
  },
  {
    id: "styles",
    title: "Styles",
    kicker: "Vocabulary",
    minutes: 35,
    brief: "A style is more than a pattern. Study role, articulation, dynamic balance, and how the drums support the song.",
    listen: ["Rock: centered backbeat.", "Funk: syncopation and ghost notes.", "Latin and jazz: ride pattern, clave, conversation."],
    cues: {
      learn: "Name the role of each limb in the style.",
      drill: "Hold the style for 2 minutes without defaulting to rock hands.",
      music: "Play along to one song and remove every fill that is not needed."
    },
    exercises: [
      laneExercise("Rock solid", "Backbeat big, kick stable, no decoration required.", 75, 120, "Base", "3 min", "H:1010101010101010 S:0000100000001000 K:1000000010100000 T:0000000000000000"),
      laneExercise("Slow R&B", "Let the space speak at low BPM.", 48, 72, "Intermediate", "5 min", "H:1000101010001010 S:0000100000001000 K:1000001000100000 T:0000000000000000"),
      laneExercise("Bossa simplified", "Separate hand pattern, soft kick, and cross-stick phrase.", 70, 115, "Intermediate", "4 min", "H:1011010010110100 S:0001001000010010 K:1000100010001000 T:0000000000000000")
    ]
  },
  {
    id: "songs",
    title: "Songs + Transfer",
    kicker: "Music",
    minutes: 40,
    brief: "Practice is only real when it survives music. Songs test form, sound, memory, restraint, and recovery.",
    listen: ["Learn the form before the fill.", "The song decides how busy you can be.", "Energy changes before pattern changes."],
    cues: {
      learn: "Map intro, verse, chorus, bridge, stops, and energy.",
      drill: "Play only kick and snare through the full form.",
      music: "Record three takes: faithful, minimal, expressive."
    },
    exercises: [
      laneExercise("Song map", "Listen once without playing and write the structure.", 60, 120, "Base", "1 song", "H:1000100010001000 S:0000100000001000 K:1000000010000000 T:0000000000000000"),
      laneExercise("Three takes", "Record faithful, minimal, and expressive versions.", 60, 120, "Intermediate", "3 takes", "H:1010101010101010 S:0000100000001000 K:1000100010100000 T:0000000000000000"),
      laneExercise("Groove replacement", "Keep the song form while replacing the base groove.", 55, 100, "Advanced", "2 passes", "H:1111111111111111 S:0000101000001010 K:1000110010001010 T:0000000000000000")
    ]
  }
];

function laneExercise(title, goal, min, max, level, length, spec) {
  const lanes = Object.fromEntries(spec.split(" ").map((part) => part.split(":")));
  return { title, goal, min, max, level, length, lanes };
}

const modeText = {
  learn: ["Understand", "Count it, sing it, and touch one surface first."],
  drill: ["Drill", "Repeat with a measurable target: time, tempo, sound, or accuracy."],
  music: ["Music", "Transfer the idea into a groove, fill, form, or song."]
};

const tasks = {
  easier: [
    "Drop the BPM by 12. Play only hat and snare until the backbeat feels automatic.",
    "Remove every second kick note. Keep counting out loud for 8 bars.",
    "Play the written pattern on one surface only. No kit orchestration yet."
  ],
  harder: [
    "Add left foot on 2 and 4. If the hands change, slow down immediately.",
    "Move the snare accents to toms every second bar while the kick stays identical.",
    "Play 3 clean loops, then raise BPM by 5. Stop when the sound changes."
  ],
  musical: [
    "Play 2 bars simple, 2 bars with variation, then 1 bar of silence before returning.",
    "Use this as a verse groove, then make a chorus version with only dynamic changes.",
    "Record 30 seconds. Listen for the 1, the backbeat, and whether the phrase breathes."
  ]
};

const SESSION_KEY = "drumPracticeSessions";
const LOG_KEY = "drumPracticeLog";
const guidedPhases = [
  {
    mode: "learn",
    title: "Understand",
    next: "Next: Drill",
    ratio: 0.15,
    text: (module) => `Count it out loud first. ${module.cues.learn}`
  },
  {
    mode: "drill",
    title: "Drill",
    next: "Next: Music",
    ratio: 0.5,
    text: (module) => `Build one clean loop at an honest tempo. ${module.cues.drill}`
  },
  {
    mode: "music",
    title: "Music",
    next: "Next: Reflect",
    ratio: 0.25,
    text: (module) => `Make it sound like a musical decision. ${module.cues.music}`
  },
  {
    mode: "music",
    title: "Reflect",
    next: "Complete session",
    ratio: 0.1,
    text: () => "Write one honest note: what improved, and what still falls apart?"
  }
];

const state = {
  moduleIndex: 0,
  exerciseIndex: 0,
  mode: "learn",
  query: "",
  timer: null,
  secondsLeft: 20 * 60,
  blockMinutes: 20,
  step: 0,
  beat: 0,
  sound: true,
  audio: null,
  guidedPhase: 0,
  sessionStartedAt: null,
  sessionCompleted: false,
  completedMessage: "",
  recommendedModuleIndex: 0,
  lastSessionId: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const els = {
  searchInput: $("#searchInput"),
  moduleNav: $("#moduleNav"),
  modeButtons: $$(".mode-button"),
  recommendedModule: $("#recommendedModule"),
  recommendationReason: $("#recommendationReason"),
  streakSummary: $("#streakSummary"),
  startToday: $("#startToday"),
  continueLast: $("#continueLast"),
  toggleModules: $("#toggleModules"),
  sidebarCurriculum: $("#sidebarCurriculum"),
  moduleKicker: $("#moduleKicker"),
  moduleTitle: $("#moduleTitle"),
  moduleBrief: $("#moduleBrief"),
  todayMinutes: $("#todayMinutes"),
  todayFocus: $("#todayFocus"),
  learnCue: $("#learnCue"),
  drillCue: $("#drillCue"),
  musicCue: $("#musicCue"),
  exerciseTitle: $("#exerciseTitle"),
  exerciseGoal: $("#exerciseGoal"),
  exerciseMeta: $("#exerciseMeta"),
  exerciseProgress: $("#exerciseProgress"),
  patternName: $("#patternName"),
  laneGrid: $("#laneGrid"),
  practiceSteps: $("#practiceSteps"),
  listenList: $("#listenList"),
  prevExercise: $("#prevExercise"),
  nextExercise: $("#nextExercise"),
  copyPattern: $("#copyPattern"),
  bpm: $("#bpm"),
  bpmValue: $("#bpmValue"),
  clickMode: $("#clickMode"),
  blockLength: $("#blockLength"),
  timerDisplay: $("#timerDisplay"),
  clickSummary: $("#clickSummary"),
  countStrip: $("#countStrip"),
  beatDots: $("#beatDots"),
  startStop: $("#startStop"),
  resetTimer: $("#resetTimer"),
  soundToggle: $("#soundToggle"),
  randomTask: $("#randomTask"),
  taskPrompt: $("#taskPrompt"),
  journalInput: $("#journalInput"),
  saveLog: $("#saveLog"),
  clearLog: $("#clearLog"),
  logList: $("#logList"),
  progressStats: $("#progressStats"),
  sessionList: $("#sessionList"),
  sessionStepCount: $("#sessionStepCount"),
  sessionStepTitle: $("#sessionStepTitle"),
  sessionStepTime: $("#sessionStepTime"),
  sessionStepText: $("#sessionStepText"),
  sessionNext: $("#sessionNext"),
  sessionRestart: $("#sessionRestart"),
  sessionCompleteMessage: $("#sessionCompleteMessage"),
  sessionRunner: $("#sessionRunner"),
  mobileMode: $("#mobileMode"),
  mobileTimer: $("#mobileTimer"),
  mobileBpmValue: $("#mobileBpmValue"),
  mobileBpmDown: $("#mobileBpmDown"),
  mobileBpmUp: $("#mobileBpmUp"),
  mobileStartStop: $("#mobileStartStop"),
  mobileReset: $("#mobileReset")
};

function currentModule() {
  return modules[state.moduleIndex];
}

function currentExercise() {
  return currentModule().exercises[state.exerciseIndex];
}

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function sessions() {
  return readStoredArray(SESSION_KEY);
}

function localDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function weeklyPracticeDays(items = sessions()) {
  const weekAgo = Date.now() - (7 * 86400000);
  return new Set(
    items
      .filter((session) => new Date(session.completedAt).getTime() >= weekAgo)
      .map((session) => session.localDate || localDay(session.completedAt))
      .filter(Boolean)
  );
}

function recommendation() {
  const latest = sessions()[0];
  if (latest) {
    const lastIndex = modules.findIndex((module) => module.title === latest.module);
    const index = lastIndex >= 0 ? (lastIndex + 1) % modules.length : 0;
    return { index, reason: `Suggested after ${latest.module}.` };
  }

  const hour = new Date().getHours();
  if (hour < 12) return { index: 0, reason: "Morning focus: build the internal clock." };
  if (hour < 18) return { index: 4, reason: "Afternoon focus: settle into the pocket." };
  return { index: 5, reason: "Evening focus: move through the kit and land on 1." };
}

function filteredModules() {
  const q = state.query.trim().toLowerCase();
  if (!q) return modules.map((module, index) => ({ module, index }));
  return modules
    .map((module, index) => ({ module, index }))
    .filter(({ module }) => {
      const haystack = [
        module.title,
        module.kicker,
        module.brief,
        ...module.listen,
        ...module.exercises.flatMap((exercise) => [exercise.title, exercise.goal, exercise.level])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
}

function renderNav() {
  const items = filteredModules();
  els.moduleNav.innerHTML = items.map(({ module, index }) => `
    <button class="module-button ${index === state.moduleIndex ? "active" : ""} ${index === state.recommendedModuleIndex ? "recommended" : ""}" data-index="${index}" aria-current="${index === state.moduleIndex ? "true" : "false"}">
      <strong>${module.title}</strong>
      <span>${module.kicker} · ${module.exercises.length} exercises · ${module.minutes} min</span>
    </button>
  `).join("") || `<p class="empty-state">No matching skills.</p>`;
}

function renderModule() {
  const module = currentModule();
  const exercise = currentExercise();
  syncExerciseTempo(exercise);
  renderBlockOptions(module);
  els.moduleKicker.textContent = module.kicker;
  els.moduleTitle.textContent = module.title;
  els.moduleBrief.textContent = module.brief;
  els.todayMinutes.textContent = `${module.minutes} min`;
  els.todayFocus.textContent = modeText[state.mode][1];
  els.learnCue.textContent = module.cues.learn;
  els.drillCue.textContent = module.cues.drill;
  els.musicCue.textContent = module.cues.music;
  els.exerciseTitle.textContent = exercise.title;
  els.exerciseGoal.textContent = exercise.goal;
  els.exerciseMeta.innerHTML = [
    `${exercise.min}-${exercise.max} BPM`,
    exercise.length,
    exercise.level,
    `${state.exerciseIndex + 1}/${module.exercises.length}`
  ].map((item) => `<span>${item}</span>`).join("");
  els.patternName.textContent = `${exercise.title} · 16 steps`;
  renderLanes(exercise);
  renderCoach(module, exercise);
  renderExerciseProgress();
  renderTask("musical");
}

function renderLanes(exercise) {
  const labels = [
    ["H", "Hat / Ride", "hat"],
    ["S", "Snare", "snare"],
    ["K", "Kick", "kick"],
    ["T", "Toms", "tom"]
  ];
  els.laneGrid.setAttribute("aria-label", `Drum pattern lanes. ${labels.map(([voice, label]) => `${label}: ${exercise.lanes[voice] || "0000000000000000"}`).join(". ")}`);
  els.laneGrid.innerHTML = labels.map(([voice, label, css]) => {
    const pattern = exercise.lanes[voice] || "0000000000000000";
    const cells = pattern.split("").map((value, index) => {
      const classes = ["cell", value === "1" ? `on ${css}` : "", index % 4 === 0 ? "beat" : ""].join(" ");
      return `<span class="${classes}" data-step="${index}" aria-hidden="true"></span>`;
    }).join("");
    return `
      <div class="lane">
        <div class="lane-label"><span class="voice-chip">${voice}</span>${label}</div>
        <div class="lane-steps">${cells}</div>
      </div>
    `;
  }).join("");
}

function renderCoach(module, exercise) {
  const modeSteps = {
    learn: [
      "Count the rhythm out loud without playing.",
      "Clap or tap the main accents on one surface.",
      "Add one limb only when the count stays stable."
    ],
    drill: [
      `Start at ${exercise.min} BPM and loop for 2 minutes.`,
      "Fix one thing: timing, tone, dynamics, or relaxation.",
      "Raise 5 BPM only if the last loop sounded identical."
    ],
    music: [
      "Play 2 bars groove, 1 bar variation, 1 bar return.",
      "Use the pattern as a fill and land cleanly on 1.",
      "Record 30 seconds and write one honest note."
    ]
  };
  els.practiceSteps.innerHTML = modeSteps[state.mode].map((step) => `<li>${step}</li>`).join("");
  els.listenList.innerHTML = module.listen.map((item) => `<li>${item}</li>`).join("");
}

function renderBeatDots() {
  els.beatDots.innerHTML = [0, 1, 2, 3].map((beat) => `<span class="beat-dot ${beat === state.beat ? "active" : ""}"></span>`).join("");
}

function renderCountStrip() {
  const counts = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];
  els.countStrip.innerHTML = counts.map((count, step) => `
    <span class="${[
      step === state.step ? "active" : "",
      shouldClick(step) ? "click-step" : ""
    ].filter(Boolean).join(" ")}">${count}</span>
  `).join("");
}

function renderTimer() {
  const minutes = Math.floor(state.secondsLeft / 60);
  const seconds = state.secondsLeft % 60;
  els.timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  els.mobileTimer.textContent = els.timerDisplay.textContent;
}

function renderClickSummary() {
  const bpm = Number(els.bpm.value);
  const mode = els.clickMode.value;
  const labels = {
    quarter: ["Quarter click", bpm],
    eighth: ["Eighth click", bpm * 2],
    sixteenth: ["Sixteenth click", bpm * 4],
    pattern: ["Pattern notes", patternClicksPerBar() * bpm / 4]
  };
  const [label, clicksPerMinute] = labels[mode];
  els.clickSummary.textContent = `${label} · ${Math.round(clicksPerMinute)}/min`;
  els.mobileBpmValue.textContent = els.bpm.value;
}

function syncExerciseTempo(exercise) {
  els.bpm.min = exercise.min;
  els.bpm.max = exercise.max;
  const currentBpm = Number(els.bpm.value);
  if (currentBpm < exercise.min || currentBpm > exercise.max) {
    els.bpm.value = exercise.min;
  }
  els.bpmValue.textContent = els.bpm.value;
  els.mobileBpmValue.textContent = els.bpm.value;
}

function renderBlockOptions(module) {
  const options = [5, 10, 20, 30, module.minutes]
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((a, b) => a - b);
  els.blockLength.innerHTML = options.map((minutes) => `
    <option value="${minutes}" ${minutes === state.blockMinutes ? "selected" : ""}>${minutes} min</option>
  `).join("");
}

function renderTask(kind = randomItem(["easier", "harder", "musical"])) {
  const module = currentModule();
  const exercise = currentExercise();
  const prompt = randomItem(tasks[kind]);
  els.taskPrompt.textContent = `${exercise.title}: ${prompt}`;
  els.taskPrompt.dataset.kind = kind;
  els.todayFocus.textContent = `${modeText[state.mode][0]}: ${module.cues[state.mode === "drill" ? "drill" : state.mode]}`;
}

function renderLogs() {
  const logs = readStoredArray(LOG_KEY);
  if (!logs.length) {
    els.logList.innerHTML = "";
    return;
  }
  els.logList.innerHTML = logs.slice(0, 5).map((log) => `
    <div class="log-item">
      <strong>${escapeHtml(log.date)} · ${escapeHtml(log.module)}</strong>
      <span>${escapeHtml(log.text)}</span>
    </div>
  `).join("");
}

function renderRecommendation(currentRecommendation = recommendation()) {
  const items = sessions();
  const streak = weeklyPracticeDays(items).size;
  const latest = items[0];
  els.recommendedModule.textContent = modules[currentRecommendation.index].title;
  els.recommendationReason.textContent = currentRecommendation.reason;
  els.streakSummary.textContent = streak
    ? `${streak} practice day${streak === 1 ? "" : "s"} in the last 7 days`
    : "First session this week";
  els.continueLast.hidden = !latest;
  if (latest) {
    els.continueLast.textContent = `Continue ${latest.module}`;
  }
}

function renderExerciseProgress() {
  const exercise = currentExercise();
  const matching = sessions().filter((session) => (
    session.module === currentModule().title && session.exercise === exercise.title
  ));

  if (!matching.length) {
    els.exerciseProgress.textContent = "New exercise · set a clean baseline today.";
    return;
  }

  const cleanBpm = Math.max(...matching.map((session) => Number(session.bpm) || 0));
  const lastDate = new Date(matching[0].completedAt).toLocaleDateString("en-GB", { dateStyle: "medium" });
  els.exerciseProgress.textContent = `Best clean tempo ${cleanBpm} BPM · last practiced ${lastDate}`;
}

function renderProgress() {
  const items = sessions();
  const streak = weeklyPracticeDays(items).size;
  const moduleSessions = items.filter((session) => session.module === currentModule().title);
  const bestBpm = moduleSessions.length
    ? Math.max(...moduleSessions.map((session) => Number(session.bpm) || 0))
    : 0;

  els.progressStats.innerHTML = [
    ["Sessions", items.length],
    ["Practice days", streak],
    ["Module best", bestBpm ? `${bestBpm} BPM` : "New"]
  ].map(([label, value]) => `
    <div>
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  els.sessionList.innerHTML = items.slice(0, 3).map((session) => `
    <div class="session-item">
      <strong>${escapeHtml(session.module)} · ${escapeHtml(session.exercise)}</strong>
      <span>${new Date(session.completedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} · ${session.bpm} BPM · ${formatDuration(session.durationSeconds)}</span>
    </div>
  `).join("");
}

function formatDuration(seconds) {
  if (seconds < 60) return "<1 min";
  return `${Math.round(seconds / 60)} min`;
}

function phaseMinutes(phase) {
  return Math.max(1, Math.round(currentModule().minutes * phase.ratio));
}

function renderGuidedSession() {
  const phase = guidedPhases[state.guidedPhase];
  els.sessionStepCount.textContent = `Step ${state.guidedPhase + 1} of ${guidedPhases.length}`;
  els.sessionStepTitle.textContent = phase.title;
  els.sessionStepTime.textContent = `${phaseMinutes(phase)} min`;
  els.sessionStepText.textContent = phase.text(currentModule());
  els.sessionNext.textContent = state.sessionCompleted ? "Session saved" : phase.next;
  els.sessionNext.disabled = state.sessionCompleted;
  els.sessionCompleteMessage.textContent = state.completedMessage;
}

function syncMobileControls() {
  els.mobileMode.textContent = modeText[state.mode][0];
  els.mobileBpmValue.textContent = els.bpm.value;
  els.mobileStartStop.textContent = state.timer ? "Pause" : "Start";
}

function render() {
  const currentRecommendation = recommendation();
  state.recommendedModuleIndex = currentRecommendation.index;
  renderNav();
  els.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  els.bpmValue.textContent = els.bpm.value;
  renderModule();
  renderTimer();
  renderClickSummary();
  renderCountStrip();
  renderBeatDots();
  renderRecommendation(currentRecommendation);
  renderGuidedSession();
  renderProgress();
  renderLogs();
  syncMobileControls();
}

function setExercise(nextIndex) {
  const total = currentModule().exercises.length;
  state.exerciseIndex = (nextIndex + total) % total;
  restartGuidedSession(false);
  stopClock();
  render();
}

function setModule(nextIndex) {
  state.moduleIndex = nextIndex;
  state.exerciseIndex = 0;
  state.blockMinutes = currentModule().minutes;
  restartGuidedSession(false);
  stopClock();
  state.step = 0;
  state.beat = 0;
  state.secondsLeft = state.blockMinutes * 60;
  render();
}

function setBlockLength() {
  state.blockMinutes = Number(els.blockLength.value);
  state.secondsLeft = state.blockMinutes * 60;
  renderTimer();
}

function startClock() {
  stopClock(false);
  if (!state.sessionStartedAt) state.sessionStartedAt = Date.now();
  state.startStop = true;
  els.startStop.textContent = "Pause";
  els.mobileStartStop.textContent = "Pause";
  const intervalMs = (60000 / Number(els.bpm.value)) / 4;
  highlightStep();
  renderCountStrip();
  renderBeatDots();
  playClickForStep(state.step);
  state.timer = window.setInterval(() => {
    state.step = (state.step + 1) % 16;
    state.beat = Math.floor(state.step / 4);
    highlightStep();
    renderCountStrip();
    renderBeatDots();
    playClickForStep(state.step);
  }, intervalMs);
  state.countdown = window.setInterval(() => {
    state.secondsLeft = Math.max(0, state.secondsLeft - 1);
    renderTimer();
    if (state.secondsLeft === 0) stopClock();
  }, 1000);
}

function stopClock(updateLabel = true) {
  window.clearInterval(state.timer);
  window.clearInterval(state.countdown);
  state.timer = null;
  state.countdown = null;
  $$(".cell.playing").forEach((cell) => cell.classList.remove("playing"));
  if (updateLabel) {
    els.startStop.textContent = "Start";
    els.mobileStartStop.textContent = "Start";
  }
}

function resetClock() {
  stopClock();
  state.step = 0;
  state.beat = 0;
  setBlockLength();
  highlightStep();
  renderCountStrip();
  renderBeatDots();
}

function highlightStep() {
  $$(".cell").forEach((cell) => cell.classList.toggle("playing", Number(cell.dataset.step) === state.step));
}

function shouldClick(step) {
  const mode = els.clickMode.value;
  if (mode === "quarter") return step % 4 === 0;
  if (mode === "eighth") return step % 2 === 0;
  if (mode === "sixteenth") return true;
  if (mode === "pattern") {
    const lanes = currentExercise().lanes;
    return Object.values(lanes).some((pattern) => pattern[step] === "1");
  }
  return false;
}

function patternClicksPerBar() {
  const lanes = currentExercise().lanes;
  return Array.from({ length: 16 }, (_, step) => (
    Object.values(lanes).some((pattern) => pattern[step] === "1")
  )).filter(Boolean).length;
}

function playClickForStep(step) {
  if (!shouldClick(step)) return;
  const mode = els.clickMode.value;
  const isQuarter = step % 4 === 0;
  const isEighth = step % 2 === 0;
  const strength = isQuarter ? "accent" : isEighth ? "medium" : "subdivision";
  playClick(mode === "pattern" ? patternAccentForStep(step) : strength);
}

function patternAccentForStep(step) {
  const lanes = currentExercise().lanes;
  if (lanes.K?.[step] === "1" || step % 4 === 0) return "accent";
  if (lanes.S?.[step] === "1") return "medium";
  return "subdivision";
}

function playClick(strength) {
  if (!state.sound) return;
  if (!state.audio) state.audio = new AudioContext();
  const now = state.audio.currentTime;
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  const settings = {
    accent: [1200, 0.085],
    medium: [820, 0.052],
    subdivision: [520, 0.032]
  }[strength];
  osc.type = "square";
  osc.frequency.value = settings[0];
  gain.gain.setValueAtTime(settings[1], now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  osc.connect(gain);
  gain.connect(state.audio.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}

function copyPattern() {
  const exercise = currentExercise();
  const text = Object.entries(exercise.lanes).map(([voice, pattern]) => `${voice}: ${pattern}`).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    els.copyPattern.textContent = "Copied";
    window.setTimeout(() => { els.copyPattern.textContent = "Copy pattern"; }, 900);
  });
}

function saveLog() {
  const text = els.journalInput.value.trim();
  if (!text) return;
  const logs = readStoredArray(LOG_KEY);
  logs.unshift({
    date: new Date().toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }),
    module: currentModule().title,
    exercise: currentExercise().title,
    sessionId: state.lastSessionId,
    text
  });
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 20)));
  els.journalInput.value = "";
  renderLogs();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function restartGuidedSession(shouldRender = true) {
  state.guidedPhase = 0;
  state.mode = guidedPhases[0].mode;
  state.sessionStartedAt = null;
  state.sessionCompleted = false;
  state.completedMessage = "";
  if (shouldRender) render();
}

function completeGuidedSession() {
  if (state.sessionCompleted) return;
  stopClock();
  const completedAt = new Date();
  const elapsed = state.sessionStartedAt ? Math.round((Date.now() - state.sessionStartedAt) / 1000) : 1;
  const session = {
    id: globalThis.crypto?.randomUUID?.() || `${completedAt.getTime()}`,
    completedAt: completedAt.toISOString(),
    localDate: localDay(completedAt),
    module: currentModule().title,
    exercise: currentExercise().title,
    mode: state.mode,
    bpm: Number(els.bpm.value),
    durationSeconds: Math.max(1, elapsed)
  };
  const items = sessions();
  items.unshift(session);
  localStorage.setItem(SESSION_KEY, JSON.stringify(items.slice(0, 100)));
  state.lastSessionId = session.id;
  state.sessionCompleted = true;
  state.completedMessage = "Session saved. Write one honest note while the feeling is fresh.";
  render();
  els.journalInput.focus();
}

function nextGuidedPhase() {
  if (state.guidedPhase === guidedPhases.length - 1) {
    completeGuidedSession();
    return;
  }
  state.guidedPhase += 1;
  state.mode = guidedPhases[state.guidedPhase].mode;
  state.sessionCompleted = false;
  state.completedMessage = "";
  render();
}

function startRecommendedSession() {
  const currentRecommendation = recommendation();
  setModule(currentRecommendation.index);
  state.sessionStartedAt = Date.now();
  state.sessionCompleted = false;
  state.completedMessage = "";
  render();
  els.sidebarCurriculum.classList.remove("open");
  els.toggleModules.setAttribute("aria-expanded", "false");
  els.sessionRunner.scrollIntoView({ behavior: "smooth", block: "start" });
}

function continueLastSession() {
  const latest = sessions()[0];
  if (!latest) return;
  const moduleIndex = modules.findIndex((module) => module.title === latest.module);
  if (moduleIndex < 0) return;
  setModule(moduleIndex);
  const exerciseIndex = currentModule().exercises.findIndex((exercise) => exercise.title === latest.exercise);
  state.exerciseIndex = exerciseIndex >= 0 ? exerciseIndex : 0;
  state.sessionStartedAt = Date.now();
  state.sessionCompleted = false;
  state.completedMessage = "";
  render();
  els.sidebarCurriculum.classList.remove("open");
  els.toggleModules.setAttribute("aria-expanded", "false");
  els.sessionRunner.scrollIntoView({ behavior: "smooth", block: "start" });
}

function adjustBpm(delta) {
  const nextValue = Math.min(Number(els.bpm.max), Math.max(Number(els.bpm.min), Number(els.bpm.value) + delta));
  els.bpm.value = String(nextValue);
  els.bpm.dispatchEvent(new Event("input", { bubbles: true }));
}

els.moduleNav.addEventListener("click", (event) => {
  const button = event.target.closest(".module-button");
  if (!button) return;
  setModule(Number(button.dataset.index));
  els.sidebarCurriculum.classList.remove("open");
  els.toggleModules.setAttribute("aria-expanded", "false");
});

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    state.guidedPhase = Math.max(0, guidedPhases.findIndex((phase) => phase.mode === state.mode));
    state.sessionCompleted = false;
    state.completedMessage = "";
    render();
  });
});

els.searchInput.addEventListener("input", () => {
  state.query = els.searchInput.value;
  renderNav();
});

els.prevExercise.addEventListener("click", () => setExercise(state.exerciseIndex - 1));
els.nextExercise.addEventListener("click", () => setExercise(state.exerciseIndex + 1));
els.copyPattern.addEventListener("click", copyPattern);
els.bpm.addEventListener("input", () => {
  els.bpmValue.textContent = els.bpm.value;
  renderClickSummary();
  if (state.timer) startClock();
});
els.clickMode.addEventListener("change", () => {
  renderClickSummary();
  renderCountStrip();
  if (state.timer) playClickForStep(state.step);
});
els.blockLength.addEventListener("change", resetClock);
els.startStop.addEventListener("click", () => state.timer ? stopClock() : startClock());
els.resetTimer.addEventListener("click", resetClock);
els.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  els.soundToggle.setAttribute("aria-pressed", String(state.sound));
  els.soundToggle.textContent = state.sound ? "Sound on" : "Sound off";
});
els.randomTask.addEventListener("click", () => renderTask());
$$("[data-task]").forEach((button) => button.addEventListener("click", () => renderTask(button.dataset.task)));
els.saveLog.addEventListener("click", saveLog);
els.clearLog.addEventListener("click", () => {
  localStorage.removeItem(LOG_KEY);
  renderLogs();
});
els.startToday.addEventListener("click", startRecommendedSession);
els.continueLast.addEventListener("click", continueLastSession);
els.toggleModules.addEventListener("click", () => {
  const isOpen = els.sidebarCurriculum.classList.toggle("open");
  els.toggleModules.setAttribute("aria-expanded", String(isOpen));
});
els.sessionNext.addEventListener("click", nextGuidedPhase);
els.sessionRestart.addEventListener("click", () => restartGuidedSession());
els.mobileStartStop.addEventListener("click", () => state.timer ? stopClock() : startClock());
els.mobileReset.addEventListener("click", resetClock);
els.mobileBpmDown.addEventListener("click", () => adjustBpm(-5));
els.mobileBpmUp.addEventListener("click", () => adjustBpm(5));

document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName;
  if (["INPUT", "SELECT", "TEXTAREA"].includes(tag)) return;
  if (event.code === "Space") {
    event.preventDefault();
    state.timer ? stopClock() : startClock();
  } else if (event.key === "ArrowLeft") {
    setExercise(state.exerciseIndex - 1);
  } else if (event.key === "ArrowRight") {
    setExercise(state.exerciseIndex + 1);
  } else if (event.key.toLowerCase() === "r") {
    resetClock();
  }
});

setBlockLength();
render();
