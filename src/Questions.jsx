import React, {useEffect, useState} from 'react';
import {Check, Delete, RotateCcw, Crosshair} from 'lucide-react';
import Figure from './Figure.jsx';
import {checkChoice, checkMatch, checkBuild, checkGrid, checkPick} from './engine.js';

// Answers use the code font only when every option is written in symbols.
const looksLikeCode = s => /[[\]()∈∉⊥/=]|^[A-Z]{1,2}$/.test(s);

export function ChoiceQuestion({q, solved, onTry}) {
  const [wrong, setWrong] = useState([]);
  const choose = option => {
    if (solved || wrong.includes(option)) return;
    const ok = checkChoice(q, option);
    if (!ok) setWrong(w => [...w, option]);
    onTry(ok);
  };
  useEffect(() => {
    const onKey = e => {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < q.options.length) choose(q.options[i]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const long = q.options.some(o => o.length > 16);
  const mono = q.options.every(looksLikeCode);
  return <>
    {q.code && <div className="code-display" aria-label="Code to complete">
      <span>{q.code[0]}</span><span className={`slot${solved ? ' filled' : ''}`}>{solved ? q.answer : '?'}</span><span>{q.code[1]}</span>
    </div>}
    {q.figure && <Figure figure={q.figure}/>}
    <div className={`options n${q.options.length}${long ? ' long' : ''}`}>
      {q.options.map((o, i) => {
        const state = solved && o === q.answer ? 'good' : wrong.includes(o) ? 'bad' : '';
        return <button key={o} data-value={o} className={`option ${state}${mono ? ' code' : ''}`} onClick={() => choose(o)} disabled={solved || wrong.includes(o)} aria-pressed={state === 'good'}>
          <span className="option-num">{i + 1}</span>
          <span className="option-text">{o}{q.subs?.[o] && <small>{q.subs[o]}</small>}</span>
          {state === 'good' && <Check size={20}/>}
        </button>;
      })}
    </div>
  </>;
}

export function MatchQuestion({q, solved, onTry}) {
  const [picked, setPicked] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);
  const colorOf = left => matched.indexOf(left);
  const rightOwner = right => q.pairs.find(([l, r]) => r === right && matched.includes(l))?.[0];
  const select = (side, value) => {
    if (solved) return;
    if (side === 'left' && matched.includes(value)) return;
    if (side === 'right' && rightOwner(value)) return;
    if (!picked || picked.side === side) { setPicked({side, value}); return; }
    const left = side === 'left' ? value : picked.value;
    const right = side === 'right' ? value : picked.value;
    setPicked(null);
    if (checkMatch(q, left, right)) {
      const next = [...matched, left];
      setMatched(next);
      onTry(true, next.length < q.pairs.length);
    } else {
      setFlash({left, right});
      setTimeout(() => setFlash(null), 650);
      onTry(false);
    }
  };
  const cls = (side, value) => {
    const left = side === 'left' ? value : rightOwner(value);
    const done = left && matched.includes(left);
    const isPicked = picked && picked.side === side && picked.value === value;
    const isFlash = flash && (side === 'left' ? flash.left === value : flash.right === value);
    return `match-item ${side}${done ? ` done c${colorOf(left)}` : ''}${isPicked ? ' picked' : ''}${isFlash ? ' bad' : ''}`;
  };
  return <div className="match">
    <p className="match-help">Tap a card on the left, then its partner on the right.</p>
    <div className="match-cols">
      <div className="match-col">{q.left.map(l => <button key={l} className={cls('left', l)} onClick={() => select('left', l)} disabled={solved}><span className="code-text">{l}</span>{matched.includes(l) && <Check size={16}/>}</button>)}</div>
      <div className="match-col">{q.right.map(r => <button key={r} className={cls('right', r)} onClick={() => select('right', r)} disabled={solved}>{r}</button>)}</div>
    </div>
  </div>;
}

export function PickQuestion({q, solved, onTry}) {
  const [marks, setMarks] = useState({});
  const pick = name => {
    if (solved) return;
    const ok = checkPick(q, name);
    setMarks(m => ({...m, [name]: ok ? 'good' : 'bad'}));
    onTry(ok);
  };
  return <>
    <div className="pick-tip"><Crosshair size={16}/> Aim at a point and click it.</div>
    <Figure figure={q.figure} candidates={q.candidates} marks={solved ? {...marks, [q.answer]: 'good'} : marks} onPick={pick}/>
  </>;
}

export function BuildQuestion({q, solved, onTry}) {
  const [used, setUsed] = useState([]);
  const [shake, setShake] = useState(false);
  const tokens = used.map(i => q.tiles[i]);
  const submit = () => {
    if (!used.length || solved) return;
    const ok = checkBuild(q, tokens);
    if (!ok) { setShake(true); setTimeout(() => setShake(false), 500); }
    onTry(ok);
  };
  return <div className="build">
    <div className="sentence">“{q.sentence}”</div>
    <div className={`answer-line${shake ? ' shake' : ''}${solved ? ' good' : ''}`} aria-live="polite">
      {tokens.length ? tokens.map((t, k) => <button key={k} className="token placed" onClick={() => !solved && setUsed(u => u.filter((_, j) => j !== k))} disabled={solved}>{t}</button>)
        : <span className="placeholder">Tap the tiles to write the code…</span>}
    </div>
    <div className="tiles">
      {q.tiles.map((t, i) => <button key={i} className="token" disabled={solved || used.includes(i)} onClick={() => setUsed(u => [...u, i])}>{t}</button>)}
    </div>
    {!solved && <div className="build-actions">
      <button className="ghost-button" onClick={() => setUsed([])} disabled={!used.length}><RotateCcw size={16}/> Clear</button>
      <button className="ghost-button" onClick={() => setUsed(u => u.slice(0, -1))} disabled={!used.length}><Delete size={16}/> Undo</button>
      <button className="primary small" onClick={submit} disabled={!used.length}>Check my code</button>
    </div>}
  </div>;
}

export function GridQuestion({q, solved, onTry}) {
  const [selected, setSelected] = useState(null);
  const [tried, setTried] = useState(false);
  const submit = () => {
    if (!selected || solved) return;
    setTried(true);
    onTry(checkGrid(q, selected));
  };
  return <div className="grid-q">
    <Figure figure={q.figure} grid={{from: q.from, selected, locked: solved, onNode: n => { setSelected(n); setTried(false); }}}/>
    {!solved && <div className="build-actions">
      <span className="grid-help">{selected ? (tried ? 'Move M to another grid point.' : 'The line (AM) appears as a dashed line.') : 'Click on a grid point.'}</span>
      <button className="primary small" onClick={submit} disabled={!selected || tried}>Check position</button>
    </div>}
  </div>;
}
