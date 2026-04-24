# Somethingtrains Workspace

This repository now contains the `stormrail-prototype` vanilla JS game prototype.

## Quick start

From the repository root:

```bash
cd stormrail-prototype/public
python3 -m http.server 4173
```

Then open: <http://localhost:4173/index.html>

## Project shape

- `stormrail-prototype/public/index.html`: app shell and UI layout.
- `stormrail-prototype/src/main.js`: game loop, state machine, and input handling.
- `stormrail-prototype/src/systems/`: travel, event, and render systems.
- `stormrail-prototype/src/entities/crew.js`: crew roster and trait helpers.

## Suggested first tasks

1. Add explicit difficulty presets (Casual / Standard / Brutal).
2. Add deterministic seed support for repeatable runs.
3. Add a compact run summary screen with key end-state stats.
