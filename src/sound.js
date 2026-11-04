// Tiny synthesised sound effects (Web Audio) so no audio files are needed.
let ctx = null;
let muted = localStorage.getItem("wnw-muted") === "1";

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Browsers only allow audio after a tap or key press.
for (const type of ["pointerdown", "keydown"]) addEventListener(type, audio, { passive: true });

function tone(freq, dur, { type = "sine", vol = 0.15, to = freq, delay = 0 } = {}) {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dur, { vol = 0.1, freq = 800, delay = 0 } = {}) {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const buffer = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buffer;
  const filter = a.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = freq;
  const gain = a.createGain();
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t);
}

// A short, spooky door: a quick rising creak, a wobbly ghostly wail over it, and a soft thud.
function creak() {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const dur = 0.55;
  const osc = a.createOscillator();
  osc.type = "sawtooth";
  const amp = a.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  let f = 110;
  for (let x = 0; x < dur; x += 0.025) {
    f = Math.min(260, Math.max(90, f + (Math.random() - 0.3) * 30));
    const swing = Math.sin((x / dur) * Math.PI);
    osc.frequency.linearRampToValueAtTime(f * (0.9 + swing * 0.6), t + x);
    amp.gain.linearRampToValueAtTime((0.04 + Math.random() * 0.07) * (0.3 + swing), t + x);
  }
  amp.gain.linearRampToValueAtTime(0.0001, t + dur);
  const body = a.createBiquadFilter();
  body.type = "bandpass";
  body.Q.value = 8;
  body.frequency.setValueAtTime(600, t);
  body.frequency.linearRampToValueAtTime(1300, t + dur);
  osc.connect(body).connect(amp).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);

  const wail = a.createOscillator();
  wail.type = "sine";
  wail.frequency.setValueAtTime(520, t);
  wail.frequency.exponentialRampToValueAtTime(330, t + dur);
  const vibrato = a.createOscillator();
  const vibratoDepth = a.createGain();
  vibrato.frequency.value = 9;
  vibratoDepth.gain.value = 25;
  vibrato.connect(vibratoDepth).connect(wail.frequency);
  const wailAmp = a.createGain();
  wailAmp.gain.setValueAtTime(0.0001, t);
  wailAmp.gain.linearRampToValueAtTime(0.05, t + dur * 0.4);
  wailAmp.gain.linearRampToValueAtTime(0.0001, t + dur);
  wail.connect(wailAmp).connect(a.destination);
  wail.start(t);
  vibrato.start(t);
  wail.stop(t + dur + 0.05);
  vibrato.stop(t + dur + 0.05);
}

export const sfx = {
  step: () => { noise(0.06, { vol: 0.08, freq: 600 }); tone(110 + Math.random() * 30, 0.06, { vol: 0.08 }); },
  softStep: () => noise(0.05, { vol: 0.03, freq: 400 }),
  jump: () => tone(280, 0.2, { type: "triangle", to: 760, vol: 0.16 }),
  land: () => { tone(150, 0.14, { to: 60, vol: 0.18 }); noise(0.08, { vol: 0.07, freq: 500 }); },
  crouch: () => tone(220, 0.1, { to: 140, vol: 0.1 }),
  sit: () => { tone(240, 0.12, { to: 150, vol: 0.14 }); tone(180, 0.1, { to: 120, vol: 0.1, delay: 0.08 }); },
  stand: () => tone(320, 0.12, { type: "triangle", to: 520, vol: 0.12 }),
  door: () => { creak(); tone(90, 0.15, { to: 50, vol: 0.12, delay: 0.5 }); },
  take: () => { tone(520, 0.1, { type: "triangle", to: 880, vol: 0.14 }); tone(1040, 0.08, { type: "triangle", vol: 0.08, delay: 0.08 }); },
  click: () => tone(660, 0.07, { type: "triangle", vol: 0.1 }),
};

// Spooky waltz in A harmonic minor: bell-like melody, "oom-pah-pah" bass and a ghostly wail every other loop.
const BEAT = 0.6;
const MELODY = [
  [[440, 1], [523, 1], [659, 1]], [[659, 2], [587, 1]], [[523, 1], [494, 1], [523, 1]], [[440, 3]],
  [[440, 1], [523, 1], [659, 1]], [[698, 2], [659, 1]], [[587, 1], [523, 1], [415, 1]], [[440, 3]],
];
const BASS = [110, 110, 87.3, 82.4, 110, 73.4, 82.4, 110];
let music = null;
let wantMusic = false;

function musicNote(a, bus, freq, when, dur, { type = "triangle", vol = 0.1 } = {}) {
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(vol, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(gain).connect(bus);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function scheduleBar(a, bus, bar, loop, when) {
  let t = when;
  for (const [freq, beats] of MELODY[bar]) {
    const dur = beats * BEAT;
    musicNote(a, bus, freq, t, dur * 1.3, { vol: 0.09 });
    musicNote(a, bus, freq * 2, t, dur * 0.7, { type: "sine", vol: 0.03 });
    t += dur;
  }
  musicNote(a, bus, BASS[bar], when, BEAT * 1.2, { vol: 0.16 });
  musicNote(a, bus, BASS[bar] * 3, when + BEAT, BEAT * 0.4, { vol: 0.04 });
  musicNote(a, bus, BASS[bar] * 3, when + BEAT * 2, BEAT * 0.4, { vol: 0.04 });
  if (bar === 3 && loop % 2 === 1) {
    const wail = a.createOscillator();
    const gain = a.createGain();
    wail.type = "sine";
    wail.frequency.setValueAtTime(660, when);
    wail.frequency.exponentialRampToValueAtTime(990, when + BEAT * 1.5);
    wail.frequency.exponentialRampToValueAtTime(520, when + BEAT * 3);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(0.05, when + BEAT * 1.5);
    gain.gain.linearRampToValueAtTime(0.0001, when + BEAT * 3);
    wail.connect(gain).connect(bus);
    wail.start(when);
    wail.stop(when + BEAT * 3 + 0.05);
  }
}

export function startMusic() {
  wantMusic = true;
  if (muted || music) return;
  const a = audio();
  if (!a) return;
  const bus = a.createGain();
  bus.gain.value = 1;
  bus.connect(a.destination);
  music = { bus, next: null, bar: 0, loop: 0 };
  music.timer = setInterval(() => {
    if (a.state !== "running") return;
    if (music.next === null) music.next = a.currentTime + 0.1;
    while (music.next < a.currentTime + 1.5) {
      scheduleBar(a, bus, music.bar, music.loop, music.next);
      music.next += BEAT * 3;
      music.bar = (music.bar + 1) % MELODY.length;
      if (music.bar === 0) music.loop++;
    }
  }, 200);
}

export function stopMusic() {
  wantMusic = false;
  if (!music) return;
  const { bus, timer } = music;
  music = null;
  clearInterval(timer);
  bus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
  setTimeout(() => bus.disconnect(), 1500);
}

export const isMusicPlaying = () => music !== null;

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  if (value) { const keep = wantMusic; stopMusic(); wantMusic = keep; }
  else if (wantMusic) startMusic();
  localStorage.setItem("wnw-muted", value ? "1" : "0");
}
