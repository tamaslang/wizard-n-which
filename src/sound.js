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

// An old wooden door: a slow, rattly stick-slip "rrrrreeeak" with a wandering low pitch and a woody resonance.
function creak() {
  if (muted) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const dur = 1.7;
  const osc = a.createOscillator();
  osc.type = "sawtooth";
  const amp = a.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  let f = 70;
  for (let x = 0; x < dur; x += 0.03) {
    f = Math.min(150, Math.max(45, f + (Math.random() - 0.45) * 25));
    const swing = Math.sin((x / dur) * Math.PI);
    osc.frequency.linearRampToValueAtTime(f * (0.8 + swing * 0.5), t + x);
    amp.gain.linearRampToValueAtTime((0.05 + Math.random() * 0.09) * (0.3 + swing), t + x);
  }
  amp.gain.linearRampToValueAtTime(0.0001, t + dur);
  const body = a.createBiquadFilter();
  body.type = "bandpass";
  body.Q.value = 7;
  body.frequency.setValueAtTime(500, t);
  body.frequency.linearRampToValueAtTime(950, t + dur * 0.5);
  body.frequency.linearRampToValueAtTime(600, t + dur);
  osc.connect(body).connect(amp).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const sfx = {
  step: () => { noise(0.06, { vol: 0.08, freq: 600 }); tone(110 + Math.random() * 30, 0.06, { vol: 0.08 }); },
  softStep: () => noise(0.05, { vol: 0.03, freq: 400 }),
  jump: () => tone(280, 0.2, { type: "triangle", to: 760, vol: 0.16 }),
  land: () => { tone(150, 0.14, { to: 60, vol: 0.18 }); noise(0.08, { vol: 0.07, freq: 500 }); },
  crouch: () => tone(220, 0.1, { to: 140, vol: 0.1 }),
  sit: () => { tone(240, 0.12, { to: 150, vol: 0.14 }); tone(180, 0.1, { to: 120, vol: 0.1, delay: 0.08 }); },
  stand: () => tone(320, 0.12, { type: "triangle", to: 520, vol: 0.12 }),
  door: () => { creak(); tone(90, 0.2, { to: 55, vol: 0.12, delay: 1.75 }); },
  click: () => tone(660, 0.07, { type: "triangle", vol: 0.1 }),
};

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  localStorage.setItem("wnw-muted", value ? "1" : "0");
}
