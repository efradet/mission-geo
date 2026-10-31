import test from 'node:test';
import assert from 'node:assert/strict';
import {readSaved, recordMission, emptyProgress, starsFor, rankFor, starCount, prepareQuestion, checkMatch} from '../src/engine.js';
import {missions} from '../src/content.js';

test('étoiles selon les réussites du premier coup', () => {
  assert.equal(starsFor(7, 7), 3);
  assert.equal(starsFor(6, 7), 3);
  assert.equal(starsFor(5, 8), 2);
  assert.equal(starsFor(2, 8), 1);
});

test('la meilleure note est conservée et l’historique grandit', () => {
  let p = emptyProgress();
  const good = Array.from({length: 7}, () => ({firstTry: true}));
  const bad = Array.from({length: 7}, (_, i) => ({firstTry: i < 2}));
  p = recordMission(p, 'scanner', good).progress;
  const r = recordMission(p, 'scanner', bad);
  assert.equal(r.progress.missions.scanner.best, 3);
  assert.equal(r.progress.missions.scanner.plays, 2);
  assert.equal(r.progress.history.length, 2);
  assert.equal(r.improved, false);
  assert.equal(starCount(r.progress), 3);
});

test('sauvegarde invalide ou bricolée : on repart proprement', () => {
  assert.deepEqual(readSaved('pas du json'), emptyProgress());
  assert.deepEqual(readSaved(null), emptyProgress());
  const p = readSaved(JSON.stringify({xp: -5, missions: {scanner: {best: 9, plays: 2}, inconnue: {best: 3}}, history: [{mission: 'x'}, {mission: 'boss', date: 'd', score: 1, total: 8}]}));
  assert.equal(p.xp, 0);
  assert.deepEqual(p.missions, {scanner: {best: 3, plays: 2}});
  assert.equal(p.history.length, 1);
});

test('grades : du premier au dernier', () => {
  assert.equal(rankFor(0).name, 'Recruit');
  assert.equal(rankFor(0).toNext, 3);
  assert.equal(rankFor(30).name, 'Geo Commander');
  assert.equal(rankFor(30).next, null);
});

test('préparer une question garde toutes les réponses', () => {
  for (const m of missions) for (const q of m.questions) {
    const p = prepareQuestion(q, () => 0.3);
    if (q.type === 'choice') assert.deepEqual([...p.options].sort(), [...q.options].sort());
    if (q.type === 'choice' && q.keepOrder) assert.deepEqual(p.options, q.options);
    if (q.type === 'match') for (const [l, r] of q.pairs) assert.ok(checkMatch(q, l, r) && p.left.includes(l) && p.right.includes(r));
  }
});
