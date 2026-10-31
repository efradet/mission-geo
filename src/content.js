// Mission Geo content (8P, geometry taught in English): vocabulary, symbols and ten missions.
import {intersect, add, mul, sub} from './geometry.js';

// ---------- Small helpers to describe the drawings ----------
const fig = (pts, items = [], opts = {}) => ({pts, items, ...opts});
const seg = (a, b, o = {}) => ({t: 'seg', a, b, ...o});
const line = (a, b, name, o = {}) => ({t: 'line', a, b, name, ...o});
const ray = (a, b, o = {}) => ({t: 'ray', a, b, ...o});
const right = (at, u, v) => ({t: 'right', at, u, v});
const dim = (a, b, text) => ({t: 'dim', a, b, text});
const along = (a, b, t) => add(a, mul(sub(b, a), t));

// ---------- Map sectors ----------
export const sectors = [
  {id: 'basics', title: 'The building blocks', sub: 'I recognise the objects', tone: 'cyan', notions: ['point', 'segment', 'line', 'half-line']},
  {id: 'crossings', title: 'Crossings', sub: 'When lines meet', tone: 'orange', notions: ['intersection', 'intersecting', 'concurrent']},
  {id: 'pairs', title: 'Line pairs', sub: 'Never, or at a right angle', tone: 'lime', notions: ['parallel', 'orthogonal']},
  {id: 'code', title: 'The secret code', sub: 'I write with symbols', tone: 'violet', notions: ['belongs', 'notation']}
];

// ---------- Vocabulary cards ----------
export const notions = [
  {
    id: 'point', chip: 'point', mini: 'A', name: 'The point', mission: 'scanner',
    def: 'A point marks an exact position. It has no length and no thickness.',
    symbol: 'A', symbolText: 'A point is named with a capital letter.',
    remember: ['We draw it with a small cross ×.', 'Examples of names: A, B, M, I.'],
    figure: fig({A: [160, 100]})
  },
  {
    id: 'segment', chip: 'segment', mini: '[AB]', name: 'The segment', mission: 'scanner',
    def: 'A segment is a piece of a line between two points, called its endpoints.',
    symbol: '[AB]', symbolText: 'The square brackets show that the segment stops at A and at B.',
    remember: ['It has a start and an end, so we can measure its length.', '[AB] is the segment. AB without brackets is its length: AB = 5 cm.'],
    figure: fig({A: [60, 140], B: [250, 60]}, [seg('A', 'B')], {labels: {A: 's', B: 's'}})
  },
  {
    id: 'line', chip: 'line', mini: '(AB)', name: 'The line', mission: 'scanner',
    def: 'A line is perfectly straight and never stops, in either direction.',
    symbol: '(AB)', symbolText: 'The round brackets show that it keeps going after A and after B. We can also call it (d).',
    remember: ['We only draw a piece of it: it is infinite, so it cannot be measured.', 'Through two different points, there is exactly one line.'],
    figure: fig({A: [110, 130], B: [210, 70]}, [line('A', 'B', 'd')])
  },
  {
    id: 'half-line', chip: 'half-line', mini: '[AB)', name: 'The half-line', mission: 'scanner',
    def: 'A half-line starts at a point, called its origin, and goes on forever in one direction only.',
    symbol: '[AB)', symbolText: 'The square bracket is on the side of the origin A, the round bracket on the side that keeps going.',
    remember: ['[AB) starts at A and goes through B.', '[BA) starts at B and goes through A: it is not the same half-line!', 'Some books call a half-line a ray.'],
    figure: fig({A: [70, 140], B: [170, 95]}, [ray('A', 'B')])
  },
  {
    id: 'intersection', chip: 'intersection', mini: 'I', name: 'The intersection point', mission: 'impact',
    def: 'The intersection point is where two lines cross. It belongs to both lines at the same time.',
    symbol: 'I ∈ (d) and I ∈ (e)', symbolText: 'I is on line d and on line e.',
    remember: ['Two intersecting lines have exactly one intersection point.', 'Bonus for later: you may see (d) ∩ (e) = {I}, read “d intersection e”.'],
    figure: fig({_1: [40, 160], _2: [280, 40], _3: [60, 30], _4: [260, 170], I: intersect([40, 160], [280, 40], [60, 30], [260, 170])},
      [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {labels: {I: 's'}})
  },
  {
    id: 'intersecting', chip: 'intersecting', mini: '×', name: 'Intersecting lines', mission: 'impact',
    def: 'Two intersecting lines cross each other at exactly one point.',
    symbol: 'd and e intersect', symbolText: 'There is no special symbol: we write it in words.',
    remember: ['Two lines that are not parallel always cross somewhere, even if it is off the drawing.', 'Orthogonal lines are special intersecting lines: they make a right angle.'],
    figure: fig({_1: [20, 130], _2: [300, 130], _3: [110, 190], _4: [200, 20]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')])
  },
  {
    id: 'concurrent', chip: 'concurrent', mini: '✳', name: 'Concurrent lines', mission: 'concurrency',
    def: 'Three (or more) lines are concurrent if they all go through the same point, called the point of concurrency.',
    symbol: 'K ∈ (d), K ∈ (e), K ∈ (f)', symbolText: 'The point of concurrency K is on every one of the lines.',
    remember: ['If the lines cross at several different points, they are not concurrent.', 'Parallel lines can never be concurrent.'],
    figure: fig({K: [160, 100], _1: [20, 58], _2: [300, 142], _3: [60, 200], _4: [260, 0], _5: [135, 0], _6: [185, 200]},
      [line('_1', '_2', 'd'), line('_3', '_4', 'e'), line('_5', '_6', 'f')], {labels: {K: 'e'}})
  },
  {
    id: 'parallel', chip: 'parallel', mini: '//', name: 'Parallel lines', mission: 'duel',
    def: 'Two parallel lines never cross: the distance between them always stays the same.',
    symbol: '(d) // (e)', symbolText: 'Read: “line d is parallel to line e”.',
    remember: ['Like the two rails of a railway track.', 'Two lines parallel to the same line are parallel to each other.'],
    figure: fig({_1: [20, 70], _2: [300, 40], _3: [20, 150], _4: [300, 120]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')])
  },
  {
    id: 'orthogonal', chip: 'orthogonal', mini: '⊥', name: 'Orthogonal lines', mission: 'duel',
    def: 'Two orthogonal lines cross each other at a right angle (90°). They are also called perpendicular.',
    symbol: '(d) ⊥ (e)', symbolText: 'Read: “line d is orthogonal (perpendicular) to line e”.',
    remember: ['Check the right angle with a set square.', 'On a drawing, a right angle is marked with a small square.'],
    figure: fig({O: [160, 110], _1: [60, 160], _2: [260, 60], _3: [120, 30], _4: [200, 190]},
      [line('_1', '_2', 'd'), line('_3', '_4', 'e'), right('O', '_2', '_4')], {hide: ['O']})
  },
  {
    id: 'belongs', chip: 'belongs to', mini: '∈', name: 'Belongs to: ∈ and ∉', mission: 'magnet',
    def: 'The symbol ∈ means “belongs to”, in other words “is on”. The symbol ∉ means “does not belong to”.',
    symbol: 'M ∈ (d)   N ∉ (d)', symbolText: 'M is on line d, N is not.',
    remember: ['Careful: a point can be on the line (AB) without being on the segment [AB].', 'The origin of a half-line belongs to it.'],
    figure: fig({_1: [20, 150], _2: [300, 70], M: along([20, 150], [300, 70], 0.4), N: [210, 160]}, [line('_1', '_2', 'd')], {labels: {M: 'n', N: 'e'}})
  },
  {
    id: 'notation', chip: 'notation', mini: '[ )', name: 'The bracket code', mission: 'decoder',
    def: 'Brackets tell you whether the line stops or keeps going: [ ] stops, ( ) keeps going.',
    symbol: '[AB]  (AB)  [AB)', symbolText: 'Segment, line, half-line with origin A.',
    remember: ['[ means “it stops here”.', '( means “it keeps going forever”.', 'AB with nothing around it is a length.'],
    figure: fig({A: [70, 100], B: [210, 100]}, [ray('A', 'B')])
  }
];

// ---------- The ten missions ----------

const SCAN = ['A point', 'A segment', 'A line', 'A half-line'];
const NOTE = ['[AB]', '(AB)', '[AB)', 'AB'];
const RAYS = ['[AB)', '[BA)', '(AB)', '[AB]'];
const POS = ['(d) // (e)', '(d) ⊥ (e)', 'd = e', '(d) ∈ (e)'];
const DUEL = ['Parallel //', 'Orthogonal ⊥', 'Intersecting, no right angle'];
const TF = ['True', 'False'];
const YN = ['Yes', 'No'];
const BELONG = ['∈', '∉'];
const BELONG_SUB = {'∈': 'belongs to', '∉': 'does not belong to'};

// Shared figures
const tri = {R: [90, 150], S: [240, 150], T: [165, 60], U: [190, 150]};
const triFig = fig(tri, [line('R', 'S', 'd'), line('S', 'T', 'e'), line('T', 'R', 'f')], {labels: {R: 's', S: 's', T: 'e', U: 's'}});

const memb = {A: [40, 140], B: [200, 80]};
const membPts = {...memb, C: along(memb.A, memb.B, 0.45), D: along(memb.A, memb.B, 1.4), E: [150, 40]};
const membLabels = {A: 's', B: 's', C: 's', D: 's', E: 'e'};
const rayPts = {A: [80, 130], B: [160, 100], F: along([80, 130], [160, 100], -0.6), G: along([80, 130], [160, 100], 2)};

const conc = {K: [140, 90], _d1: [20, 90], _d2: [300, 90], _e1: [50, 0], _e2: [250, 200], _f1: [185, 0], _f2: [85, 200], _g1: [40, 190], _g2: [300, 60]};
conc.L = intersect(conc._d1, conc._d2, conc._g1, conc._g2);
conc.M = intersect(conc._e1, conc._e2, conc._g1, conc._g2);
conc.N = intersect(conc._f1, conc._f2, conc._g1, conc._g2);

const Z = [180, 110];

export const missions = [
  {
    id: 'scanner', num: 1, title: 'The Scanner', icon: 'ScanLine', sector: 'basics',
    desc: 'Identify the object on the radar: point, segment, line or half-line.',
    questions: [
      {type: 'choice', prompt: 'The scanner has found an object. What is it called?', options: SCAN, answer: 'A segment',
        figure: fig({A: [70, 140], B: [250, 60]}, [seg('A', 'B')], {labels: {A: 's', B: 's'}}), verify: {kind: 'object', item: 0},
        hint: 'Look at both ends: does it stop?',
        explain: 'It stops at A and at B, its two endpoints: it is a segment.'},
      {type: 'choice', prompt: 'And this one?', options: SCAN, answer: 'A line',
        figure: fig({C: [110, 145], D: [220, 65]}, [line('C', 'D')], {labels: {C: 'se', D: 'se'}}), verify: {kind: 'object', item: 0},
        hint: 'Does it stop somewhere, or does it cross the whole screen?',
        explain: 'It crosses the whole screen and does not stop at C or D: it is a line, infinite in both directions.'},
      {type: 'choice', prompt: 'New object detected. What is it?', options: SCAN, answer: 'A half-line',
        figure: fig({E: [60, 110], F: [170, 110]}, [ray('E', 'F')], {labels: {E: 's', F: 's'}}), verify: {kind: 'object', item: 0},
        hint: 'Compare the two sides: does it behave the same on the left and on the right?',
        explain: 'It starts at point E (its origin) and goes on forever to the right: it is a half-line.'},
      {type: 'choice', prompt: 'The radar shows this. What is it?', options: SCAN, answer: 'A point',
        figure: fig({M: [160, 100]}), verify: {kind: 'object', item: null},
        hint: 'There is no line at all, just a small cross.',
        explain: 'A small cross with a capital letter: it is the point M. It just marks a position.'},
      {type: 'choice', prompt: 'Careful, this one is upside down. What is it called?', options: SCAN, answer: 'A half-line',
        figure: fig({G: [250, 150], H: [150, 70]}, [ray('G', 'H')], {labels: {G: 'e', H: 'e'}}), verify: {kind: 'object', item: 0},
        hint: 'First find the side where it stops.',
        explain: 'It stops at G and goes on forever on the other side, through H: it is the half-line [GH), with origin G.'},
      {type: 'choice', prompt: 'Vertical object detected. What is it?', options: SCAN, answer: 'A segment',
        figure: fig({K: [160, 40], L: [160, 165]}, [seg('K', 'L')], {labels: {K: 'e', L: 'e'}}), verify: {kind: 'object', item: 0},
        hint: 'Standing up or lying down, the rule is the same: look at the ends.',
        explain: 'It has two endpoints, K and L: it is the segment [KL], even though it is vertical.'},
      {type: 'choice', prompt: 'Pilot question: which of these can you measure with a ruler?', options: ['The segment', 'The line', 'The half-line', 'None of them'], answer: 'The segment',
        hint: 'To measure something, it needs a start and an end.',
        explain: 'Only the segment has a start and an end. A line and a half-line are infinite: they cannot be measured.'}
    ]
  },
  {
    id: 'decoder', num: 2, title: 'The Decoder', icon: 'KeyRound', sector: 'code',
    desc: 'Match each symbol with its meaning.',
    questions: [
      {type: 'match', prompt: 'Decode the brackets: match each code with its meaning.',
        pairs: [['[AB]', 'the segment AB'], ['(AB)', 'the line AB'], ['[AB)', 'the half-line that starts at A and goes through B'], ['AB', 'the length of the segment [AB]']],
        hint: '[ means “it stops”, ( means “it keeps going”. With no brackets at all, it is a measurement.',
        explain: '[AB] stops at both ends, (AB) keeps going at both ends, [AB) stops at A only. AB on its own is a length.'},
      {type: 'match', prompt: 'Decode the position symbols.',
        pairs: [['//', 'is parallel to'], ['⊥', 'is orthogonal to'], ['∈', 'belongs to'], ['∉', 'does not belong to']],
        hint: '⊥ looks like two lines making a right angle. // looks like two rails.',
        explain: '//: two strokes that never touch. ⊥: a right angle. ∈: “is on”. ∉: the same sign crossed out, “is not on”.'},
      {type: 'match', prompt: 'Last code: match each symbol sentence with its translation.',
        pairs: [['(AB) ⊥ (CD)', 'Lines AB and CD make a right angle.'], ['E ∈ [AB]', 'Point E is on segment AB.'], ['(d) // (e)', 'Lines d and e never cross.'], ['[BA)', 'The half-line that starts at B and goes through A.']],
        hint: 'Start with the symbol in the middle of each code.',
        explain: 'Well done: you can now read a sentence written in geometry code.'}
    ]
  },
  {
    id: 'right-code', num: 3, title: 'Crack the Code', icon: 'Binary', sector: 'code',
    desc: 'Find the code that matches the drawing.',
    questions: [
      {type: 'choice', prompt: 'Which code matches this drawing?', options: NOTE, answer: '[AB]',
        figure: fig({A: [70, 130], B: [240, 70]}, [seg('A', 'B')], {labels: {A: 's', B: 's'}}),
        hint: 'It stops at A and at B. Which sign means “it stops”?',
        explain: 'It is a segment: we write it with two square brackets, [AB].'},
      {type: 'choice', prompt: 'And for this drawing?', options: NOTE, answer: '(AB)',
        figure: fig({A: [100, 140], B: [220, 60]}, [line('A', 'B')], {labels: {A: 'se', B: 'se'}}),
        hint: 'It keeps going after A and after B.',
        explain: 'It is a line: we write it with two round brackets, (AB).'},
      {type: 'choice', prompt: 'Which code matches this half-line?', options: RAYS, answer: '[AB)',
        figure: fig({A: [60, 120], B: [170, 90]}, [ray('A', 'B')], {labels: {A: 's', B: 's'}}),
        hint: 'The square bracket goes on the side of the origin, where it stops.',
        explain: 'It stops at A and keeps going after B: it is [AB), with origin A.'},
      {type: 'choice', prompt: 'Trap ahead! Which code matches this drawing?', options: RAYS, answer: '[BA)',
        figure: fig({A: [130, 80], B: [250, 125]}, [ray('B', 'A')], {labels: {A: 'n', B: 's'}}),
        hint: 'Where does it stop: at A or at B? That letter comes first.',
        explain: 'It stops at B and keeps going after A. The origin B is written first, with the square bracket: [BA).'},
      {type: 'choice', prompt: 'This segment is 5 cm long. How do we write that?', options: ['CD = 5 cm', '[CD] = 5 cm', '(CD) = 5 cm', '[CD) = 5 cm'], answer: 'CD = 5 cm',
        figure: fig({C: [60, 120], D: [260, 120]}, [seg('C', 'D'), dim('C', 'D', '5 cm')], {labels: {C: 's', D: 's'}}),
        hint: 'A length is a number, not an object. Remove the brackets.',
        explain: 'For a length, we write the letters without brackets: CD = 5 cm. [CD] is the segment itself.'},
      {type: 'choice', prompt: 'Which code describes these two lines?', options: POS, answer: '(d) // (e)',
        figure: fig({_1: [20, 60], _2: [300, 100], _3: [20, 130], _4: [300, 170]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')]),
        verify: {kind: 'relation', lines: ['d', 'e'], expect: 'parallel'},
        hint: 'Will these lines ever cross?',
        explain: 'They always stay the same distance apart: they are parallel, (d) // (e).'},
      {type: 'choice', prompt: 'And for these two?', options: POS, answer: '(d) ⊥ (e)',
        figure: fig({O: [160, 100], _1: [20, 100], _2: [300, 100], _3: [160, 10], _4: [160, 190]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), right('O', '_2', '_3')], {hide: ['O']}),
        verify: {kind: 'relation', lines: ['d', 'e'], expect: 'perpendicular'},
        hint: 'Look at the small square where they cross.',
        explain: 'The small square shows a right angle: the lines are orthogonal, (d) ⊥ (e).'}
    ]
  },
  {
    id: 'true-false', num: 4, title: 'True or False?', icon: 'Zap', sector: 'basics',
    desc: 'Eight statements: spot the false ones.',
    questions: [
      {type: 'choice', keepOrder: true, prompt: 'A line has two endpoints.', options: TF, answer: 'False',
        hint: 'Does a line stop anywhere?',
        explain: 'False: a line is infinite in both directions, it has no endpoints. A segment has two.'},
      {type: 'choice', keepOrder: true, prompt: 'We can measure the length of a segment.', options: TF, answer: 'True',
        hint: 'Does a segment have a start and an end?',
        explain: 'True: it has two endpoints, so we can measure it with a ruler.'},
      {type: 'choice', keepOrder: true, prompt: 'The starting point of a half-line is called its origin.', options: TF, answer: 'True',
        hint: 'Think of the word “origin”: the point where everything starts.',
        explain: 'True: the half-line [AB) has the point A as its origin.'},
      {type: 'choice', keepOrder: true, prompt: '[AB) and [BA) are the same half-line.', options: TF, answer: 'False',
        hint: 'Where does each one start?',
        explain: 'False: [AB) goes from A towards B, [BA) goes from B towards A. They point in opposite directions.'},
      {type: 'choice', keepOrder: true, prompt: '[AB] and [BA] are the same segment.', options: TF, answer: 'True',
        hint: 'Does a segment point in a particular direction?',
        explain: 'True: in both cases the segment stops at A and at B. The order of the letters changes nothing.'},
      {type: 'choice', keepOrder: true, prompt: 'Through two different points, you can draw only one line.', options: TF, answer: 'True',
        hint: 'Imagine a ruler resting on two points.',
        explain: 'True: there is exactly one line through two given points.'},
      {type: 'choice', keepOrder: true, prompt: 'Two parallel lines end up crossing very, very far away.', options: TF, answer: 'False',
        hint: 'What always stays the same between two parallel lines?',
        explain: 'False: the distance between two parallel lines always stays the same. They never cross.'},
      {type: 'choice', keepOrder: true, prompt: 'Two orthogonal lines make a right angle.', options: TF, answer: 'True',
        hint: 'That is the definition you check with a set square.',
        explain: 'True: orthogonal (or perpendicular) means “crossing at a right angle (90°)”.'}
    ]
  },
  {
    id: 'duel', num: 5, title: 'Line Duel', icon: 'Swords', sector: 'pairs',
    desc: 'Parallel, orthogonal or just intersecting?',
    questions: [
      {type: 'choice', keepOrder: true, prompt: 'These two lines are…', options: DUEL, answer: 'Parallel //',
        figure: fig({_1: [20, 60], _2: [300, 60], _3: [20, 140], _4: [300, 140]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {grid: true}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'Count the squares between the two lines, on the left and then on the right.',
        explain: 'The gap stays 4 squares everywhere: they are parallel.'},
      {type: 'choice', keepOrder: true, prompt: 'And these tilted ones?', options: DUEL, answer: 'Parallel //',
        figure: fig({_1: [40, 40], _2: [280, 120], _3: [40, 100], _4: [280, 180]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {grid: true}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'On the grid: for every 3 squares to the right, how far down does each line go?',
        explain: 'Both go down 1 square for every 3 squares across: same slope, so they are parallel.'},
      {type: 'choice', keepOrder: true, prompt: 'These two lines are…', options: DUEL, answer: 'Orthogonal ⊥',
        figure: fig({O: [160, 100], _1: [20, 100], _2: [300, 100], _3: [160, 10], _4: [160, 190]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), right('O', '_2', '_3')], {grid: true, hide: ['O']}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'The small square is a signal.',
        explain: 'The small square marks a right angle: they are orthogonal.'},
      {type: 'choice', keepOrder: true, prompt: 'What if we tilt them?', options: DUEL, answer: 'Orthogonal ⊥',
        figure: fig({O: [160, 110], _1: [60, 160], _2: [260, 60], _3: [120, 30], _4: [200, 190]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), right('O', '_2', '_4')], {grid: true, hide: ['O']}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'A right angle is still a right angle when you turn it.',
        explain: 'The right angle is marked even though neither line is horizontal: they are orthogonal.'},
      {type: 'choice', keepOrder: true, prompt: 'These two lines are…', options: DUEL, answer: 'Intersecting, no right angle',
        figure: fig({_1: [20, 130], _2: [300, 130], _3: [120, 180], _4: [200, 40]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {grid: true}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'They cross. But is the angle a right angle?',
        explain: 'They cross, but not at a right angle: they are intersecting, not orthogonal.'},
      {type: 'choice', keepOrder: true, prompt: 'Watch out, trap: these two lines are…', options: DUEL, answer: 'Intersecting, no right angle',
        figure: fig({_1: [20, 50], _2: [300, 80], _3: [20, 150], _4: [300, 115]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {grid: true}),
        verify: {kind: 'duel', lines: ['d', 'e']},
        hint: 'Compare the gap on the left and on the right of the drawing.',
        explain: 'The gap gets smaller: if we extend them, they will cross. They are intersecting, even though the crossing is off the drawing.'},
      {type: 'choice', keepOrder: true, prompt: 'Strategy question: are two orthogonal lines also intersecting?', options: YN, answer: 'Yes',
        hint: 'Intersecting means “crossing each other”.',
        explain: 'Yes: they cross at one point, so they are intersecting. On top of that, they make a right angle.'}
    ]
  },
  {
    id: 'impact', num: 6, title: 'Impact Point', icon: 'Crosshair', sector: 'crossings',
    desc: 'Find the intersection points on the map.',
    questions: [
      {type: 'pick', prompt: 'Click on the intersection point of lines d and e.', figure: triFig, candidates: ['R', 'S', 'T', 'U'], answer: 'S',
        verify: {kind: 'intersection', lines: ['d', 'e']},
        hint: 'Follow line d with your finger, then line e. Where do they meet?',
        explain: 'S is on d and on e at the same time: it is their intersection point.'},
      {type: 'pick', prompt: 'Now the intersection point of lines e and f.', figure: triFig, candidates: ['R', 'S', 'T', 'U'], answer: 'T',
        verify: {kind: 'intersection', lines: ['e', 'f']},
        hint: 'Find the colour of e and the colour of f.',
        explain: 'T is on e and on f: it is their intersection point.'},
      {type: 'choice', prompt: 'In this drawing, how many intersection points are there between the lines?', options: ['2', '3', '4', '6'], answer: '3', figure: triFig,
        verify: {kind: 'count'},
        hint: 'Is point U on two lines, or on only one?',
        explain: 'R, S and T are crossings. U is only on line d: it is not an intersection.'},
      {type: 'choice', keepOrder: true, prompt: 'Do the segment [AB] and the line d have an intersection point?', options: YN, answer: 'No',
        figure: fig({A: [60, 150], B: [150, 100], _1: [234, 10], _2: [256, 190]}, [seg('A', 'B'), line('_1', '_2', 'd')], {labels: {A: 's', B: 's'}}),
        verify: {kind: 'segHits', seg: 0, line: 'd'},
        hint: 'The segment stops at B. Does it really touch line d?',
        explain: 'No: the segment stops at B, before it reaches line d. The line (AB) would cross d, but the segment does not.'},
      {type: 'choice', prompt: 'Lines d and e are parallel. How many intersection points can you see?', options: ['0', '1', '2', '3'], answer: '2',
        figure: fig({_1: [20, 60], _2: [300, 60], _3: [20, 140], _4: [300, 140], _5: [80, 190], _6: [240, 10]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), line('_5', '_6', 'f')]),
        verify: {kind: 'count'},
        hint: 'd and e never cross. But what about f?',
        explain: 'd and e are parallel, so they do not cross each other. f crosses d and crosses e: that makes 2 points.'},
      {type: 'pick', prompt: 'Click on the intersection point of the half-line [AB) and the line d.',
        figure: fig({A: [40, 160], B: [120, 120], P: [200, 80], M: [215, 140], _1: [185, 20], _2: [225, 180]}, [ray('A', 'B'), line('_1', '_2', 'd')], {labels: {A: 's', B: 's', P: 'w', M: 'e'}}),
        candidates: ['A', 'B', 'P', 'M'], answer: 'P', verify: {kind: 'intersection', items: [0, 1]},
        hint: 'The point you want must be on the half-line AND on the line.',
        explain: 'P is on the half-line [AB) and on line d. M is only on d, B only on the half-line.'}
    ]
  },
  {
    id: 'concurrency', num: 7, title: 'Operation Concurrent', icon: 'Waypoints', sector: 'crossings',
    desc: 'Find concurrent lines and their point of concurrency.',
    questions: [
      {type: 'choice', keepOrder: true, prompt: 'Are these three lines concurrent?', options: YN, answer: 'Yes',
        figure: fig({_1: [20, 58], _2: [300, 142], _3: [60, 200], _4: [260, 0], _5: [135, 0], _6: [185, 200]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), line('_5', '_6', 'f')]),
        verify: {kind: 'concur', lines: ['d', 'e', 'f']},
        hint: 'Do they all go through the same point?',
        explain: 'Yes: all three lines go through the same point. They are concurrent.'},
      {type: 'choice', keepOrder: true, prompt: 'Look closely. Are these three lines concurrent?', options: YN, answer: 'No',
        figure: fig({_1: [20, 58], _2: [300, 142], _3: [84, 200], _4: [284, 0], _5: [135, 0], _6: [185, 200]}, [line('_1', '_2', 'd'), line('_3', '_4', 'e'), line('_5', '_6', 'f')]),
        verify: {kind: 'concur', lines: ['d', 'e', 'f']},
        hint: 'Zoom in on the middle: is there one crossing, or a tiny triangle?',
        explain: 'No: they cross in pairs at three different points, which make a tiny triangle. They are not concurrent.'},
      {type: 'pick', prompt: 'd, e and f are concurrent. Click on their point of concurrency.',
        figure: fig(conc, [line('_d1', '_d2', 'd'), line('_e1', '_e2', 'e'), line('_f1', '_f2', 'f'), line('_g1', '_g2', 'g')], {labels: {K: 'n', L: 'n', M: 's', N: 'e'}}),
        candidates: ['K', 'L', 'M', 'N'], answer: 'K', verify: {kind: 'intersection', lines: ['d', 'e', 'f']},
        hint: 'The point of concurrency is on d, on e and on f at the same time.',
        explain: 'K is on all three lines d, e and f: it is their point of concurrency. L, M and N are only crossings with g.'},
      {type: 'choice', prompt: 'Of these four lines, which three are concurrent?', options: ['d, e and f', 'd, e and g', 'e, f and g', 'd, f and g'], answer: 'e, f and g',
        figure: fig({Z, _e1: [20, 78], _e2: [300, 134], _f2: [230, 50], _g2: [150, 10], _d1: [20, 150], _d2: [300, 10]},
          [line('_e1', '_e2', 'e'), line('_f2', 'Z', 'f'), line('Z', '_g2', 'g'), line('_d2', '_d1', 'd')], {hide: ['Z']}),
        verify: {kind: 'concurChoice'},
        hint: 'Find the point where the most lines cross. Which line misses it?',
        explain: 'e, f and g go through the same point. Line d passes next to it, so it is not part of the group.'},
      {type: 'choice', keepOrder: true, prompt: 'Can three parallel lines be concurrent?', options: YN, answer: 'No',
        hint: 'Do parallel lines have a point in common?',
        explain: 'No: parallel lines never cross, so they cannot all go through the same point.'},
      {type: 'choice', prompt: 'What do we call the point shared by concurrent lines?', options: ['the point of concurrency', 'the origin', 'the endpoint', 'the midpoint'], answer: 'the point of concurrency',
        hint: 'The word looks like “concurrent”.',
        explain: 'It is the point of concurrency. The origin belongs to a half-line, and endpoints to a segment.'}
    ]
  },
  {
    id: 'magnet', num: 8, title: 'The ∈ Magnet', icon: 'Magnet', sector: 'code',
    desc: 'Is the point on the object? Choose ∈ or ∉.',
    questions: [
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['C', '[AB]'], prompt: 'Fill in the right symbol.', options: BELONG, answer: '∈',
        figure: fig(membPts, [seg('A', 'B')], {labels: membLabels}), verify: {kind: 'member', point: 'C', item: 0},
        hint: 'Does point C touch the segment that is drawn?',
        explain: 'C is on the segment, between A and B: C ∈ [AB].'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['E', '[AB]'], prompt: 'Fill in the right symbol.', options: BELONG, answer: '∉',
        figure: fig(membPts, [seg('A', 'B')], {labels: membLabels}), verify: {kind: 'member', point: 'E', item: 0},
        hint: 'Is E sitting on the segment?',
        explain: 'E is above, far from the segment: E ∉ [AB].'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['D', '[AB]'], prompt: 'Trap! Fill in the right symbol.', options: BELONG, answer: '∉',
        figure: fig(membPts, [seg('A', 'B')], {labels: membLabels}), verify: {kind: 'member', point: 'D', item: 0},
        hint: 'D is lined up with A and B. But does the segment go as far as D?',
        explain: 'D is lined up with A and B, but the segment stops at B: D ∉ [AB].'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['D', '(AB)'], prompt: 'And now with the line?', options: BELONG, answer: '∈',
        figure: fig(membPts, [line('A', 'B')], {labels: membLabels}), verify: {kind: 'member', point: 'D', item: 0},
        hint: 'Does a line stop at B?',
        explain: 'The line (AB) keeps going after B, so it goes through D: D ∈ (AB).'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['F', '[AB)'], prompt: 'Fill in the right symbol.', options: BELONG, answer: '∉',
        figure: fig(rayPts, [ray('A', 'B')], {labels: {A: 's', B: 's', F: 's', G: 's'}}), verify: {kind: 'member', point: 'F', item: 0},
        hint: 'The half-line goes from A towards B. Which side is F on?',
        explain: 'F is behind the origin A. The half-line does not go that way: F ∉ [AB).'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['G', '[AB)'], prompt: 'Fill in the right symbol.', options: BELONG, answer: '∈',
        figure: fig(rayPts, [ray('A', 'B')], {labels: {A: 's', B: 's', F: 's', G: 's'}}), verify: {kind: 'member', point: 'G', item: 0},
        hint: 'After B, does the half-line stop?',
        explain: 'The half-line keeps going forever after B, so it goes through G: G ∈ [AB).'},
      {type: 'choice', keepOrder: true, subs: BELONG_SUB, code: ['A', '[AB)'], prompt: 'What about the origin itself?', options: BELONG, answer: '∈',
        figure: fig(rayPts, [ray('A', 'B')], {labels: {A: 's', B: 's', F: 's', G: 's'}}), verify: {kind: 'member', point: 'A', item: 0},
        hint: 'The square bracket [ means the half-line starts exactly at A.',
        explain: 'The origin is part of the half-line: A ∈ [AB).'},
      {type: 'choice', prompt: 'I is the intersection point of d and e. Which code is correct?', options: ['I ∈ (d) and I ∈ (e)', 'I ∈ (d) and I ∉ (e)', 'I ∉ (d) and I ∉ (e)', 'I ∉ (d) and I ∈ (e)'], answer: 'I ∈ (d) and I ∈ (e)',
        figure: fig({_1: [40, 160], _2: [280, 40], _3: [60, 30], _4: [260, 170], I: intersect([40, 160], [280, 40], [60, 30], [260, 170])}, [line('_1', '_2', 'd'), line('_3', '_4', 'e')], {labels: {I: 's'}}),
        hint: 'How many lines is an intersection point on?',
        explain: 'The intersection point is on both lines at the same time: I ∈ (d) and I ∈ (e).'}
    ]
  },
  {
    id: 'translator', num: 9, title: 'The Translator', icon: 'Languages', sector: 'code',
    desc: 'Turn sentences into geometry code.',
    questions: [
      {type: 'build', prompt: 'Translate into code:', sentence: 'the segment with endpoints A and B', tiles: ['[', ']', '(', ')', 'A', 'B'],
        accept: [['[', 'A', 'B', ']'], ['[', 'B', 'A', ']']],
        hint: 'A segment stops at both ends: which sign do you need on each side?',
        explain: 'We write [AB] (or [BA], it is the same segment).'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'the line through C and D', tiles: ['[', ']', '(', ')', 'C', 'D'],
        accept: [['(', 'C', 'D', ')'], ['(', 'D', 'C', ')']],
        hint: 'A line keeps going at both ends.',
        explain: 'We write (CD) or (DC): it is the same line.'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'the half-line with origin E going through F', tiles: ['[', ']', '(', ')', 'E', 'F'],
        accept: [['[', 'E', 'F', ')']],
        hint: 'The origin comes first, with the square bracket.',
        explain: 'We write [EF): square bracket on the side of the origin E, round bracket on the side that keeps going.'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'line d is parallel to line e', tiles: ['(d)', '(e)', '//', '⊥', '∈'],
        accept: [['(d)', '//', '(e)'], ['(e)', '//', '(d)']],
        hint: 'The parallel symbol looks like two rails.',
        explain: 'We write (d) // (e).'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'lines (AB) and (CD) are orthogonal', tiles: ['(AB)', '[AB]', '(CD)', '[CD]', '⊥', '//'],
        accept: [['(AB)', '⊥', '(CD)'], ['(CD)', '⊥', '(AB)']],
        hint: 'Careful: we are talking about lines, not segments.',
        explain: 'We write (AB) ⊥ (CD), with round brackets because they are lines.'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'point M belongs to segment [AB]', tiles: ['M', '∈', '∉', '[AB]', '(AB)', '[AB)'],
        accept: [['M', '∈', '[AB]']],
        hint: 'The point first, then the symbol, then the object.',
        explain: 'We write M ∈ [AB].'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'point K does not belong to line d', tiles: ['K', '∈', '∉', '(d)', '[d]', '//'],
        accept: [['K', '∉', '(d)']],
        hint: 'The “belongs to” symbol crossed out means “does not belong to”.',
        explain: 'We write K ∉ (d).'},
      {type: 'build', prompt: 'Translate into code:', sentence: 'segment [RS] is 7 cm long', tiles: ['RS', '[RS]', '(RS)', '=', '7 cm'],
        accept: [['RS', '=', '7 cm']],
        hint: 'A length is written without brackets.',
        explain: 'We write RS = 7 cm: the letters without brackets stand for the length.'}
    ]
  },
  {
    id: 'boss', num: 10, title: 'Final Boss', icon: 'Brain', sector: 'boss', boss: true,
    desc: 'The geometer’s riddles: think and build.',
    questions: [
      {type: 'choice', prompt: 'How many different lines go through both points A and B?', options: ['0', '1', '2', 'infinitely many'], answer: '1',
        figure: fig({A: [100, 120], B: [220, 80]}),
        hint: 'Put your ruler on A and B: can you move it without leaving one of the points?',
        explain: 'Only one: through two different points there is exactly one line, the line (AB).'},
      {type: 'choice', prompt: 'And through a single point A, how many lines can you draw?', options: ['0', '1', '2', 'infinitely many'], answer: 'infinitely many',
        figure: fig({A: [160, 100]}),
        hint: 'Imagine your ruler spinning around A.',
        explain: 'Infinitely many: the ruler can turn around A in every direction.'},
      {type: 'grid', prompt: 'Click on a grid point to place M so that (AM) is parallel to d.',
        figure: fig({_1: [40, 160], _2: [120, 120], A: [160, 160]}, [line('_1', '_2', 'd')], {grid: true, labels: {A: 's'}}),
        from: 'A', rule: {kind: 'parallel', line: 'd'},
        hint: 'On d: 2 squares right, 1 square up. Make the same move starting from A.',
        explain: 'From A, following the same slope as d (2 squares right, 1 up), the line (AM) never crosses d.'},
      {type: 'grid', prompt: 'Place M so that (AM) is orthogonal to d.',
        figure: fig({_1: [60, 40], _2: [180, 100], A: [220, 60]}, [line('_1', '_2', 'd')], {grid: true, labels: {A: 'e'}}),
        from: 'A', rule: {kind: 'perpendicular', line: 'd'},
        hint: 'd goes 2 squares right for 1 square down. For a right angle, swap them: 1 square sideways for 2 squares up or down.',
        explain: 'Turning the move of d by a quarter turn (2 and 1 become 1 and 2) gives an orthogonal direction.'},
      {type: 'choice', prompt: '(d) ⊥ (e) and (f) ⊥ (e). What can you say about lines d and f?', options: ['(d) // (f)', '(d) ⊥ (f)', 'They are concurrent', 'Nothing can be said'], answer: '(d) // (f)',
        figure: fig({_e1: [20, 100], _e2: [300, 100], _d1: [100, 10], _d2: [100, 190], _f1: [220, 10], _f2: [220, 190], O1: [100, 100], O2: [220, 100]},
          [line('_e1', '_e2', 'e'), line('_d1', '_d2', 'd'), line('_f1', '_f2', 'f'), right('O1', '_e2', '_d1'), right('O2', '_e2', '_f1')], {hide: ['O1', 'O2']}),
        hint: 'Look at the drawing: will d and f ever cross?',
        explain: 'Two lines orthogonal to the same line are parallel to each other: (d) // (f).'},
      {type: 'choice', prompt: '(d) // (e) and (e) // (f). What can you say about lines d and f?', options: ['(d) // (f)', '(d) ⊥ (f)', 'They intersect', 'Nothing can be said'], answer: '(d) // (f)',
        hint: 'Three rails side by side...',
        explain: 'Two lines parallel to the same line are parallel to each other: (d) // (f).'},
      {type: 'choice', prompt: '(d) // (f) and (e) ⊥ (d). What can you say about e and f?', options: ['(e) ⊥ (f)', '(e) // (f)', 'e and f never cross', 'Nothing can be said'], answer: '(e) ⊥ (f)',
        hint: 'Draw two rails d and f, then a sleeper e at a right angle to d.',
        explain: 'If a line is orthogonal to one of two parallel lines, it is also orthogonal to the other: (e) ⊥ (f).'},
      {type: 'choice', prompt: 'Last riddle: at most, how many intersection points can three lines have?', options: ['1', '2', '3', '6'], answer: '3',
        hint: 'Count the possible pairs: d and e, d and f, e and f.',
        explain: 'There are three pairs of lines (d and e, d and f, e and f). Each pair crosses at most once: 3 points at most.'}
    ]
  }
];

export const missionById = Object.fromEntries(missions.map(m => [m.id, m]));
export const notionById = Object.fromEntries(notions.map(n => [n.id, n]));
export const totalStars = missions.length * 3;
