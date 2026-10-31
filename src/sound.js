// Petits bruitages synthétisés (aucun fichier, aucune voix). Désactivables dans les réglages.
let ctx = null;
let enabled = true;

export function setSound(on) { enabled = on; }

function tone(freq, start, duration, type = 'square', volume = 0.05) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
}

function play(notes) {
  if (!enabled) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    notes.forEach(n => tone(...n));
  } catch { /* son indisponible : on continue sans */ }
}

export const sfx = {
  good: () => play([[660, 0, 0.09], [990, 0.08, 0.14]]),
  bad: () => play([[180, 0, 0.18, 'sawtooth', 0.035]]),
  click: () => play([[520, 0, 0.04, 'triangle', 0.04]]),
  win: () => play([[523, 0, 0.12], [659, 0.11, 0.12], [784, 0.22, 0.12], [1047, 0.33, 0.3]])
};
