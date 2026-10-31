import React, {useEffect, useMemo, useRef, useState} from 'react';
import {X, Lightbulb, ArrowRight, Flame, CheckCircle2, AlertTriangle, Star, RotateCcw, Home, Zap, Medal} from 'lucide-react';
import {prepareQuestion, recordMission, rankFor, starCount} from './engine.js';
import {ChoiceQuestion, MatchQuestion, PickQuestion, BuildQuestion, GridQuestion} from './Questions.jsx';
import {sfx} from './sound.js';

const views = {choice: ChoiceQuestion, match: MatchQuestion, pick: PickQuestion, build: BuildQuestion, grid: GridQuestion};
const cheers = ['Well spotted!', 'Correct!', 'Bullseye!', 'Perfect!', 'Right answer!', 'Nailed it!'];
const retries = ['Not yet: try something else.', 'Close! Look at the drawing again.', 'Missed, but you can try again.', 'A mistake is just training!'];

export default function Mission({mission, progress, onClose, onFinish}) {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [streak, setStreak] = useState(0);
  const [summary, setSummary] = useState(null);
  const [run, setRun] = useState(0);
  const nextRef = useRef(null);
  const questions = useMemo(() => mission.questions.map(q => prepareQuestion(q)), [mission, run]);
  const q = questions[index];
  const View = views[q.type];
  const last = index === questions.length - 1;

  useEffect(() => { if (solved) nextRef.current?.focus(); }, [solved]);

  const onTry = (ok, partial = false) => {
    if (solved) return;
    if (ok && partial) { sfx.click(); setFeedback({kind: 'good', text: 'Pair found!'}); return; }
    if (ok) {
      sfx.good();
      const firstTry = attempts === 0 && !hint;
      setResults(r => [...r, {firstTry, hint, attempts}]);
      setStreak(s => (firstTry ? s + 1 : 0));
      setSolved(true);
      setFeedback({kind: 'good', text: cheers[(index + attempts) % cheers.length]});
    } else {
      sfx.bad();
      setAttempts(a => a + 1);
      setStreak(0);
      setFeedback({kind: 'bad', text: retries[attempts % retries.length]});
      if (attempts >= 1) setHint(true);
    }
  };

  const next = () => {
    if (!last) {
      setIndex(i => i + 1);
      setAttempts(0); setHint(false); setSolved(false); setFeedback(null);
      return;
    }
    const before = rankFor(starCount(progress));
    const outcome = recordMission(progress, mission.id, results);
    const after = rankFor(starCount(outcome.progress));
    sfx.win();
    setSummary({...outcome, rankUp: after.index > before.index ? after : null, rank: after});
    onFinish(outcome.progress);
  };

  const replay = () => {
    setSummary(null); setIndex(0); setAttempts(0); setHint(false); setSolved(false);
    setFeedback(null); setResults([]); setStreak(0); setRun(r => r + 1);
  };

  if (summary) return <MissionSummary mission={mission} summary={summary} onReplay={replay} onClose={onClose}/>;

  return <div className={`mission tone-${mission.sector}`}>
    <div className="mission-head">
      <div>
        <span className="eyebrow">Mission {mission.num}{mission.boss ? ' · Final boss' : ''}</span>
        <h2 id="dialog-title">{mission.title}</h2>
      </div>
      <button className="close-button" onClick={onClose} aria-label="Leave the mission"><X size={22}/></button>
    </div>
    <div className="progress-row">
      <span>Question {index + 1} of {questions.length}</span>
      <div className="dots" aria-hidden="true">
        {questions.map((_, i) => <span key={i} className={i < index || (i === index && solved) ? (results[i]?.firstTry ? 'done perfect' : 'done') : i === index ? 'current' : ''}/>)}
      </div>
      <span className={`streak${streak >= 2 ? ' hot' : ''}`}>{streak >= 2 ? <><Flame size={16}/> Streak ×{streak}</> : 'No timer'}</span>
    </div>
    <h3 className="prompt">{q.prompt}</h3>
    <div className="question-body">
      <View key={`${run}-${index}`} q={q} solved={solved} onTry={onTry}/>
    </div>
    {feedback && <div className={`feedback ${feedback.kind}`} role="status">
      {feedback.kind === 'good' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
      <div>
        <strong>{feedback.text}</strong>
        {solved && <p>{q.explain}</p>}
      </div>
    </div>}
    {hint && !solved && <div className="hint-box"><Lightbulb size={18}/><p>{q.hint}</p></div>}
    <div className="mission-foot">
      {!solved
        ? <button className="hint-button" onClick={() => setHint(true)} disabled={hint}><Lightbulb size={17}/> {hint ? 'Hint shown' : 'Get a hint'}</button>
        : <span className="foot-note">{results[index]?.firstTry ? '+10 XP · first try' : '+4 XP · found by not giving up'}</span>}
      {solved
        ? <button ref={nextRef} className="primary" onClick={next}>{last ? 'Finish the mission' : 'Next question'} <ArrowRight size={18}/></button>
        : <span className="foot-note"><RotateCcw size={14}/> You can try again</span>}
    </div>
  </div>;
}

function MissionSummary({mission, summary, onReplay, onClose}) {
  const {stars, xp, firstTry, total, improved, rankUp, rank} = summary;
  const title = stars === 3 ? 'Perfect mission!' : stars === 2 ? 'Mission accomplished!' : 'Mission complete!';
  return <div className="summary">
    <div className="burst" aria-hidden="true">{Array.from({length: 14}, (_, i) => <i key={i} style={{'--i': i}}/>)}</div>
    <span className="eyebrow">Mission {mission.num} · {mission.title}</span>
    <h2 id="dialog-title">{title}</h2>
    <div className="big-stars" aria-label={`${stars} stars out of 3`}>
      {[1, 2, 3].map(n => <Star key={n} size={54} className={n <= stars ? 'on' : ''} style={{'--d': `${n * 0.18}s`}}/>)}
    </div>
    <div className="summary-stats">
      <div><strong>{firstTry}/{total}</strong><span>first try</span></div>
      <div><strong><Zap size={18}/> +{xp}</strong><span>experience points</span></div>
    </div>
    {rankUp && <div className="rank-up"><Medal size={26}/><div><strong>Promoted: {rankUp.name}!</strong><span>{rankUp.motto}</span></div></div>}
    {!rankUp && improved && <p className="summary-note">New record for this mission!</p>}
    {!rankUp && !improved && stars < 3 && <p className="summary-note">Play again to go for 3 stars. {rank.next ? `${rank.toNext} more ★ to become ${rank.next.name}.` : ''}</p>}
    <div className="summary-actions">
      <button className="ghost-button" onClick={onReplay}><RotateCcw size={17}/> Play again</button>
      <button className="primary" onClick={onClose} autoFocus><Home size={17}/> Back to base</button>
    </div>
  </div>;
}
