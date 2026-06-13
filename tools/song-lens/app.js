const STORAGE_KEYS = {
  taste: "song-lens:taste",
  references: "song-lens:references",
  history: "song-lens:history",
  profile: "song-lens:profile",
};

const industryProfiles = {
  balanced: {
    name: "Balanced release",
    description:
      "A broad modern baseline: controlled enough to translate, dynamic enough to retain a point of view.",
    ranges: {
      rms: [-16, -10.5],
      dynamicSpread: [6, 12],
      width: [26, 68],
      low: [15, 31],
      presence: [15, 31],
      crest: [7, 15],
    },
  },
  intimate: {
    name: "Intimate alt-pop",
    description:
      "Close vocal, intentional negative space, emotional movement before maximum density.",
    ranges: {
      rms: [-17, -11],
      dynamicSpread: [7, 15],
      width: [22, 62],
      low: [13, 27],
      presence: [17, 34],
      crest: [8, 16],
    },
  },
  vocal: {
    name: "Vocal-forward urban",
    description:
      "A stable foundation and clear vocal focus. Density is welcome when hierarchy remains legible.",
    ranges: {
      rms: [-14, -8.5],
      dynamicSpread: [4.5, 10],
      width: [24, 64],
      low: [19, 35],
      presence: [16, 32],
      crest: [6, 13],
    },
  },
  club: {
    name: "Club / low-end driven",
    description:
      "Weight, repetition and physical translation. Low-end confidence matters more than delicacy.",
    ranges: {
      rms: [-13, -7.5],
      dynamicSpread: [3.5, 9],
      width: [30, 74],
      low: [24, 42],
      presence: [11, 27],
      crest: [5, 12],
    },
  },
  songwriter: {
    name: "Dynamic songwriter",
    description:
      "Performance and narrative first. More breathing room, fewer assumptions about loudness.",
    ranges: {
      rms: [-20, -12],
      dynamicSpread: [9, 19],
      width: [16, 56],
      low: [11, 27],
      presence: [15, 34],
      crest: [10, 19],
    },
  },
};

const defaultTaste = {
  emotionalContrast: 88,
  vocalIntention: 82,
  humanDynamics: 74,
  textureRisk: 68,
  lowEndRestraint: 71,
  notes:
    "Protect the emotional reason for the song. Prefer hierarchy over density. Look for one memorable production decision, not ten decorative ones.",
};

const tasteLabels = {
  emotionalContrast: "Emotional contrast",
  vocalIntention: "Vocal intention",
  humanDynamics: "Human dynamics",
  textureRisk: "Texture / risk",
  lowEndRestraint: "Low-end restraint",
};

const sampleMetrics = {
  duration: 218,
  channels: 2,
  sampleRate: 48000,
  rms: -12.8,
  peak: -1.1,
  crest: 11.7,
  dynamicSpread: 8.7,
  width: 48,
  correlation: 0.61,
  tempo: 104,
  tone: { low: 26, lowMid: 20, mid: 23, presence: 19, air: 12 },
  sections: [-20, -17, -15, -13, -16, -11.8, -10.8, -12.2, -14.5, -10.1, -9.7, -12.3],
};

const state = {
  metrics: { ...sampleMetrics, tone: { ...sampleMetrics.tone }, sections: [...sampleMetrics.sections] },
  trackTitle: "Example / Midnight Static",
  sessionType: "example",
  streamingContext: null,
  quickRead: null,
  spotifyFeatures: null,
  profileId: localStorage.getItem(STORAGE_KEYS.profile) || "intimate",
  taste: loadJSON(STORAGE_KEYS.taste, defaultTaste),
  references: loadJSON(STORAGE_KEYS.references, []),
  history: loadJSON(STORAGE_KEYS.history, []),
};

const els = {
  tabs: [...document.querySelectorAll(".tab-button[data-view]")],
  views: [...document.querySelectorAll(".view")],
  songTitle: document.querySelector("#song-title"),
  audioUrl: document.querySelector("#audio-url"),
  analyzeUrl: document.querySelector("#analyze-url"),
  audioFile: document.querySelector("#audio-file"),
  dropZone: document.querySelector(".drop-zone"),
  streamingContext: document.querySelector("#streaming-context"),
  streamingProvider: document.querySelector("#streaming-provider"),
  streamingTitle: document.querySelector("#streaming-title"),
  streamingThumbnail: document.querySelector("#streaming-thumbnail"),
  streamingNote: document.querySelector("#streaming-note"),
  streamingLink: document.querySelector("#streaming-link"),
  streamingEmbed: document.querySelector("#streaming-embed"),
  streamingAlternatives: document.querySelector("#streaming-alternatives"),
  runQuickRead: document.querySelector("#run-quick-read"),
  quickReadContextStatus: document.querySelector("#quick-read-context-status"),
  removeStreamingContext: document.querySelector("#remove-streaming-context"),
  loadExample: document.querySelector("#load-example"),
  processStatus: document.querySelector("#process-status"),
  resultTitle: document.querySelector("#result-title"),
  resultMeta: document.querySelector("#result-meta"),
  sessionChip: document.querySelector("#session-chip"),
  draftSource: document.querySelector("#draft-source"),
  metricRms: document.querySelector("#metric-rms"),
  metricDynamics: document.querySelector("#metric-dynamics"),
  metricWidth: document.querySelector("#metric-width"),
  metricTempo: document.querySelector("#metric-tempo"),
  contrastValue: document.querySelector("#contrast-value"),
  energyChart: document.querySelector("#energy-chart"),
  toneChart: document.querySelector("#tone-chart"),
  analysisResults: document.querySelector("#analysis-results"),
  analysisNotice: document.querySelector("#analysis-notice"),
  analysisNoticeTitle: document.querySelector("#analysis-notice-title"),
  analysisNoticeCopy: document.querySelector("#analysis-notice-copy"),
  quickReadResults: document.querySelector("#quick-read-results"),
  quickReadChip: document.querySelector("#quick-read-chip"),
  quickReadStatus: document.querySelector("#quick-read-status"),
  quickReadMetrics: document.querySelector("#quick-read-metrics"),
  quickBpm: document.querySelector("#quick-bpm"),
  quickKey: document.querySelector("#quick-key"),
  quickEnergy: document.querySelector("#quick-energy"),
  quickVoice: document.querySelector("#quick-voice"),
  quickCaption: document.querySelector("#quick-caption"),
  quickTags: document.querySelector("#quick-tags"),
  industryProfileTitle: document.querySelector("#industry-profile-title"),
  industryObservations: document.querySelector("#industry-observations"),
  tasteObservations: document.querySelector("#taste-observations"),
  jumpMessage: document.querySelector("#jump-message"),
  industryProfile: document.querySelector("#industry-profile"),
  profileDescription: document.querySelector("#profile-description"),
  profileRanges: document.querySelector("#profile-ranges"),
  tasteSliders: document.querySelector("#taste-sliders"),
  tasteNotes: document.querySelector("#taste-notes"),
  resetTaste: document.querySelector("#reset-taste"),
  saveTaste: document.querySelector("#save-taste"),
  referenceName: document.querySelector("#reference-name"),
  saveReference: document.querySelector("#save-reference"),
  referencesList: document.querySelector("#references-list"),
  leadName: document.querySelector("#lead-name"),
  messageFormat: document.querySelector("#message-format"),
  serviceFocus: document.querySelector("#service-focus"),
  personalLine: document.querySelector("#personal-line"),
  regenerateMessage: document.querySelector("#regenerate-message"),
  messageDraft: document.querySelector("#message-draft"),
  copyMessage: document.querySelector("#copy-message"),
  saveMessage: document.querySelector("#save-message"),
  clearHistory: document.querySelector("#clear-history"),
  messageHistory: document.querySelector("#message-history"),
  toast: document.querySelector("#toast"),
};

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatNumber(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits).replace("-", "−") : "—";
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function setStatus(message) {
  els.processStatus.textContent = message;
}

let toastTimer;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function switchView(viewName) {
  els.tabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });
  els.views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.viewPanel === viewName);
  });
  window.scrollTo({ top: document.querySelector(".workspace").offsetTop, behavior: "smooth" });
  resizeStudioEngines();
}

function resizeStudioEngines() {
  document.querySelectorAll(".studio-engine").forEach((frame) => {
    try {
      const height = frame.contentDocument?.documentElement?.scrollHeight;
      if (height) frame.style.height = `${Math.max(height + 8, 520)}px`;
    } catch {
      // The embedded engine remains usable at its minimum height.
    }
  });
}

function getProfile() {
  return industryProfiles[state.profileId] || industryProfiles.intimate;
}

function renderProfileOptions() {
  els.industryProfile.innerHTML = Object.entries(industryProfiles)
    .map(
      ([id, profile]) =>
        `<option value="${id}" ${id === state.profileId ? "selected" : ""}>${profile.name}</option>`,
    )
    .join("");
}

function renderProfile() {
  const profile = getProfile();
  els.industryProfileTitle.textContent = profile.name;
  els.profileDescription.textContent = profile.description;
  const labels = {
    rms: "Average RMS",
    dynamicSpread: "Dynamic spread",
    width: "Stereo width",
    low: "Low-end weight",
    presence: "Presence weight",
    crest: "Crest factor",
  };
  const units = {
    rms: "dBFS",
    dynamicSpread: "dB",
    width: "%",
    low: "%",
    presence: "%",
    crest: "dB",
  };
  els.profileRanges.innerHTML = Object.entries(profile.ranges)
    .map(
      ([key, range]) =>
        `<div class="range-row"><span>${labels[key]}</span><b>${range[0]}–${range[1]} ${units[key]}</b></div>`,
    )
    .join("");
}

function renderTaste() {
  els.tasteSliders.innerHTML = Object.entries(tasteLabels)
    .map(
      ([key, label]) => `
        <label class="slider-row">
          <span>${label}</span>
          <input type="range" min="0" max="100" value="${state.taste[key]}" data-taste-key="${key}" />
          <output>${state.taste[key]}</output>
        </label>`,
    )
    .join("");
  els.tasteNotes.value = state.taste.notes;
}

function renderReferences() {
  if (!state.references.length) {
    els.referencesList.innerHTML =
      '<div class="empty-state">No private references yet. Analyze a track you own, then save its metrics here.</div>';
    return;
  }
  els.referencesList.innerHTML = state.references
    .map(
      (item) => `
        <div class="reference-item">
          <div>
            <b>${escapeHTML(item.name)}</b>
            <small>${escapeHTML(item.profile)} · RMS ${formatNumber(item.metrics.rms)} dBFS · spread ${formatNumber(item.metrics.dynamicSpread)} dB · width ${Math.round(item.metrics.width)}%</small>
          </div>
          <button class="icon-button" type="button" aria-label="Delete ${escapeHTML(item.name)}" data-delete-reference="${item.id}">×</button>
        </div>`,
    )
    .join("");
}

function renderHistory() {
  if (!state.history.length) {
    els.messageHistory.innerHTML =
      '<div class="empty-state">No saved notes yet. Your reviewed drafts will appear here.</div>';
    return;
  }
  els.messageHistory.innerHTML = state.history
    .map(
      (item) => `
        <div class="history-item">
          <div>
            <b>${escapeHTML(item.lead || "Unnamed lead")} / ${escapeHTML(item.track)}</b>
            <small>${escapeHTML(item.createdAt)} · ${escapeHTML(item.format)}</small>
            <p>${escapeHTML(item.message.slice(0, 210))}${item.message.length > 210 ? "…" : ""}</p>
          </div>
          <button class="icon-button" type="button" aria-label="Delete note" data-delete-history="${item.id}">×</button>
        </div>`,
    )
    .join("");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function compare(value, range) {
  if (value < range[0]) return "low";
  if (value > range[1]) return "high";
  return "inside";
}

function getIndustryObservations(metrics = state.metrics) {
  const ranges = getProfile().ranges;
  const observations = [];
  const lowState = compare(metrics.tone.low, ranges.low);
  const presenceState = compare(metrics.tone.presence, ranges.presence);
  const dynamicState = compare(metrics.dynamicSpread, ranges.dynamicSpread);
  const densityState = compare(metrics.rms, ranges.rms);
  const widthState = compare(metrics.width, ranges.width);

  if (lowState === "high") {
    observations.push(
      "The low end carries more weight than this reference range. Check whether kick and bass still read as two intentional roles on smaller systems.",
    );
  } else if (lowState === "low") {
    observations.push(
      "The foundation is lighter than this reference range. There may be room for more physical support without making the production denser.",
    );
  } else {
    observations.push(
      "The low-end weight sits comfortably inside the selected reference range. The next question is hierarchy, not simply more bass.",
    );
  }

  if (dynamicState === "low") {
    observations.push(
      "Section energy is relatively even. The hook may benefit from a clearer change of scale, texture or vocal hierarchy.",
    );
  } else if (dynamicState === "high") {
    observations.push(
      "The arrangement has a wide dynamic arc. Check that the quieter moments still hold attention after loudness normalization.",
    );
  } else {
    observations.push(
      "The arrangement shows usable movement between sections. The contrast feels controlled rather than accidental.",
    );
  }

  if (presenceState === "low") {
    observations.push(
      "Presence is restrained against this profile. If the song is lyric-led, the vocal and core hook may need a more explicit foreground.",
    );
  } else if (presenceState === "high") {
    observations.push(
      "The presence region is assertive. Check whether that focus creates intimacy or starts to flatten depth over a full listen.",
    );
  } else if (densityState === "high") {
    observations.push(
      "Average density is on the forward side. Translation may improve by protecting a little more transient shape before chasing loudness.",
    );
  } else if (widthState === "low") {
    observations.push(
      "The stereo picture is compact. A deliberate widening moment could help the hook arrive without changing its level.",
    );
  } else {
    observations.push(
      "The tonal focus and stereo picture are broadly aligned with the selected intention. The strongest gains are likely creative, not corrective.",
    );
  }

  return observations.slice(0, 3);
}

function getTasteObservations(metrics = state.metrics) {
  const taste = state.taste;
  const profile = getProfile();
  const observations = [];
  const energyArc = Math.max(...metrics.sections) - Math.min(...metrics.sections);
  const privateReferenceObservation = getPrivateReferenceObservation(metrics);

  if (privateReferenceObservation) {
    observations.push(privateReferenceObservation);
  }

  if (taste.emotionalContrast >= 65 && energyArc < 9) {
    observations.push(
      "I would explore a more obvious emotional change when the main hook arrives. Not necessarily louder: wider, emptier or more exposed could be enough.",
    );
  } else {
    observations.push(
      "The section movement is already doing useful work. I would keep the arc and make one transition feel more inevitable.",
    );
  }

  if (taste.vocalIntention >= 65 && metrics.tone.presence < profile.ranges.presence[0] + 3) {
    observations.push(
      "My instinct is to make the vocal hierarchy more intentional. The lead can feel closer without turning the whole mix brighter.",
    );
  } else if (taste.vocalIntention >= 65) {
    observations.push(
      "The vocal has enough presence. I would focus on what it means emotionally in each section: lead, doubles and space should change roles on purpose.",
    );
  }

  if (taste.lowEndRestraint >= 65 && metrics.tone.low > profile.ranges.low[1]) {
    observations.push(
      "I would simplify the low-end relationship before adding anything. One confident foundation usually says more than several competing layers.",
    );
  } else if (taste.textureRisk >= 60) {
    observations.push(
      "I would look for one signature production decision: a texture, interruption or instrumental gesture that only belongs to this song.",
    );
  }

  if (taste.humanDynamics >= 70 && metrics.dynamicSpread < profile.ranges.dynamicSpread[0]) {
    observations.push(
      "There is room to let the performance breathe more. I would protect a little imperfection if it makes the lift feel human.",
    );
  }

  return observations.slice(0, 3);
}

function getPrivateReferenceObservation(metrics) {
  if (!state.references.length) return "";

  const totals = state.references.reduce(
    (result, reference) => {
      Object.entries(reference.metrics).forEach(([key, value]) => {
        result[key] = (result[key] || 0) + value;
      });
      return result;
    },
    {},
  );
  const average = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, value / state.references.length]),
  );
  const comparisons = [
    {
      key: "low",
      value: metrics.tone.low,
      threshold: 5,
      high: "carries more low-end weight",
      low: "has a lighter foundation",
    },
    {
      key: "presence",
      value: metrics.tone.presence,
      threshold: 5,
      high: "puts more energy into the presence range",
      low: "keeps the presence range more restrained",
    },
    {
      key: "dynamicSpread",
      value: metrics.dynamicSpread,
      threshold: 2.5,
      high: "moves through a wider dynamic arc",
      low: "holds a more even dynamic arc",
    },
    {
      key: "width",
      value: metrics.width,
      threshold: 9,
      high: "uses a wider stereo picture",
      low: "stays more compact in stereo",
    },
  ]
    .map((comparison) => ({
      ...comparison,
      delta: comparison.value - average[comparison.key],
    }))
    .sort((a, b) => Math.abs(b.delta / b.threshold) - Math.abs(a.delta / a.threshold));

  const strongest = comparisons[0];
  if (Math.abs(strongest.delta) < strongest.threshold) {
    return `Against your ${state.references.length} private reference${state.references.length === 1 ? "" : "s"}, the overall balance sits close to your existing listening memory.`;
  }
  const direction = strongest.delta > 0 ? strongest.high : strongest.low;
  return `Against your ${state.references.length} private reference${state.references.length === 1 ? "" : "s"}, this track ${direction}. That difference may be intentional; it is worth listening to on purpose.`;
}

function renderMetrics() {
  const metrics = state.metrics;
  const profile = getProfile();
  const referencePending = state.streamingContext && state.sessionType !== "local" && state.sessionType !== "preview";
  const quickReadReady = state.quickRead?.status === "finished";
  const sessionLabel = referencePending
    ? state.sessionType === "preview"
      ? "SPOTIFY PREVIEW · 30 SEC"
      : "LINK CONTEXT ONLY"
    : state.sessionType === "example"
      ? "EXAMPLE SESSION"
      : state.sessionType === "preview"
        ? "SPOTIFY PREVIEW · 30 SEC"
        : "LOCAL AUDIO ANALYSIS";
  els.resultTitle.textContent = state.streamingContext ? state.streamingContext.title : state.trackTitle;
  els.resultMeta.textContent = state.sessionType === "preview"
    ? `30-second preview · ${profile.name} intention · upload full file for complete read`
    : referencePending
      ? `Link context · ${profile.name} intention · upload audio for real measurements`
      : `${formatDuration(metrics.duration)} · ${profile.name} intention · exploratory read`;
  els.sessionChip.textContent = sessionLabel;
  els.draftSource.textContent = sessionLabel;
  els.metricRms.textContent = formatNumber(metrics.rms);
  els.metricDynamics.textContent = formatNumber(metrics.dynamicSpread);
  els.metricWidth.textContent = Math.round(metrics.width);
  els.metricTempo.textContent = Math.round(metrics.tempo) || "—";
  els.contrastValue.textContent = `+${formatNumber(metrics.dynamicSpread)} dB`;

  const sectionMax = Math.max(...metrics.sections);
  const sectionMin = Math.min(...metrics.sections);
  const span = Math.max(1, sectionMax - sectionMin);
  els.energyChart.innerHTML = metrics.sections
    .map((value, index) => {
      const height = 24 + ((value - sectionMin) / span) * 74;
      return `<div class="energy-bar" style="height:${height}%" title="Section ${index + 1}: ${formatNumber(value)} dBFS"></div>`;
    })
    .join("");

  const toneLabels = {
    low: "LOW / SUB",
    lowMid: "LOW MID",
    mid: "MID",
    presence: "PRESENCE",
    air: "AIR",
  };
  els.toneChart.innerHTML = Object.entries(metrics.tone)
    .map(
      ([key, value]) => `
        <div class="tone-row">
          <span>${toneLabels[key]}</span>
          <div class="tone-track"><div class="tone-fill" style="width:${Math.min(100, value * 2.2)}%"></div></div>
          <b>${Math.round(value)}%</b>
        </div>`,
    )
    .join("");

  renderProfile();
  renderObservationList(els.industryObservations, getIndustryObservations(metrics));
  renderObservationList(els.tasteObservations, getTasteObservations(metrics));
  renderStreamingContext();
  renderQuickRead();
  generateMessage();
}

function renderStreamingContext() {
  const context = state.streamingContext;
  const referencePending = context && state.sessionType !== "local" && state.sessionType !== "preview";
  const hasEnrichment = state.spotifyFeatures && !state.spotifyFeatures.error;
  els.streamingContext.hidden = !context;
  // Only show the notice when we truly have nothing — hide it when enrichment data came through
  els.analysisNotice.hidden = !referencePending || hasEnrichment;
  els.analysisResults.classList.toggle("is-reference-pending", Boolean(referencePending));
  els.jumpMessage.disabled = false;
  els.jumpMessage.textContent = "Draft lead note →";
  els.saveReference.disabled = Boolean(referencePending);

  if (referencePending && !hasEnrichment) {
    const notice = getReferenceNotice();
    els.analysisNoticeTitle.textContent = notice.title;
    els.analysisNoticeCopy.textContent = notice.copy;
  }

  if (!context) {
    els.streamingEmbed.hidden = true;
    els.streamingEmbed.removeAttribute("src");
    els.streamingEmbed.classList.remove("is-video");
    els.streamingAlternatives.innerHTML = "";
    return;
  }

  els.streamingProvider.textContent = context.provider.toUpperCase();
  els.streamingTitle.textContent = context.title;
  els.streamingLink.href = context.sourceUrl;
  els.streamingLink.textContent = `Open in ${context.provider} ↗`;
  els.streamingThumbnail.hidden = !context.thumbnailUrl;
  if (context.thumbnailUrl) {
    els.streamingThumbnail.src = context.thumbnailUrl;
    els.streamingThumbnail.alt = `${context.title} artwork`;
  } else {
    els.streamingThumbnail.removeAttribute("src");
    els.streamingThumbnail.alt = "";
  }

  els.streamingEmbed.hidden = !context.embedUrl;
  els.streamingEmbed.classList.toggle("is-video", context.embedType === "video");
  if (context.embedUrl) {
    els.streamingEmbed.src = context.embedUrl;
  } else {
    els.streamingEmbed.removeAttribute("src");
  }

  els.streamingAlternatives.innerHTML = (context.alternatives || [])
    .map(
      (item) =>
        `<a class="platform-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.label)}</a>`,
    )
    .join("");
}

function getReferenceNotice() {
  const status = state.quickRead?.status;
  if (status === "activation" || status === "error" || status === "authorization" || status === "quota") {
    return {
      title: "LINK CONTEXT ONLY · CYANITE OPTIONAL / UNAVAILABLE",
      copy:
        "The link identifies the song. Upload a WAV or MP3 above for real audio measurements.",
    };
  }
  if (status === "finished") {
    if (state.quickRead?.source?.matchedBy === "youtube_search") {
      return {
        title: "LINK CONTEXT ONLY · VERIFY SOURCE",
        copy:
          "Catalog metadata came from a YouTube search match — verify it's the right version. Upload audio above for real measurements.",
      };
    }
    return {
      title: "LINK CONTEXT ONLY · AUDIO NEEDED FOR REAL ANALYSIS",
      copy:
        "The link gives context. Upload the audio file above for mix-specific measurements and a calibrated lead note.",
    };
  }
  return {
    title: "LINK CONTEXT ONLY",
    copy:
      "The link tells me what song this is. Upload a WAV or MP3 above for real measurements.",
  };
}

function renderQuickRead() {
  const quickRead = state.quickRead;
  const sf = state.spotifyFeatures;
  const hasSpotify = sf && !sf.error;
  els.quickReadResults.hidden = !state.streamingContext;
  els.quickCaption.hidden = true;
  els.quickCaption.textContent = "";

  // Enrichment data takes display priority over Cyanite when available
  if (hasSpotify) {
    const hasMeaningfulData = (sf.tags && sf.tags.length > 0) || sf.bpm || sf.bio;
    const sources = hasMeaningfulData
      ? ((sf.sources || []).join(" · ").toUpperCase() || "ENRICHED")
      : "LINK CONTEXT ONLY";
    const previewChip = state.sessionType === "preview" ? ` · ${(state.previewSource || "PREVIEW").toUpperCase()} 30 SEC` : "";
    els.quickReadChip.textContent = `${sources}${previewChip}`;
    els.quickReadMetrics.hidden = !sf.bpm && !sf.loudness;
    if (sf.bpm) els.quickBpm.textContent = Math.round(sf.bpm);
    if (sf.loudness != null) els.quickKey.textContent = `${sf.loudness > 0 ? "+" : ""}${sf.loudness} dB`;
    const reachCount = sf.youtubeViews || sf.listeners;
    els.quickEnergy.textContent = reachCount ? `${(reachCount / 1000).toFixed(0)}k` : "—";
    els.quickVoice.textContent = sf.genre ? sf.genre.split(" ")[0].toLowerCase() : "—";
    const statusMsg = state.sessionType === "preview"
      ? "Preview analyzed. Upload full file for complete measurements."
      : "Song context loaded. Upload audio above for real analysis.";
    els.quickReadStatus.textContent = statusMsg;
    els.quickReadContextStatus.textContent = statusMsg;
    // Bio snippet
    els.quickCaption.hidden = !sf.bio;
    els.quickCaption.textContent = sf.bio ? sf.bio.split(". ").slice(0, 2).join(". ") + "." : "";
    // Tags
    const allTags = sf.tags || [];
    els.quickTags.innerHTML = allTags
      .map((t) => `<span class="quick-tag">${escapeHTML(t)}</span>`)
      .join("");
    return;
  }

  // Cyanite fallback display
  const statusLabels = {
    starting: "LINK CONTEXT ONLY",
    queued: "LINK CONTEXT ONLY",
    resolving: "LINK CONTEXT ONLY",
    enqueuing: "LINK CONTEXT ONLY",
    processing: "LINK CONTEXT ONLY",
    finished: "LINK CONTEXT ONLY",
    activation: "CYANITE OPTIONAL / UNAVAILABLE",
    authorization: "CYANITE OPTIONAL / UNAVAILABLE",
    quota: "CYANITE OPTIONAL / UNAVAILABLE",
    error: "CYANITE OPTIONAL / UNAVAILABLE",
  };
  els.quickReadChip.textContent = statusLabels[quickRead?.status] || "LINK CONTEXT ONLY";
  els.quickReadMetrics.hidden = quickRead?.status !== "finished";

  if (!quickRead) {
    els.quickReadStatus.textContent = "Attach a song link for context. Upload audio above for real analysis.";
    els.quickReadContextStatus.textContent = "";
    els.quickTags.innerHTML = "";
    return;
  }

  const message =
    ["quota", "authorization", "activation", "error"].includes(quickRead.status)
      ? "Cyanite optional / unavailable. Upload audio above for real analysis."
      : quickRead.status === "finished"
        ? "Link context ready. Upload audio above for real measurements."
        : "Resolving link context…";
  els.quickReadStatus.textContent = message;
  els.quickReadContextStatus.textContent = message;

  if (quickRead.status !== "finished") {
    els.quickTags.innerHTML = "";
    return;
  }

  const result = quickRead.result;
  els.quickBpm.textContent = result.bpm ? Math.round(result.bpm) : "—";
  els.quickKey.textContent = humanize(result.key || "—");
  els.quickEnergy.textContent = humanize(result.energyLevel || "—");
  els.quickVoice.textContent = humanize(result.voicePresence || "—");
  els.quickTags.innerHTML = [
    ...(result.genres || []),
    ...(result.subgenres || []),
    ...(result.moods || []),
    ...(result.instruments || []),
    ...(result.character || []),
  ]
    .slice(0, 16)
    .map((tag) => `<span class="quick-tag">${escapeHTML(humanize(tag))}</span>`)
    .join("");
}

function renderObservationList(target, observations) {
  target.innerHTML = observations.map((text) => `<li>${escapeHTML(text)}</li>`).join("");
}

function pickQuickReadInsight() {
  const result = state.quickRead?.result || {};
  const moods = (result.moods || []).slice(0, 3).map(humanize);
  const movement = (result.movement || []).slice(0, 2).map(humanize);
  const character = (result.character || []).slice(0, 2).map(humanize);
  if (moods.length && movement.length) {
    return `the song reads as ${moods.join(", ")} with a ${movement.join(" / ")} pulse. I think the interesting opportunity is making that emotional direction even more unmistakable`;
  }
  if (character.length) {
    return `the production already has a ${character.join(" / ")} character. I think the next step is making one arrangement decision carry that identity more clearly`;
  }
  if (result.caption) {
    return `the song already has a clear direction. I would focus the next production pass on the one gesture that makes that identity feel specific rather than generic`;
  }
  return "the track already suggests a clear emotional world. I would focus the next pass on making the hook reveal that identity more decisively";
}

function humanize(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .toLowerCase();
}

function pickSpotifyInsight() {
  const sf = state.spotifyFeatures;
  if (!sf || sf.error) return null;
  const tags = (sf.tags || []).map((t) => t.toLowerCase());
  const bpm = sf.bpm ? Math.round(sf.bpm) : 0;
  const genre = sf.genre || "";

  const has = (...words) => words.some((w) => tags.some((t) => t.includes(w)));

  if (has("melanchol", "sad", "dark", "noir", "haunting")) {
    return `the ${genre ? genre.toLowerCase() + " " : ""}track has a melancholic pull${bpm ? ` at ${bpm} BPM` : ""} — the most interesting question is whether the production gives that emotional weight a clear place to land`;
  }
  if (has("acoustic", "folk", "singer-songwriter", "intimate")) {
    return `the intimate, acoustic character${bpm ? ` at ${bpm} BPM` : ""} puts the performance at the center — the question is whether the arrangement has enough space around the voice to let that intimacy breathe`;
  }
  if (has("dance", "edm", "electronic", "house", "techno", "club")) {
    return `the ${genre ? genre.toLowerCase() + " " : ""}energy is built for movement${bpm ? ` at ${bpm} BPM` : ""} — the question is whether the drop gives the listener a clear emotional reason, not just a rhythmic one`;
  }
  if (has("hip-hop", "rap", "trap", "r&b", "urban")) {
    return `the ${genre ? genre.toLowerCase() + " " : ""}production${bpm ? ` at ${bpm} BPM` : ""} creates a strong foundation — the question is whether the beat hierarchy gives the vocal enough space to own the track`;
  }
  if (has("pop", "synth", "electropop")) {
    return `the ${genre ? genre.toLowerCase() + " " : ""}feel${bpm ? ` at ${bpm} BPM` : ""} has momentum — the challenge is usually finding the one production detail that makes the hook feel specific rather than polished`;
  }
  if (has("rock", "indie", "alternative", "guitar")) {
    return `the ${genre ? genre.toLowerCase() + " " : ""}energy${bpm ? ` at ${bpm} BPM` : ""} is already working — the question is whether the mix gives the most emotionally important element a clear front-of-mix identity`;
  }
  if (bpm) {
    return `at ${bpm} BPM${genre ? ` in the ${genre.toLowerCase()} world` : ""}, the track has a clear identity — the biggest opportunity is making one production decision that makes the hook feel unmistakably this song`;
  }
  return null;
}

function pickLeadInsight() {
  const metrics = state.metrics;
  const profile = getProfile();
  if (metrics.dynamicSpread < profile.ranges.dynamicSpread[0] + 1) {
    return "the hook arrives, but the production could reveal a clearer change of scale around it";
  }
  if (metrics.tone.presence < profile.ranges.presence[0] + 2) {
    return "there is room to make the vocal hierarchy more intentional without simply making the mix brighter";
  }
  if (metrics.tone.low > profile.ranges.low[1]) {
    return "the low end has weight, and I think a more deliberate kick / bass relationship would make the whole track translate with more confidence";
  }
  if (metrics.width < profile.ranges.width[0] + 5) {
    return "a deliberate widening moment could help the chorus land without forcing more level into the mix";
  }
  return "the song already has a clear identity, and the biggest opportunity feels creative: making one production decision around the hook feel unmistakably yours";
}

function serviceLine(service) {
  const lines = {
    production:
      "That kind of production perspective is a big part of what I do with artists.",
    mix: "That balance between intention and translation is a big part of how I approach mixing.",
    vocal:
      "Building that vocal hierarchy is a big part of the vocal production work I do with artists.",
    instruments:
      "That kind of arrangement and instrumental detail is a big part of the work I do with artists.",
    atmos:
      "That sense of depth and scale is also where an immersive mix can become musically useful, not decorative.",
    conversation:
      "That is the kind of thing I like unpacking with artists in a focused listening call.",
  };
  return lines[service] || lines.production;
}

async function draftWithAI() {
  const sf = state.spotifyFeatures;
  const button = document.querySelector("#regenerate-message");
  button.disabled = true;
  button.textContent = "Drafting…";
  try {
    const response = await fetch("/song-lens/api/draft-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: state.streamingContext?.title || state.trackTitle || "",
        artist: state.streamingContext?.artistName || "",
        tags: sf?.tags || [],
        bpm: sf?.bpm || null,
        loudness: sf?.loudness || null,
        bio: sf?.bio || "",
        leadName: els.leadName.value.trim(),
        format: els.messageFormat.value,
        service: els.serviceFocus.value,
        observations: els.personalLine.value.trim(),
        sessionType: state.sessionType,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.code === "anthropic_not_configured") {
        showToast("AI drafting not configured — using template.");
        generateMessage();
        return;
      }
      throw new Error(data.error || "Draft failed.");
    }
    els.messageDraft.value = data.draft;
    showToast("AI draft ready. Review before sending.");
  } catch (error) {
    console.error(error);
    showToast("AI draft failed — using template instead.");
    generateMessage();
  } finally {
    button.disabled = false;
    button.textContent = "Draft with AI →";
  }
}

function generateMessage() {
  const name = els.leadName.value.trim();
  const greeting = name ? `Hey ${name},` : "Hey,";
  const context = els.personalLine.value.trim();
  const referencePending = state.streamingContext && state.sessionType !== "local" && state.sessionType !== "preview";
  const quickReadReady = state.quickRead?.status === "finished";
  const trackTitle = referencePending ? state.streamingContext.title : state.trackTitle;
  const insight = quickReadReady ? pickQuickReadInsight() : pickLeadInsight();
  const service = serviceLine(els.serviceFocus.value);
  const format = els.messageFormat.value;
  let draft;

  if (referencePending) {
    const spotifyInsight = pickSpotifyInsight();
    const insight = spotifyInsight || "[Add one specific observation from your listen.]";
    draft = `${greeting}

${context ? `${context}\n\n` : ""}I spent some time with ${trackTitle}. My first note: ${capitalize(insight)}.

${service}

Happy to share what I mean if useful.${spotifyInsight ? "" : "\n\n[Context-only read — upload audio file for mix-specific feedback.]"}`;
    els.messageDraft.value = draft;
    return;
  }

  if (format === "email") {
    draft = `${greeting}

${context ? `${context}\n\n` : ""}I spent some time with ${trackTitle}. What caught me is that ${insight}.

${service} I can hear a few focused moves that would give the song more impact without changing what makes it yours.

Happy to share what I mean if useful.

Diego`;
  } else if (format === "voice") {
    draft = `VOICE NOTE OUTLINE

— ${name ? `Say hi to ${name}.` : "Open naturally."}
— ${context || `Mention what genuinely caught you in ${trackTitle}.`}
— Main observation: ${insight}.
— Connect it lightly: ${service}
— Close: offer to share two or three focused ideas. No hard pitch.`;
  } else {
    draft = `${greeting}

${context ? `${context}\n\n` : ""}I spent some time with ${trackTitle}. ${capitalize(insight)}.

${service} I can hear a few focused moves that could push it further without changing what makes it yours.

Happy to share what I mean if useful.`;
  }

  els.messageDraft.value = draft;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

async function fetchSongEnrichment({ title, artist, deezerId, spotifyId, youtubeId } = {}) {
  if (!title && !artist && !deezerId && !spotifyId && !youtubeId) return;
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (artist) params.set("artist", artist);
  if (deezerId) params.set("deezer_id", deezerId);
  if (spotifyId) params.set("spotify_id", spotifyId);
  if (youtubeId) params.set("youtube_id", youtubeId);
  try {
    const response = await fetch(`/song-lens/api/enrich?${params}`);
    const data = await response.json();
    if (!response.ok) {
      state.spotifyFeatures = { error: "unavailable" };
      renderQuickRead();
      return;
    }
    state.spotifyFeatures = data;
    renderQuickRead();
    if (data.previewUrl && state.sessionType !== "local") {
      analyzePreview(data.previewUrl, data.previewSource || "preview");
    } else if (!data.previewUrl) {
      showToast("Song context loaded. Upload audio above for real analysis.");
    }
  } catch (error) {
    console.warn("Song enrichment failed.", error);
    state.spotifyFeatures = { error: "unavailable" };
    renderQuickRead();
  }
}

async function analyzePreview(previewUrl, source = "preview") {
  const sourceLabel = source === "deezer" ? "Deezer" : source === "spotify" ? "Spotify" : "Preview";
  setStatus(`Fetching ${sourceLabel} 30-second preview…`);
  try {
    const response = await fetch(previewUrl);
    if (!response.ok) throw new Error(`Preview fetch failed: ${response.status}`);
    const buffer = await response.arrayBuffer();
    setStatus("Analyzing preview locally…");
    await nextPaint();
    const audioCtx = new AudioContext();
    try {
      const audioBuffer = await audioCtx.decodeAudioData(buffer.slice(0));
      const metrics = analyzeAudioBuffer(audioBuffer);
      state.metrics = metrics;
      state.sessionType = "preview";
      state.previewSource = source;
      renderMetrics();
      setStatus(`${sourceLabel} preview analyzed — 30-second sample. Upload full file for complete read.`);
      showToast(`${sourceLabel} preview analyzed. Upload the full file for a complete read.`);
    } finally {
      await audioCtx.close();
    }
  } catch (error) {
    console.warn("Preview analysis failed.", error);
    setStatus("Preview unavailable. Upload audio above for real measurements.");
  }
}

async function analyzeFile(file) {
  if (!file) return;
  const title = els.songTitle.value.trim() || file.name.replace(/\.[^.]+$/, "");
  setBusy(true);
  setStatus(`Reading ${file.name}…`);
  try {
    const arrayBuffer = await file.arrayBuffer();
    await analyzeArrayBuffer(arrayBuffer, title);
  } catch (error) {
    console.error(error);
    setStatus("Could not decode that audio file.");
    showToast("That audio file could not be decoded. Try MP3, WAV, M4A or OGG.");
  } finally {
    setBusy(false);
  }
}

async function analyzeURL() {
  const url = els.audioUrl.value.trim();
  if (!url) {
    showToast("Add a song or direct audio URL first.");
    return;
  }
  if (looksLikeStreamingPage(url)) {
    await attachStreamingContext(url);
    return;
  }
  setBusy(true);
  setStatus("Fetching direct audio URL…");
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (/text\/html|application\/xhtml/i.test(contentType)) {
      await attachStreamingContext(url);
      return;
    }
    const buffer = await response.arrayBuffer();
    const inferredName = new URL(url).pathname.split("/").pop() || "URL analysis";
    await analyzeArrayBuffer(buffer, els.songTitle.value.trim() || inferredName);
  } catch (error) {
    console.error(error);
    setStatus("Could not read that URL. It may block cross-origin access.");
    showToast("Could not fetch that audio URL. Try a file upload instead.");
  } finally {
    setBusy(false);
  }
}

async function attachStreamingContext(url) {
  setBusy(true);
  setStatus("Attaching listening reference…");
  state.quickRead = null;
  state.spotifyFeatures = null;
  const provider = getStreamingProvider(url);
  const context = {
    provider,
    sourceUrl: url,
    title: els.songTitle.value.trim() || `${provider} track`,
    thumbnailUrl: "",
    embedUrl: "",
    embedType: "",
    alternatives: [],
  };

  try {
    const resolved = await resolveSongLink(url);
    Object.assign(context, resolved);
    context.title ||= els.songTitle.value.trim() || `${provider} track`;
  } catch (error) {
    console.warn("Cross-platform reference could not be resolved.", error);
  }

  const spotifyUrl = context.spotifyUrl || (provider === "Spotify" ? normalizeSpotifyURL(url) : "");
  const deezerTrackId = getDeezerTrackId(context.deezerUrl || "");
  const spotifyId = getSpotifyTrackId(normalizeSpotifyURL(spotifyUrl));
  const youtubeVideoId = getYouTubeVideoId(url) || getYouTubeVideoId(context.youtubeUrl || "");

  fetchSongEnrichment({
    title: context.trackTitle || context.title,
    artist: context.artistName || "",
    deezerId: deezerTrackId,
    spotifyId,
    youtubeId: youtubeVideoId,
  });

  if (spotifyUrl) {
    const normalizedUrl = normalizeSpotifyURL(spotifyUrl);
    const localSpotifyId = getSpotifyTrackId(normalizedUrl);
    context.embedUrl = localSpotifyId ? `https://open.spotify.com/embed/track/${localSpotifyId}` : "";
    context.embedType = localSpotifyId ? "audio" : "";

    try {
      const response = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(normalizedUrl)}`,
      );
      if (response.ok) {
        const metadata = await response.json();
        context.title = metadata.title || context.title;
        context.thumbnailUrl = metadata.thumbnail_url || context.thumbnailUrl || "";
        context.embedUrl = metadata.iframe_url || context.embedUrl;
        context.embedType = context.embedUrl ? "audio" : context.embedType;
      }
    } catch (error) {
      console.warn("Spotify metadata could not be loaded.", error);
    }
  }

  if (!context.embedUrl && context.youtubeUrl) {
    const youtubeId = getYouTubeVideoId(context.youtubeUrl);
    context.embedUrl = youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : "";
    context.embedType = youtubeId ? "video" : "";
  }

  state.streamingContext = context;
  if (!els.songTitle.value.trim() && context.title !== `${provider} track`) {
    els.songTitle.value = context.title;
  }
  renderMetrics();
  setBusy(false);
  setStatus(`${provider} reference attached. Upload audio above for real analysis.`);
  showToast(`${provider} reference attached. Upload a WAV or MP3 for real measurements.`);
  runQuickRead();
}

async function runQuickRead() {
  if (!state.streamingContext) {
    showToast("Attach a public song link first.");
    return;
  }
  state.quickRead = {
    status: "starting",
    message: "Starting the link-only catalog analysis.",
  };
  renderQuickRead();
  try {
    const response = await fetch("/song-lens/api/quick-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: state.streamingContext.sourceUrl }),
    });
    const payload = await response.json();
    if (!response.ok) {
      if (payload.code === "cyanite_not_configured") {
        state.quickRead = {
          status: "activation",
          message:
            "Quick Read is installed. Add the private Cyanite token on the VPS to activate link-only analysis.",
        };
      } else {
        state.quickRead = {
          status: "error",
          message: payload.error || "Quick Read could not start. Attach WAV or MP3 for Deep Read.",
        };
      }
      renderMetrics();
      return;
    }
    state.quickRead = {
      status: payload.status || "queued",
      jobId: payload.jobId,
      message: "Quick Read queued. Resolving the best catalog source.",
    };
    renderQuickRead();
    pollQuickRead(payload.jobId);
  } catch (error) {
    console.error(error);
    state.quickRead = {
      status: "error",
      message: "Quick Read service is unavailable. Attach WAV or MP3 for Deep Read.",
    };
    renderMetrics();
  }
}

async function pollQuickRead(jobId) {
  try {
    const response = await fetch(`/song-lens/api/quick-read/${encodeURIComponent(jobId)}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Quick Read status request failed.");
    if (state.quickRead?.jobId !== jobId) return;
    state.quickRead = {
      status: payload.status,
      jobId,
      message: payload.message || "Quick Read is running.",
      result: payload.quickRead || null,
      source: payload.source || null,
      resolved: payload.resolved || null,
    };
    renderMetrics();
    if (payload.status === "finished") {
      showToast("Link context loaded. Upload audio for real analysis.");
      return;
    }
    if (payload.status === "authorization") {
      state.quickRead.message =
        payload.error ||
        "Cyanite is connected, but this streaming source needs audio-analysis permission. YouTube/YouTube Music links can still work.";
      renderMetrics();
      return;
    }
    if (payload.status === "quota") {
      state.quickRead.message =
        payload.error ||
        "Cyanite plan limit reached. Upload WAV/MP3 for local Deep Read.";
      renderMetrics();
      return;
    }
    if (payload.status === "error") {
      state.quickRead.message = payload.error || "Quick Read could not finish. Attach WAV or MP3.";
      renderMetrics();
      return;
    }
    setTimeout(() => pollQuickRead(jobId), 2800);
  } catch (error) {
    console.error(error);
    if (state.quickRead?.jobId !== jobId) return;
    state.quickRead = {
      status: "error",
      message: "Quick Read polling stopped. Try again or attach WAV or MP3.",
    };
    renderMetrics();
  }
}

async function resolveSongLink(url) {
  const response = await fetch(`/song-lens/api/resolve?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error(`Song resolver failed with ${response.status}`);
  const data = await response.json();
  const links = data.linksByPlatform || {};
  const entities = data.entitiesByUniqueId || {};
  const entity =
    entities[data.entityUniqueId] ||
    Object.values(entities).find((item) => item?.title) ||
    {};
  const platformOrder = [
    "spotify",
    "appleMusic",
    "youtubeMusic",
    "youtube",
    "deezer",
    "tidal",
    "amazonMusic",
    "soundcloud",
    "bandcamp",
    "audius",
  ];
  const labels = {
    spotify: "Spotify",
    appleMusic: "Apple Music",
    youtubeMusic: "YouTube Music",
    youtube: "YouTube",
    deezer: "Deezer",
    tidal: "Tidal",
    amazonMusic: "Amazon Music",
    soundcloud: "SoundCloud",
    bandcamp: "Bandcamp",
    audius: "Audius",
  };
  const alternatives = platformOrder
    .filter((platform) => links[platform]?.url)
    .map((platform) => ({ label: labels[platform], url: links[platform].url }));
  const trackTitle = entity.title || "";
  const artistName = entity.artistName || "";
  const titleAlreadyHasArtist = artistName && trackTitle.toLowerCase().includes(artistName.toLowerCase());
  const displayTitle = titleAlreadyHasArtist
    ? trackTitle
    : [trackTitle, artistName].filter(Boolean).join(" — ");
  return {
    title: displayTitle || "",
    artistName,
    trackTitle,
    thumbnailUrl: entity.thumbnailUrl || "",
    spotifyUrl: links.spotify?.url || "",
    deezerUrl: links.deezer?.url || "",
    youtubeUrl: links.youtubeMusic?.url || links.youtube?.url || "",
    alternatives,
  };
}

function looksLikeStreamingPage(url) {
  return /spotify\.com|youtu\.?be|music\.youtube\.com|music\.apple\.com|soundcloud\.com|bandcamp\.com|deezer\.com|tidal\.com|music\.amazon\.|audius\.co|napster\.com|pandora\.com|anghami\.com|boomplay\.com|music\.yandex\.|qobuz\.com/i.test(
    url,
  );
}

function getStreamingProvider(url) {
  if (/spotify\.com/i.test(url)) return "Spotify";
  if (/music\.youtube\.com/i.test(url)) return "YouTube Music";
  if (/youtu\.?be/i.test(url)) return "YouTube";
  if (/music\.apple\.com/i.test(url)) return "Apple Music";
  if (/soundcloud\.com/i.test(url)) return "SoundCloud";
  if (/bandcamp\.com/i.test(url)) return "Bandcamp";
  if (/deezer\.com/i.test(url)) return "Deezer";
  if (/tidal\.com/i.test(url)) return "Tidal";
  if (/music\.amazon\./i.test(url)) return "Amazon Music";
  if (/audius\.co/i.test(url)) return "Audius";
  if (/napster\.com/i.test(url)) return "Napster";
  if (/pandora\.com/i.test(url)) return "Pandora";
  if (/anghami\.com/i.test(url)) return "Anghami";
  if (/boomplay\.com/i.test(url)) return "Boomplay";
  if (/music\.yandex\./i.test(url)) return "Yandex Music";
  if (/qobuz\.com/i.test(url)) return "Qobuz";
  return "Streaming";
}

function normalizeSpotifyURL(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const typeIndex = parts.findIndex((part) =>
      ["track", "album", "playlist", "episode", "show", "artist"].includes(part),
    );
    if (typeIndex === -1 || !parts[typeIndex + 1]) return url;
    return `https://open.spotify.com/${parts[typeIndex]}/${parts[typeIndex + 1]}`;
  } catch {
    return url;
  }
}

function getSpotifyTrackId(url) {
  const match = url.match(/open\.spotify\.com\/track\/([^/?#]+)/i);
  return match ? match[1] : "";
}

function getDeezerTrackId(url) {
  const match = (url || "").match(/deezer\.com\/(?:[a-z]{2}\/)?track\/(\d+)/i);
  return match ? match[1] : "";
}

function getYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);
    if (/youtu\.be$/i.test(parsed.hostname)) return parsed.pathname.split("/").filter(Boolean)[0] || "";
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

async function analyzeArrayBuffer(arrayBuffer, title) {
  setStatus("Decoding audio locally…");
  const context = new AudioContext();
  try {
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    setStatus("Measuring energy, tone and movement…");
    await nextPaint();
    state.metrics = analyzeAudioBuffer(audioBuffer);
    state.trackTitle = title;
    state.sessionType = "local";
    els.songTitle.value = title;
    renderMetrics();
    setStatus(`Finished: ${formatDuration(state.metrics.duration)} analyzed locally.`);
    showToast("Local analysis complete.");
    document.querySelector("#analysis-results").scrollIntoView({ behavior: "smooth" });
  } finally {
    await context.close();
  }
}

function analyzeAudioBuffer(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const channelData = Array.from({ length: channels }, (_, index) =>
    audioBuffer.getChannelData(index),
  );
  const left = channelData[0];
  const right = channelData[1] || channelData[0];
  const step = Math.max(1, Math.floor(length / 1_400_000));
  let peak = 0;
  let sumSquares = 0;
  let midSquares = 0;
  let sideSquares = 0;
  let cross = 0;
  let leftSquares = 0;
  let rightSquares = 0;
  let count = 0;

  for (let index = 0; index < length; index += step) {
    const l = left[index] || 0;
    const r = right[index] || 0;
    const mono = (l + r) * 0.5;
    const mid = (l + r) * 0.5;
    const side = (l - r) * 0.5;
    peak = Math.max(peak, Math.abs(l), Math.abs(r));
    sumSquares += mono * mono;
    midSquares += mid * mid;
    sideSquares += side * side;
    cross += l * r;
    leftSquares += l * l;
    rightSquares += r * r;
    count += 1;
  }

  const rmsLinear = Math.sqrt(sumSquares / Math.max(1, count));
  const rms = amplitudeToDb(rmsLinear);
  const peakDb = amplitudeToDb(peak);
  const width = Math.min(100, Math.sqrt(sideSquares / Math.max(1e-12, midSquares)) * 100);
  const correlation = cross / Math.sqrt(Math.max(1e-12, leftSquares * rightSquares));
  const sections = analyzeSections(left, right, length);
  const tone = analyzeTone(left, right, sampleRate, length);

  return {
    duration: audioBuffer.duration,
    channels,
    sampleRate,
    rms,
    peak: peakDb,
    crest: peakDb - rms,
    dynamicSpread: Math.max(...sections) - Math.min(...sections),
    width,
    correlation,
    tempo: estimateTempo(left, right, sampleRate, length),
    tone,
    sections,
  };
}

function amplitudeToDb(value) {
  return 20 * Math.log10(Math.max(1e-9, value));
}

function analyzeSections(left, right, length) {
  const sectionCount = 12;
  const sectionLength = Math.max(1, Math.floor(length / sectionCount));
  return Array.from({ length: sectionCount }, (_, sectionIndex) => {
    const start = sectionIndex * sectionLength;
    const end = sectionIndex === sectionCount - 1 ? length : start + sectionLength;
    const step = Math.max(1, Math.floor((end - start) / 40000));
    let squares = 0;
    let count = 0;
    for (let index = start; index < end; index += step) {
      const mono = ((left[index] || 0) + (right[index] || 0)) * 0.5;
      squares += mono * mono;
      count += 1;
    }
    return amplitudeToDb(Math.sqrt(squares / Math.max(1, count)));
  });
}

function analyzeTone(left, right, sampleRate, length) {
  const fftSize = 1024;
  const frameCount = Math.min(96, Math.max(20, Math.floor(length / sampleRate)));
  const bands = { low: 0, lowMid: 0, mid: 0, presence: 0, air: 0 };
  const hann = Array.from(
    { length: fftSize },
    (_, index) => 0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (fftSize - 1)),
  );

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const center = Math.floor(((frameIndex + 0.5) / frameCount) * length);
    const start = Math.max(0, Math.min(length - fftSize, center - fftSize / 2));
    const real = new Float64Array(fftSize);
    const imaginary = new Float64Array(fftSize);
    for (let index = 0; index < fftSize; index += 1) {
      real[index] = (((left[start + index] || 0) + (right[start + index] || 0)) * 0.5) * hann[index];
    }
    fft(real, imaginary);
    for (let bin = 1; bin < fftSize / 2; bin += 1) {
      const frequency = (bin * sampleRate) / fftSize;
      if (frequency < 20 || frequency > 16000) continue;
      const energy = real[bin] * real[bin] + imaginary[bin] * imaginary[bin];
      if (frequency < 120) bands.low += energy;
      else if (frequency < 500) bands.lowMid += energy;
      else if (frequency < 2000) bands.mid += energy;
      else if (frequency < 6000) bands.presence += energy;
      else bands.air += energy;
    }
  }

  const total = Object.values(bands).reduce((sum, value) => sum + value, 0) || 1;
  return Object.fromEntries(
    Object.entries(bands).map(([key, value]) => [key, (value / total) * 100]),
  );
}

function fft(real, imaginary) {
  const size = real.length;
  for (let index = 1, reverse = 0; index < size; index += 1) {
    let bit = size >> 1;
    for (; reverse & bit; bit >>= 1) reverse ^= bit;
    reverse ^= bit;
    if (index < reverse) {
      [real[index], real[reverse]] = [real[reverse], real[index]];
      [imaginary[index], imaginary[reverse]] = [imaginary[reverse], imaginary[index]];
    }
  }
  for (let length = 2; length <= size; length <<= 1) {
    const angle = (-2 * Math.PI) / length;
    const wLengthReal = Math.cos(angle);
    const wLengthImaginary = Math.sin(angle);
    for (let start = 0; start < size; start += length) {
      let wReal = 1;
      let wImaginary = 0;
      for (let offset = 0; offset < length / 2; offset += 1) {
        const even = start + offset;
        const odd = even + length / 2;
        const oddReal = real[odd] * wReal - imaginary[odd] * wImaginary;
        const oddImaginary = real[odd] * wImaginary + imaginary[odd] * wReal;
        real[odd] = real[even] - oddReal;
        imaginary[odd] = imaginary[even] - oddImaginary;
        real[even] += oddReal;
        imaginary[even] += oddImaginary;
        const nextReal = wReal * wLengthReal - wImaginary * wLengthImaginary;
        wImaginary = wReal * wLengthImaginary + wImaginary * wLengthReal;
        wReal = nextReal;
      }
    }
  }
}

function estimateTempo(left, right, sampleRate, length) {
  const hop = 1024;
  const maxSeconds = 240;
  const usableLength = Math.min(length, sampleRate * maxSeconds);
  const envelope = [];
  for (let start = 0; start < usableLength - hop; start += hop) {
    let squares = 0;
    for (let index = start; index < start + hop; index += 8) {
      const mono = ((left[index] || 0) + (right[index] || 0)) * 0.5;
      squares += mono * mono;
    }
    envelope.push(Math.sqrt(squares / (hop / 8)));
  }
  const flux = envelope.map((value, index) => Math.max(0, value - (envelope[index - 1] || value)));
  const envelopeRate = sampleRate / hop;
  let bestTempo = 0;
  let bestScore = -Infinity;
  for (let bpm = 70; bpm <= 180; bpm += 1) {
    const lag = Math.round((60 * envelopeRate) / bpm);
    let score = 0;
    for (let index = lag; index < flux.length; index += 1) {
      score += flux[index] * flux[index - lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestTempo = bpm;
    }
  }
  return bestTempo;
}

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

function setBusy(isBusy) {
  els.analyzeUrl.disabled = isBusy;
  els.audioFile.disabled = isBusy;
}

function resetToExample() {
  state.metrics = { ...sampleMetrics, tone: { ...sampleMetrics.tone }, sections: [...sampleMetrics.sections] };
  state.trackTitle = "Example / Midnight Static";
  state.sessionType = "example";
  state.streamingContext = null;
  state.quickRead = null;
  state.spotifyFeatures = null;
  els.audioUrl.value = "";
  renderMetrics();
  setStatus("Example session loaded.");
  document.querySelector("#analysis-results").scrollIntoView({ behavior: "smooth" });
}

function saveTaste() {
  const sliders = [...els.tasteSliders.querySelectorAll("[data-taste-key]")];
  sliders.forEach((slider) => {
    state.taste[slider.dataset.tasteKey] = Number(slider.value);
  });
  state.taste.notes = els.tasteNotes.value.trim();
  saveJSON(STORAGE_KEYS.taste, state.taste);
  renderMetrics();
  showToast("Your listening lens is saved locally.");
}

function saveReference() {
  const fallback = `${state.trackTitle} / ${getProfile().name}`;
  const name = els.referenceName.value.trim() || fallback;
  state.references.unshift({
    id: crypto.randomUUID(),
    name,
    profile: getProfile().name,
    metrics: {
      rms: state.metrics.rms,
      dynamicSpread: state.metrics.dynamicSpread,
      width: state.metrics.width,
      low: state.metrics.tone.low,
      presence: state.metrics.tone.presence,
    },
  });
  saveJSON(STORAGE_KEYS.references, state.references);
  els.referenceName.value = "";
  renderReferences();
  showToast("Reference metrics saved. No audio stored.");
}

function saveMessage() {
  state.history.unshift({
    id: crypto.randomUUID(),
    lead: els.leadName.value.trim(),
    track: state.trackTitle,
    format: els.messageFormat.options[els.messageFormat.selectedIndex].text,
    createdAt: new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date()),
    message: els.messageDraft.value.trim(),
  });
  saveJSON(STORAGE_KEYS.history, state.history);
  renderHistory();
  showToast("Reviewed note saved locally.");
}

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(els.messageDraft.value);
    showToast("Lead note copied.");
  } catch {
    els.messageDraft.select();
    document.execCommand("copy");
    showToast("Lead note copied.");
  }
}

function bindEvents() {
  els.tabs.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  els.jumpMessage.addEventListener("click", () => switchView("message"));
  els.audioFile.addEventListener("change", (event) => analyzeFile(event.target.files[0]));
  els.analyzeUrl.addEventListener("click", analyzeURL);
  els.runQuickRead.addEventListener("click", runQuickRead);
  els.removeStreamingContext.addEventListener("click", () => {
    state.streamingContext = null;
    state.quickRead = null;
    state.spotifyFeatures = null;
    if (state.sessionType === "preview") {
      state.metrics = { ...sampleMetrics, tone: { ...sampleMetrics.tone }, sections: [...sampleMetrics.sections] };
      state.sessionType = "example";
      state.trackTitle = "Example / Midnight Static";
    }
    els.audioUrl.value = "";
    renderMetrics();
    setStatus("Streaming reference removed.");
  });
  els.loadExample.addEventListener("click", resetToExample);

  ["dragenter", "dragover"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    els.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("is-dragging");
    });
  });
  els.dropZone.addEventListener("drop", (event) => analyzeFile(event.dataTransfer.files[0]));

  els.industryProfile.addEventListener("change", () => {
    state.profileId = els.industryProfile.value;
    localStorage.setItem(STORAGE_KEYS.profile, state.profileId);
    renderMetrics();
  });
  els.tasteSliders.addEventListener("input", (event) => {
    if (event.target.dataset.tasteKey) {
      event.target.parentElement.querySelector("output").textContent = event.target.value;
    }
  });
  els.saveTaste.addEventListener("click", saveTaste);
  els.resetTaste.addEventListener("click", () => {
    state.taste = structuredClone(defaultTaste);
    renderTaste();
    saveTaste();
  });
  els.saveReference.addEventListener("click", saveReference);
  els.referencesList.addEventListener("click", (event) => {
    const id = event.target.dataset.deleteReference;
    if (!id) return;
    state.references = state.references.filter((item) => item.id !== id);
    saveJSON(STORAGE_KEYS.references, state.references);
    renderReferences();
  });

  [els.leadName, els.messageFormat, els.serviceFocus].forEach((element) => {
    element.addEventListener("change", generateMessage);
  });
  els.regenerateMessage.addEventListener("click", draftWithAI);
  document.querySelector("#regenerate-template")?.addEventListener("click", generateMessage);
  els.copyMessage.addEventListener("click", copyMessage);
  els.saveMessage.addEventListener("click", saveMessage);
  els.clearHistory.addEventListener("click", () => {
    state.history = [];
    saveJSON(STORAGE_KEYS.history, state.history);
    renderHistory();
    showToast("Lead history cleared.");
  });
  els.messageHistory.addEventListener("click", (event) => {
    const id = event.target.dataset.deleteHistory;
    if (!id) return;
    state.history = state.history.filter((item) => item.id !== id);
    saveJSON(STORAGE_KEYS.history, state.history);
    renderHistory();
  });
}

function initialize() {
  renderProfileOptions();
  renderTaste();
  renderReferences();
  renderHistory();
  renderMetrics();
  bindEvents();
  const requestedView = new URLSearchParams(window.location.search).get("view");
  if (["analyze", "mix", "master", "calibrate", "message", "library"].includes(requestedView)) {
    switchView(requestedView);
  }
  document.querySelectorAll(".studio-engine").forEach((frame) => {
    frame.addEventListener("load", resizeStudioEngines);
  });
  window.setInterval(resizeStudioEngines, 1500);
}

initialize();
