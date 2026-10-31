import React from 'react';
import {W, H, GRID, visibleEnds, sub, add, mul, unit, gridNodes} from './geometry.js';

export const lineColors = {d: '#1f6feb', e: '#ef6a1f', f: '#3f9418', g: '#7b4ff0'};
const INK = '#1b2a4a';

const offsets = {n: [0, -13], s: [0, 21], e: [13, 5], w: [-13, 5], ne: [10, -10], nw: [-10, -10], se: [10, 19], sw: [-10, 19]};
const anchors = {n: 'middle', s: 'middle', e: 'start', w: 'end', ne: 'start', nw: 'end', se: 'start', sw: 'end'};

function Cross({p, color = INK}) {
  const s = 5;
  return <g stroke={color} strokeWidth="2.4" strokeLinecap="round">
    <line x1={p[0] - s} y1={p[1] - s} x2={p[0] + s} y2={p[1] + s}/>
    <line x1={p[0] - s} y1={p[1] + s} x2={p[0] + s} y2={p[1] - s}/>
  </g>;
}

function Item({item, pts}) {
  const a = pts[item.a];
  const b = pts[item.b];
  if (item.t === 'right') {
    const at = pts[item.at];
    const u = mul(unit(sub(pts[item.u], at)), 13);
    const v = mul(unit(sub(pts[item.v], at)), 13);
    const p1 = add(at, u);
    const p2 = add(add(at, u), v);
    const p3 = add(at, v);
    return <path d={`M${p1} L${p2} L${p3}`} fill="none" stroke={INK} strokeWidth="1.8"/>;
  }
  if (item.t === 'dim') {
    const n = mul(unit([-(b[1] - a[1]), b[0] - a[0]]), -22);
    const p = add(a, n);
    const q = add(b, n);
    const mid = mul(add(p, q), 0.5);
    return <g className="dim">
      <line x1={a[0]} y1={a[1]} x2={p[0]} y2={p[1]} strokeDasharray="3 3"/>
      <line x1={b[0]} y1={b[1]} x2={q[0]} y2={q[1]} strokeDasharray="3 3"/>
      <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
      <rect x={mid[0] - 24} y={mid[1] - 11} width="48" height="20" rx="6" fill="#fff"/>
      <text x={mid[0]} y={mid[1] + 4} textAnchor="middle">{item.text}</text>
    </g>;
  }
  const ends = visibleEnds(item.t, a, b);
  if (!ends) return null;
  const [p, q] = ends;
  const color = lineColors[item.name] || INK;
  let label = null;
  if (item.name) {
    const at = add(p, mul(sub(q, p), 0.9));
    const n = mul(unit([-(q[1] - p[1]), q[0] - p[0]]), 13);
    const pos = add(at, n);
    label = <text className="line-name" x={pos[0]} y={pos[1] + 5} textAnchor="middle" fill={color}>{item.name}</text>;
  }
  return <g>
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth="3" strokeLinecap={item.t === 'seg' ? 'butt' : 'round'}/>
    {label}
  </g>;
}

export default function Figure({figure, candidates = [], marks = {}, onPick, grid, compact = false, title}) {
  const {pts, items = [], labels = {}, hide = []} = figure;
  const visible = Object.keys(pts).filter(n => !n.startsWith('_') && !hide.includes(n));
  const showGrid = figure.grid || !!grid;
  const preview = grid?.selected ? visibleEnds('line', pts[grid.from], grid.selected) : null;
  return <svg className={`figure${compact ? ' compact' : ''}`} viewBox={`-14 -14 ${W + 28} ${H + 28}`} role="img" aria-label={title || 'Geometry drawing'}>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" fill="none" stroke={INK} strokeWidth="1.6"/></marker>
      <clipPath id="frame"><rect x="0" y="0" width={W} height={H}/></clipPath>
    </defs>
    <rect className="figure-bg" x="-14" y="-14" width={W + 28} height={H + 28} rx="14"/>
    {showGrid
      ? <g className="grid-lines">{Array.from({length: W / GRID + 1}, (_, i) => <line key={`x${i}`} x1={i * GRID} y1="0" x2={i * GRID} y2={H}/>)}{Array.from({length: H / GRID + 1}, (_, i) => <line key={`y${i}`} x1="0" y1={i * GRID} x2={W} y2={i * GRID}/>)}</g>
      : <g className="grid-dots">{gridNodes().map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9"/>)}</g>}
    {grid && <g className="grid-layer">{gridNodes().map(node => {
      const isFrom = pts[grid.from][0] === node[0] && pts[grid.from][1] === node[1];
      const sel = grid.selected && grid.selected[0] === node[0] && grid.selected[1] === node[1];
      if (isFrom) return null;
      return <g key={node.join('-')} data-node={node.join(',')} className={`grid-node${sel ? ' selected' : ''}`} onClick={() => !grid.locked && grid.onNode(node)}>
        <circle className="hit" cx={node[0]} cy={node[1]} r="9"/>
        <circle className="dot" cx={node[0]} cy={node[1]} r={sel ? 0 : 2.6}/>
      </g>;
    })}</g>}
    <g clipPath="url(#frame)" pointerEvents="none">
      {items.map((item, i) => <Item key={i} item={item} pts={pts}/>)}
      {preview && <line className="preview-line" x1={preview[0][0]} y1={preview[0][1]} x2={preview[1][0]} y2={preview[1][1]}/>}
    </g>
    <g pointerEvents="none">
      {visible.map(name => {
        const p = pts[name];
        const pos = labels[name] || 'ne';
        const [dx, dy] = offsets[pos];
        return <g key={name}>
          <Cross p={p}/>
          <text className="point-name" x={p[0] + dx} y={p[1] + dy} textAnchor={anchors[pos]}>{name}</text>
        </g>;
      })}
      {grid?.selected && <><Cross p={grid.selected} color="#7b4ff0"/><text className="point-name m" x={grid.selected[0] + 10} y={grid.selected[1] - 9}>M</text></>}
    </g>
    {candidates.map(name => {
      const p = pts[name];
      const state = marks[name];
      return <g key={name} className={`pick${state ? ` ${state}` : ''}`} onClick={() => onPick && !state && onPick(name)}
        role="button" tabIndex={state ? -1 : 0} aria-label={`Point ${name}`}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && onPick && !state) { e.preventDefault(); onPick(name); } }}>
        <circle className="ring" cx={p[0]} cy={p[1]} r="13"/>
        <circle className="hit" cx={p[0]} cy={p[1]} r="17"/>
      </g>;
    })}
  </svg>;
}
