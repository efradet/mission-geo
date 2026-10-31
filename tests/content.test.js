// Vérifie que chaque réponse du contenu est juste, en recalculant la géométrie des dessins.
import test from 'node:test';
import assert from 'node:assert/strict';
import {missions, notions, sectors} from '../src/content.js';
import {intersect, contains, relation, sub, W, H, GRID, gridNodes, tRange} from '../src/geometry.js';
import {checkGrid, checkBuild} from '../src/engine.js';

const kindOf = {seg: 'seg', line: 'line', ray: 'ray'};
const drawable = f => f.items.filter(i => kindOf[i.t]);
const P = (f, n) => f.pts[n];
const itemByName = (f, name) => f.items.find(i => i.name === name);
const onItem = (f, item, p) => contains(item.t, P(f, item.a), P(f, item.b), p, 0.6);
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.6;
const inside = p => p[0] >= 0 && p[0] <= W && p[1] >= 0 && p[1] <= H;

function allText(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach(v => allText(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach(v => allText(v, out));
  return out;
}

test('il y a exactement 10 missions, numérotées de 1 à 10', () => {
  assert.equal(missions.length, 10);
  assert.deepEqual(missions.map(m => m.num), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(new Set(missions.map(m => m.id)).size, 10);
});

test('chaque question a une consigne, un indice et une explication', () => {
  for (const m of missions) {
    assert.ok(m.questions.length >= 3, m.id);
    for (const q of m.questions) {
      assert.ok(q.prompt && q.hint && q.explain, `${m.id}: ${q.prompt}`);
    }
  }
});

test('aucun tiret long dans les textes', () => {
  for (const s of allText({missions, notions, sectors})) assert.ok(!/[—–]/.test(s), s);
});

test('les fiches renvoient vers des missions et des secteurs existants', () => {
  const ids = new Set(missions.map(m => m.id));
  for (const n of notions) assert.ok(ids.has(n.mission), n.id);
  for (const s of sectors) for (const n of s.notions) assert.ok(notions.some(x => x.id === n), n);
  const covered = sectors.flatMap(s => s.notions);
  for (const n of notions) assert.ok(covered.includes(n.id), `${n.id} absent de la carte`);
});

test('tous les points visibles sont dans le cadre', () => {
  const figs = [...notions.map(n => n.figure), ...missions.flatMap(m => m.questions.map(q => q.figure)).filter(Boolean)];
  for (const f of figs) {
    for (const [name, p] of Object.entries(f.pts)) {
      if (name.startsWith('_') || (f.hide || []).includes(name)) continue;
      assert.ok(inside(p), `${name} hors cadre ${p}`);
    }
    for (const it of drawable(f)) {
      assert.ok(P(f, it.a) && P(f, it.b), 'point manquant');
      if (it.t !== 'seg') assert.ok(tRange(P(f, it.a), P(f, it.b)), 'droite invisible');
    }
  }
});

test('questions à choix : la bonne réponse fait partie des propositions', () => {
  for (const m of missions) for (const q of m.questions.filter(q => q.type === 'choice')) {
    assert.ok(q.options.includes(q.answer), q.prompt);
    assert.equal(new Set(q.options).size, q.options.length, q.prompt);
  }
});

test('mission 1 : le nom de l’objet correspond au dessin', () => {
  const names = {seg: 'A segment', line: 'A line', ray: 'A half-line'};
  for (const q of missions[0].questions.filter(q => q.verify?.kind === 'object')) {
    const items = drawable(q.figure);
    const expected = q.verify.item === null ? 'A point' : names[items[q.verify.item].t];
    if (q.verify.item === null) assert.equal(items.length, 0);
    assert.equal(q.answer, expected, q.prompt);
  }
});

test('duels et notations : parallèles, perpendiculaires ou sécantes recalculés', () => {
  const label = {parallel: 'Parallel //', perpendicular: 'Orthogonal ⊥', secant: 'Intersecting, no right angle'};
  for (const m of missions) for (const q of m.questions) {
    if (!q.verify || !['duel', 'relation'].includes(q.verify.kind)) continue;
    const [d, e] = q.verify.lines.map(n => itemByName(q.figure, n));
    const rel = relation(sub(P(q.figure, d.b), P(q.figure, d.a)), sub(P(q.figure, e.b), P(q.figure, e.a)));
    if (q.verify.kind === 'duel') assert.equal(q.answer, label[rel], q.prompt);
    else assert.equal(rel, q.verify.expect, q.prompt);
    const marked = q.figure.items.some(i => i.t === 'right');
    assert.equal(marked, rel === 'perpendicular', `angle droit marqué seulement si perpendiculaires : ${q.prompt}`);
  }
});

test('les angles droits marqués sont vraiment droits et au croisement', () => {
  const figs = [...notions.map(n => n.figure), ...missions.flatMap(m => m.questions.map(q => q.figure)).filter(Boolean)];
  for (const f of figs) for (const r of f.items.filter(i => i.t === 'right')) {
    const at = P(f, r.at);
    const u = sub(P(f, r.u), at);
    const v = sub(P(f, r.v), at);
    assert.equal(relation(u, v), 'perpendicular');
    const through = drawable(f).filter(it => onItem(f, it, at));
    assert.ok(through.length >= 2, 'le carré doit être sur un croisement');
  }
});

test('clics sur les points d’intersection : seul le bon point convient', () => {
  for (const m of missions) for (const q of m.questions.filter(q => q.type === 'pick')) {
    const f = q.figure;
    const items = q.verify.lines ? q.verify.lines.map(n => itemByName(f, n)) : q.verify.items.map(i => f.items[i]);
    for (const c of q.candidates) {
      const onAll = items.every(it => onItem(f, it, P(f, c)));
      assert.equal(onAll, c === q.answer, `${q.prompt} / ${c}`);
    }
  }
});

test('comptage des points d’intersection', () => {
  for (const m of missions) for (const q of m.questions.filter(q => q.verify?.kind === 'count')) {
    const f = q.figure;
    const lines = drawable(f);
    const found = [];
    for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
      const p = intersect(P(f, lines[i].a), P(f, lines[i].b), P(f, lines[j].a), P(f, lines[j].b));
      if (p && inside(p) && onItem(f, lines[i], p) && onItem(f, lines[j], p) && !found.some(x => near(x, p))) found.push(p);
    }
    assert.equal(String(found.length), q.answer, q.prompt);
  }
});

test('segment et droite : intersection recalculée', () => {
  for (const m of missions) for (const q of m.questions.filter(q => q.verify?.kind === 'segHits')) {
    const f = q.figure;
    const s = f.items[q.verify.seg];
    const d = itemByName(f, q.verify.line);
    const p = intersect(P(f, s.a), P(f, s.b), P(f, d.a), P(f, d.b));
    const hits = !!p && onItem(f, s, p);
    assert.equal(q.answer, hits ? 'Yes' : 'No');
    assert.ok(p && inside(p), 'la droite (AB) doit croiser d sur le dessin, pour l’explication');
  }
});

test('droites concourantes recalculées', () => {
  const concurrent = (f, names) => {
    const ls = names.map(n => itemByName(f, n));
    const p = intersect(P(f, ls[0].a), P(f, ls[0].b), P(f, ls[1].a), P(f, ls[1].b));
    return !!p && ls.every(l => onItem(f, l, p));
  };
  for (const m of missions) for (const q of m.questions) {
    if (q.verify?.kind === 'concur') assert.equal(q.answer, concurrent(q.figure, q.verify.lines) ? 'Yes' : 'No', q.prompt);
    if (q.verify?.kind === 'concurChoice') {
      for (const opt of q.options) {
        const names = opt.match(/\b[defg]\b/g);
        assert.equal(concurrent(q.figure, names), opt === q.answer, opt);
      }
    }
    if (q.verify?.kind === 'intersection' && q.verify.lines?.length === 3) assert.ok(concurrent(q.figure, q.verify.lines));
  }
});

test('mission ∈ / ∉ : appartenance recalculée', () => {
  for (const q of missions.find(m => m.id === 'magnet').questions.filter(q => q.verify?.kind === 'member')) {
    const f = q.figure;
    const inIt = onItem(f, f.items[q.verify.item], P(f, q.verify.point));
    assert.equal(q.answer, inIt ? '∈' : '∉', q.code.join(' ? '));
    assert.equal(q.code[0], q.verify.point);
  }
});

test('le traducteur : chaque réponse acceptée utilise les tuiles proposées', () => {
  for (const q of missions.find(m => m.id === 'translator').questions) {
    for (const a of q.accept) {
      const pool = [...q.tiles];
      for (const t of a) {
        const i = pool.indexOf(t);
        assert.ok(i >= 0, `${t} manque pour « ${q.sentence} »`);
        pool.splice(i, 1);
      }
      assert.ok(checkBuild(q, a));
    }
  }
});

test('le décodeur : paires uniques des deux côtés', () => {
  for (const q of missions.find(m => m.id === 'decoder').questions) {
    assert.equal(new Set(q.pairs.map(p => p[0])).size, q.pairs.length);
    assert.equal(new Set(q.pairs.map(p => p[1])).size, q.pairs.length);
  }
});

test('constructions sur quadrillage : plusieurs bonnes positions, toutes justes', () => {
  for (const q of missions.flatMap(m => m.questions).filter(q => q.type === 'grid')) {
    const A = q.figure.pts[q.from];
    assert.equal(A[0] % GRID, 0);
    assert.equal(A[1] % GRID, 0);
    const d = itemByName(q.figure, q.rule.line);
    assert.ok(!onItem(q.figure, d, A), 'A ne doit pas être sur d');
    const good = gridNodes().filter(n => checkGrid(q, n));
    assert.ok(good.length >= 2, q.prompt);
    for (const n of good) {
      const rel = relation(sub(q.figure.pts[d.b], q.figure.pts[d.a]), sub(n, A));
      assert.equal(rel, q.rule.kind, `${n}`);
    }
  }
});
