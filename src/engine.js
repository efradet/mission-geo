// Moteur : mélange, corrections, étoiles, grades et sauvegarde locale.
import {sub, cross, dot, len} from './geometry.js';
import {missions, totalStars} from './content.js';

export const STORAGE_KEY = 'mission-geo-progress-v1';
export const PREFS_KEY = 'mission-geo-prefs-v1';

export const ranks = [
  {min: 0, name: 'Recruit', motto: 'Everything starts here.'},
  {min: 3, name: 'Cadet', motto: 'The basics are in place.'},
  {min: 8, name: 'Pilot', motto: 'You are at the controls.'},
  {min: 14, name: 'Navigator', motto: 'You read maps like a pro.'},
  {min: 20, name: 'Captain', motto: 'The crew trusts you.'},
  {min: 27, name: 'Geo Commander', motto: 'No symbol can stop you now.'}
];

export function rankFor(stars) {
  let index = 0;
  ranks.forEach((r, i) => { if (stars >= r.min) index = i; });
  const next = ranks[index + 1] || null;
  return {...ranks[index], index, next, toNext: next ? next.min - stars : 0};
}

// Mélange déterministe si on fournit une graine (utile pour les tests).
export function shuffle(list, random = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function prepareQuestion(q, random = Math.random) {
  if (q.type === 'choice') return {...q, options: q.keepOrder ? q.options : shuffle(q.options, random)};
  if (q.type === 'match') return {...q, left: shuffle(q.pairs.map(p => p[0]), random), right: shuffle(q.pairs.map(p => p[1]), random)};
  if (q.type === 'build') return {...q, tiles: shuffle(q.tiles, random)};
  return q;
}

export const checkChoice = (q, value) => value === q.answer;
export const checkPick = (q, name) => name === q.answer;
export const checkMatch = (q, left, right) => q.pairs.some(([l, r]) => l === left && r === right);
export const checkBuild = (q, tokens) => q.accept.some(a => a.length === tokens.length && a.every((t, i) => t === tokens[i]));

// Construction sur quadrillage : le point M rend-il (AM) parallèle ou perpendiculaire à la droite demandée ?
export function checkGrid(q, node) {
  const A = q.figure.pts[q.from];
  const target = q.figure.items.find(i => i.name === q.rule.line);
  const u = sub(q.figure.pts[target.b], q.figure.pts[target.a]);
  const v = sub(node, A);
  if (len(v) < 1) return false;
  if (q.rule.kind === 'parallel') return Math.abs(cross(u, v)) < 1e-6;
  return Math.abs(dot(u, v)) < 1e-6;
}

// Étoiles d'une mission terminée, selon les réponses justes du premier coup sans indice.
export function starsFor(firstTry, total) {
  const ratio = total ? firstTry / total : 0;
  if (ratio >= 0.85) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export function xpFor(results) {
  return results.reduce((sum, r) => sum + (r.firstTry ? 10 : 4), 0);
}

export function emptyProgress() {
  return {version: 1, xp: 0, missions: {}, history: []};
}

// Relit une sauvegarde en ignorant tout ce qui est invalide.
export function readSaved(raw) {
  const base = emptyProgress();
  let data;
  try { data = JSON.parse(raw); } catch { return base; }
  if (!data || typeof data !== 'object') return base;
  if (Number.isFinite(data.xp) && data.xp >= 0) base.xp = Math.floor(data.xp);
  const ids = new Set(missions.map(m => m.id));
  if (data.missions && typeof data.missions === 'object') {
    for (const [id, m] of Object.entries(data.missions)) {
      if (!ids.has(id) || !m || typeof m !== 'object') continue;
      const best = Number.isInteger(m.best) ? Math.min(3, Math.max(0, m.best)) : 0;
      const plays = Number.isInteger(m.plays) ? Math.max(0, m.plays) : 0;
      base.missions[id] = {best, plays};
    }
  }
  if (Array.isArray(data.history)) {
    base.history = data.history
      .filter(h => h && ids.has(h.mission) && Number.isInteger(h.score) && Number.isInteger(h.total) && typeof h.date === 'string')
      .slice(-100);
  }
  return base;
}

export function recordMission(progress, missionId, results, date = new Date().toISOString()) {
  const total = results.length;
  const firstTry = results.filter(r => r.firstTry).length;
  const stars = starsFor(firstTry, total);
  const xp = xpFor(results);
  const old = progress.missions[missionId] || {best: 0, plays: 0};
  const next = {
    ...progress,
    xp: progress.xp + xp,
    missions: {...progress.missions, [missionId]: {best: Math.max(old.best, stars), plays: old.plays + 1}},
    history: [...progress.history, {mission: missionId, date, score: firstTry, total, stars, xp}].slice(-100)
  };
  return {progress: next, stars, xp, firstTry, total, improved: stars > old.best};
}

export function starCount(progress) {
  return Object.values(progress.missions).reduce((s, m) => s + (m.best || 0), 0);
}

export {totalStars};
