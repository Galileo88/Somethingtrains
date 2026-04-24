# Stormrail Prototype

Vanilla HTML5/JS/CSS prototype for a dark Oregon Trail-style post-apocalyptic fantasy train survival game.

Entry point: `public/index.html`

Implemented:
- Single `requestAnimationFrame` loop in `src/main.js`
- Plain-object game state
- Flow: input → update → render
- Systems under `src/systems`
- Crew candidates under `src/entities`
- Mobile-first UI
- Pre-trip crew selection: choose 3 of 6
- Resource loop: fuel, food, water, parts, morale, cargo, engine
- Route progression from Atlanta to Seattle
- Travel events with crew modifiers
- Win/fail states

Design constraint:
- The storm is ambient setting only, not a character, stat, phase system, or escalating mechanic.

Not included:
- No dependencies
- No manifest or service worker changes
- No asset changes
- No `/dist` output
