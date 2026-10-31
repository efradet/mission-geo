import React, {useEffect, useState} from 'react';
import {DraftingCompass, Radar, Trophy, Settings2, Rocket, Medal, Star, ArrowRight, ChevronRight, Check, Volume2, VolumeX, Trash2, X, Sparkles, Lock} from 'lucide-react';
import {sectors, notions, notionById, missions, missionById} from './content.js';
import {readSaved, emptyProgress, rankFor, starCount, totalStars, STORAGE_KEY, PREFS_KEY} from './engine.js';
import {setSound} from './sound.js';
import Figure from './Figure.jsx';
import Modal from './Modal.jsx';
import Mission from './Mission.jsx';
import Trophies from './Trophies.jsx';
import {MissionIcon} from './icons.jsx';

function loadProgress() { try { return readSaved(localStorage.getItem(STORAGE_KEY)); } catch { return emptyProgress(); } }
function loadPrefs() { try { const p = JSON.parse(localStorage.getItem(PREFS_KEY)); return {sound: p?.sound !== false}; } catch { return {sound: true}; } }

export default function App() {
  const [view, setView] = useState('base');
  const [selected, setSelected] = useState('segment');
  const [progress, setProgress] = useState(loadProgress);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [missionId, setMissionId] = useState(null);
  const [settings, setSettings] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { setStorageError(true); } }, [progress]);
  useEffect(() => { setSound(prefs.sound); try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { setStorageError(true); } }, [prefs]);
  useEffect(() => { window.scrollTo({top: 0}); }, [view]);

  const stars = starCount(progress);
  const rank = rankFor(stars);
  const notion = notionById[selected];
  const linked = missionById[notion.mission];
  const pickNotion = id => {
    setSelected(id);
    if (window.innerWidth <= 1080) setTimeout(() => document.querySelector('.fiche')?.scrollIntoView({behavior: 'smooth', block: 'start'}), 50);
  };
  const sectorOf = id => sectors.find(s => s.notions.includes(id));
  const toneOf = id => sectorOf(id)?.tone || 'cyan';

  return <div className="app">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="#main" onClick={() => setView('base')}>
        <span className="brand-icon"><DraftingCompass size={26}/></span>
        <span>mission<span className="brand-bottom">geo<span className="brand-dot">.</span></span></span>
      </a>
      <nav aria-label="Main navigation">
        <button className={`nav-link${view === 'base' ? ' active' : ''}`} onClick={() => setView('base')} aria-current={view === 'base' ? 'page' : undefined}><Radar size={18}/> My base</button>
        <button className={`nav-link${view === 'trophies' ? ' active' : ''}`} onClick={() => setView('trophies')} aria-current={view === 'trophies' ? 'page' : undefined}><Trophy size={18}/> My trophies <span className="nav-count">{stars}</span></button>
      </nav>
      <div className="header-right">
        <button className="icon-button" onClick={() => setSettings(true)} aria-label="Settings"><Settings2 size={20}/></button>
        <span className="header-divider"/>
        <span className="avatar">A</span><span className="profile-name">Alexandre</span>
      </div>
    </header>

    <main id="main">
      <section className="welcome">
        <div>
          <p className="greeting"><Rocket size={15}/> HI ALEXANDRE</p>
          <h1>Become a geometry commander<span className="heading-dot">.</span></h1>
          <p>Words, symbols and ten missions. Ready for lift-off?</p>
        </div>
        <div className="rank-card">
          <span className="rank-icon"><Medal size={24}/></span>
          <div className="rank-text">
            <strong>{rank.name} · {stars} ★</strong>
            <span>{rank.next ? `${rank.toNext} more ★ to become ${rank.next.name}` : 'Top rank reached, well done!'}</span>
            <div className="rank-bar" aria-hidden="true"><i style={{width: `${Math.round((stars / totalStars) * 100)}%`}}/></div>
          </div>
        </div>
      </section>
      {storageError && <p className="notice">This browser blocks saving: you can play, but your stars will not be kept.</p>}

      {view === 'trophies' ? <Trophies progress={progress} onPlay={setMissionId}/> : <>
        <section className="workspace" aria-label="Map and card">
          <div className="map-panel">
            <div className="panel-heading">
              <div><span className="eyebrow">Sector map</span><h2>My geometry map</h2></div>
              <span className="map-label"><span/> {notions.length} words to explore</span>
            </div>
            <div className="mind-map">
              <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="cyan-line" d="M50 50 Q36 30 24 24"/>
                <path className="orange-line" d="M50 50 Q64 30 76 24"/>
                <path className="violet-line" d="M50 50 Q64 70 76 76"/>
                <path className="lime-line" d="M50 50 Q36 70 24 76"/>
              </svg>
              <div className="map-center">
                <span className="radar" aria-hidden="true"/>
                <DraftingCompass size={34} className="center-icon"/>
                <strong>Geo Base</strong>
                <span>Command centre</span>
              </div>
              {sectors.map(s => <div key={s.id} className={`sector sector-${s.id} tone-${s.tone}`}>
                <div className="sector-heading"><span className="sector-led"/><h3>{s.title}</h3></div>
                <p>{s.sub}</p>
                <div className="chip-list">
                  {s.notions.map(id => {
                    const n = notionById[id];
                    const done = (progress.missions[n.mission]?.best || 0) > 0;
                    return <button key={id} className={`chip${selected === id ? ' selected' : ''}`} onClick={() => pickNotion(id)} aria-pressed={selected === id}>
                      <span className="chip-mini">{n.mini}</span>{n.chip}{done && <Check size={13} className="chip-done"/>}
                    </button>;
                  })}
                </div>
              </div>)}
            </div>
            <div className="map-steps">
              <span><b>1</b> Pick a word on the map</span><ChevronRight size={15}/>
              <span><b>2</b> Read the card</span><ChevronRight size={15}/>
              <span><b>3</b> Launch the mission</span>
            </div>
          </div>

          <aside className={`fiche tone-${toneOf(selected)}`} aria-live="polite">
            <div className="fiche-top"><span className="eyebrow">Info card</span><Sparkles size={18}/></div>
            <Figure figure={notion.figure} compact title={`Drawing: ${notion.name}`}/>
            <h3>{notion.name}</h3>
            <div className="symbol-box"><span className="symbol-label">Code</span><code>{notion.symbol}</code></div>
            <p className="symbol-text">{notion.symbolText}</p>
            <p className="definition">{notion.def}</p>
            <ul className="remember">{notion.remember.map(r => <li key={r}><Check size={15}/><span>{r}</span></li>)}</ul>
            <button className="primary wide" onClick={() => setMissionId(linked.id)}>Mission {linked.num}: {linked.title} <ArrowRight size={18}/></button>
            <p className="fiche-note">{linked.questions.length} questions · hints available · no timer</p>
          </aside>
        </section>

        <section className="missions-section" aria-labelledby="missions-title">
          <div className="section-heading">
            <div><span className="eyebrow">Your missions</span><h2 id="missions-title">Choose your mission</h2></div>
            <span className="section-note"><Lock size={14}/> Nothing is locked: start wherever you like</span>
          </div>
          <div className="mission-grid">
            {missions.map(m => {
              const best = progress.missions[m.id]?.best || 0;
              const tone = m.boss ? 'boss' : sectors.find(s => s.id === m.sector).tone;
              return <button key={m.id} className={`mission-card tone-${tone}`} onClick={() => setMissionId(m.id)}>
                <span className="mission-num">{String(m.num).padStart(2, '0')}</span>
                <span className="mission-icon"><MissionIcon name={m.icon} size={22}/></span>
                <strong>{m.title}</strong>
                <span className="mission-desc">{m.desc}</span>
                <span className="mission-meta">
                  <span className="mini-stars" aria-label={`${best} stars out of 3`}>{[1, 2, 3].map(n => <Star key={n} size={15} className={n <= best ? 'on' : ''}/>)}</span>
                  <span>{m.questions.length} questions</span>
                </span>
              </button>;
            })}
          </div>
        </section>
      </>}
      <footer className="footer">Mission Geo · 8P · geometry vocabulary and symbols · progress is saved only in this browser</footer>
    </main>

    {missionId && <Modal onClose={() => setMissionId(null)} wide>
      <Mission mission={missionById[missionId]} progress={progress} onClose={() => setMissionId(null)} onFinish={setProgress}/>
    </Modal>}

    {settings && <Modal onClose={() => setSettings(false)}>
      <Settings prefs={prefs} setPrefs={setPrefs} onReset={() => setProgress(emptyProgress())} onClose={() => setSettings(false)}/>
    </Modal>}
  </div>;
}

function Settings({prefs, setPrefs, onReset, onClose}) {
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return <div className="settings">
    <div className="mission-head">
      <div><span className="eyebrow">Settings</span><h2 id="dialog-title">Cockpit</h2></div>
      <button className="close-button" onClick={onClose} aria-label="Close"><X size={22}/></button>
    </div>
    <label className="setting-row">
      <span>{prefs.sound ? <Volume2 size={20}/> : <VolumeX size={20}/>}<span><strong>Sound effects</strong><small>Short sounds for right and wrong answers</small></span></span>
      <input type="checkbox" className="switch" checked={prefs.sound} onChange={e => setPrefs(p => ({...p, sound: e.target.checked}))}/>
    </label>
    <div className="setting-row">
      <span><Trash2 size={20}/><span><strong>Start from zero</strong><small>Deletes stars, XP and history in this browser</small></span></span>
      {done ? <span className="done-text">Deleted</span>
        : confirm ? <span className="confirm"><button className="ghost-button" onClick={() => setConfirm(false)}>Cancel</button><button className="danger" onClick={() => { onReset(); setDone(true); }}>Yes, delete</button></span>
        : <button className="ghost-button" onClick={() => setConfirm(true)}>Delete</button>}
    </div>
  </div>;
}
