import React from 'react';
import {Star, Medal, Lock, Clock3} from 'lucide-react';
import {missions, missionById, sectors} from './content.js';
import {ranks, rankFor, starCount, totalStars} from './engine.js';
import {MissionIcon} from './icons.jsx';

const fmt = iso => {
  try { return new Date(iso).toLocaleString('en-GB', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}); } catch { return ''; }
};

export default function Trophies({progress, onPlay}) {
  const stars = starCount(progress);
  const rank = rankFor(stars);
  const history = [...progress.history].reverse().slice(0, 10);
  return <section className="trophies" aria-labelledby="trophies-title">
    <div className="section-heading">
      <div><span className="eyebrow">Trophy room</span><h2 id="trophies-title">Your hall of fame</h2></div>
      <span className="section-note"><Star size={15}/> {stars} / {totalStars} stars · {progress.xp} XP</span>
    </div>
    <div className="trophy-layout">
      <div className="panel ranks-panel">
        <h3>Ranks</h3>
        <ol className="rank-ladder">
          {ranks.map((r, i) => <li key={r.name} className={i < rank.index ? 'passed' : i === rank.index ? 'current' : ''}>
            <span className="rank-badge">{i <= rank.index ? <Medal size={18}/> : <Lock size={15}/>}</span>
            <div><strong>{r.name}</strong><span>{r.min} ★ · {r.motto}</span></div>
          </li>)}
        </ol>
      </div>
      <div className="panel badges-panel">
        <h3>Mission badges</h3>
        <div className="badges">
          {missions.map(m => {
            const best = progress.missions[m.id]?.best || 0;
            return <button key={m.id} className={`badge tone-${m.boss ? 'boss' : sectors.find(s => s.id === m.sector).tone}${best ? ' earned' : ''}`} onClick={() => onPlay(m.id)}>
              <span className="badge-icon"><MissionIcon name={m.icon} size={22}/></span>
              <strong>{m.title}</strong>
              <span className="mini-stars">{[1, 2, 3].map(n => <Star key={n} size={13} className={n <= best ? 'on' : ''}/>)}</span>
            </button>;
          })}
        </div>
        <h3 className="history-title">Latest missions</h3>
        {history.length === 0
          ? <p className="empty">No missions finished yet. Launch your first one from your base!</p>
          : <ul className="history">{history.map((h, i) => <li key={i}>
              <span className="history-date"><Clock3 size={14}/> {fmt(h.date)}</span>
              <strong>{missionById[h.mission].title}</strong>
              <span>{h.score}/{h.total} first try</span>
              <span className="mini-stars">{[1, 2, 3].map(n => <Star key={n} size={12} className={n <= h.stars ? 'on' : ''}/>)}</span>
            </li>)}</ul>}
      </div>
    </div>
  </section>;
}
