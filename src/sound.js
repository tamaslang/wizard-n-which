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

// A slow, wobbly, rusty-hinge creak: a sawtooth with uneven pitch and a scratchy filter.
function creak() {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const dur = 1.0;
  const osc = a.createOscillator();
  osc.type = "sawtooth";
  const pitches = [95, 150, 120, 210, 140, 260, 170, 110];
  osc.frequency.setValueAtTime(pitches[0], t);
  pitches.forEach((f, i) => osc.frequency.linearRampToValueAtTime(f * (0.95 + Math.random() * 0.1), t + (i / (pitches.length - 1)) * dur));
  const lfo = a.createOscillator();
  const lfoGain = a.createGain();
  lfo.frequency.value = 13;
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain).connect(osc.frequency);
  const filter = a.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(500, t);
  filter.frequency.linearRampToValueAtTime(1400, t + dur * 0.6);
  filter.frequency.linearRampToValueAtTime(700, t + dur);
  const gain = a.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.16, t + 0.12);
  gain.gain.linearRampToValueAtTime(0.1, t + dur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filter).connect(gain).connect(a.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
  for (let i = 0; i < 5; i++) noise(0.04, { vol: 0.05, freq: 3000, delay: Math.random() * dur });
}

export const sfx = {
  step: () => { noise(0.06, { vol: 0.08, freq: 600 }); tone(110 + Math.random() * 30, 0.06, { vol: 0.08 }); },
  softStep: () => noise(0.05, { vol: 0.03, freq: 400 }),
  jump: () => tone(280, 0.2, { type: "triangle", to: 760, vol: 0.16 }),
  land: () => { tone(150, 0.14, { to: 60, vol: 0.18 }); noise(0.08, { vol: 0.07, freq: 500 }); },
  crouch: () => tone(220, 0.1, { to: 140, vol: 0.1 }),
  sit: () => { tone(240, 0.12, { to: 150, vol: 0.14 }); tone(180, 0.1, { to: 120, vol: 0.1, delay: 0.08 }); },
  stand: () => tone(320, 0.12, { type: "triangle", to: 520, vol: 0.12 }),
  door: () => { creak(); tone(70, 0.25, { to: 40, vol: 0.2, delay: 1.0 }); },
  click: () => tone(660, 0.07, { type: "triangle", vol: 0.1 }),
};

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  localStorage.setItem("wnw-muted", value ? "1" : "0");
}
