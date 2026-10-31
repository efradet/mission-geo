// Outils de géométrie purs (sans React), utilisés par les dessins, le moteur et les tests.

export const W = 320;
export const H = 200;
export const GRID = 20;

export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const mul = (a, k) => [a[0] * k, a[1] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const len = a => Math.hypot(a[0], a[1]);
export const unit = a => mul(a, 1 / (len(a) || 1));

// Intersection des droites (p1p2) et (p3p4). Renvoie null si elles sont parallèles.
export function intersect(p1, p2, p3, p4) {
  const r = sub(p2, p1);
  const s = sub(p4, p3);
  const d = cross(r, s);
  if (Math.abs(d) < 1e-9) return null;
  const t = cross(sub(p3, p1), s) / d;
  return add(p1, mul(r, t));
}

// Paramètres t pour lesquels a + t(b-a) reste dans le cadre [0,w]x[0,h].
export function tRange(a, b, w = W, h = H) {
  const d = sub(b, a);
  let lo = -Infinity;
  let hi = Infinity;
  const axes = [[a[0], d[0], 0, w], [a[1], d[1], 0, h]];
  for (const [p, dp, min, max] of axes) {
    if (Math.abs(dp) < 1e-12) {
      if (p < min || p > max) return null;
      continue;
    }
    const t1 = (min - p) / dp;
    const t2 = (max - p) / dp;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  }
  return lo <= hi ? [lo, hi] : null;
}

// Extrémités visibles d'une droite, d'une demi-droite ou d'un segment.
export function visibleEnds(kind, a, b, w = W, h = H) {
  if (kind === 'seg') return [a, b];
  const r = tRange(a, b, w, h);
  if (!r) return null;
  const d = sub(b, a);
  const lo = kind === 'ray' ? Math.max(0, r[0]) : r[0];
  return [add(a, mul(d, lo)), add(a, mul(d, r[1]))];
}

// Distance d'un point à la droite (ab).
export function distToLine(p, a, b) {
  return Math.abs(cross(sub(b, a), sub(p, a))) / len(sub(b, a));
}

// Le point p est-il sur l'objet (droite, demi-droite ou segment) défini par a et b ?
export function contains(kind, a, b, p, eps = 0.5) {
  if (distToLine(p, a, b) > eps) return false;
  const d = sub(b, a);
  const t = dot(sub(p, a), d) / dot(d, d);
  const tol = eps / len(d);
  if (kind === 'line') return true;
  if (kind === 'ray') return t >= -tol;
  return t >= -tol && t <= 1 + tol;
}

// Relation entre deux directions : parallèles, perpendiculaires ou simplement sécantes.
export function relation(u, v) {
  const c = cross(unit(u), unit(v));
  const d = dot(unit(u), unit(v));
  if (Math.abs(c) < 1e-6) return 'parallel';
  if (Math.abs(d) < 1e-6) return 'perpendicular';
  return 'secant';
}

// Nœuds du quadrillage sur lesquels on peut cliquer.
export function gridNodes(w = W, h = H, step = GRID) {
  const nodes = [];
  for (let y = step; y < h; y += step) for (let x = step; x < w; x += step) nodes.push([x, y]);
  return nodes;
}
