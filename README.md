# Mission Geo

A React + Vite app for Alexandre (8P), whose geometry lessons are taught in English. The topic is basic geometry vocabulary and symbols. The design follows the same structure as Elisabeth's *Jardin des sons*: a header, a mind map, an info card on the right, missions in a pop-up window and rewards. The theme is a space base, aimed at an 11-year-old boy.

## What it teaches

**Vocabulary:** point, segment, line, half-line (also called a ray), intersection point, intersecting lines, concurrent lines (point of concurrency), parallel lines, orthogonal lines (also called perpendicular).

**Symbols:**

| Code | Read as |
|---|---|
| `A` | point A (a capital letter, drawn with a cross ×) |
| `[AB]` | the segment AB |
| `AB` | the length of segment [AB], for example AB = 5 cm |
| `(AB)` or `(d)` | the line AB, the line d |
| `[AB)` | the half-line with origin A going through B |
| `(d) // (e)` | d is parallel to e |
| `(d) ⊥ (e)` | d is orthogonal (perpendicular) to e |
| `M ∈ (d)` / `N ∉ (d)` | M belongs to d / N does not belong to d |
| `(d) ∩ (e) = {I}` | bonus, only mentioned on the "intersection" card |

The brackets notation ([AB], (AB), [AB)) matches Alexandre's class. To change the wording or the notation, edit `src/content.js`.

## The 10 missions

1. **The Scanner:** recognise a point, segment, line or half-line in a drawing (7 questions).
2. **The Decoder:** match symbols with their meaning, in three rounds (3 sets of 4 pairs).
3. **Crack the Code:** pick the code that matches the drawing, including the [AB) / [BA) trap (7).
4. **True or False?:** eight vocabulary statements (8).
5. **Line Duel:** parallel, orthogonal or just intersecting, on a grid (7).
6. **Impact Point:** click on intersection points, count crossings (6).
7. **Operation Concurrent:** concurrent lines and the point of concurrency (6).
8. **The ∈ Magnet:** fill in ∈ or ∉, with segment / line / half-line traps (8).
9. **The Translator:** write a sentence in code with tiles (8).
10. **Final Boss:** reasoning riddles and two constructions on a grid (8).

Every question has a hint, an explanation after the right answer and unlimited tries. There is no timer. Stars (1 to 3) depend on the answers found on the first try without a hint. Stars raise the rank: Recruit, Cadet, Pilot, Navigator, Captain, Geo Commander. The map shows each word with an info card (drawing, code, definition, key points).

## Run it

Windows: double-click `START-MISSION.cmd` (Node.js 20.19+ or 22.12+).

```sh
npm install
npm run dev      # http://localhost:5184
```

`npm run build` creates `dist`. The site uses relative paths, so it works locally and on GitHub Pages.

## Publish on GitHub Pages

`.github/workflows/deploy.yml` tests, builds and publishes the site on every push to `main`. Once, in the GitHub repo: **Settings > Pages > Source: GitHub Actions**. The game is then available at `https://efradet.github.io/mission-geo/`.

## Checks

`npm test` recomputes the geometry of every drawing to check the answers: parallel or orthogonal lines, intersection points, concurrent lines, whether a point is on a segment, line or half-line, and the grid constructions. It also checks the translator tiles, the decoder pairs, saving and stars.

## Data

Stars, XP and the last 100 missions are stored in the browser (localStorage), with no account and nothing sent anywhere. Each browser keeps its own save. Sound effects are synthesised (no files, no voice) and can be turned off in the settings. Fonts (Chakra Petch, DM Sans, JetBrains Mono, OFL licence) are bundled through Fontsource, so nothing is loaded from the internet.

Files: content `src/content.js`, geometry `src/geometry.js`, engine `src/engine.js`, drawings `src/Figure.jsx`, question types `src/Questions.jsx`, mission flow `src/Mission.jsx`, home page `src/App.jsx`, theme `src/styles.css`.
