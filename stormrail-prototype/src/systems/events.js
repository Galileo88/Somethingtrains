const EVENT_COUNT = 8;

export function resolveEvent(state, setMessage, clampStats, hasCrew) {
  const marker = (state.distance * 10) | 0;

  if (marker % 37 !== 0 || marker === state.lastMarker) {
    return;
  }

  state.lastMarker = marker;
  const eventId = (marker + state.leg * 3 + (state.day | 0)) % EVENT_COUNT;

  if (eventId === 0) {
    const save = hasCrew(state, 'nell') ? 4 : 0;
    state.parts -= Math.max(1, 3 - save);
    state.engine -= Math.max(1, 5 - save);
    setMessage('Track rupture', 'A rail has twisted under pressure and age. The crew plates it fast and prays the next axle holds.', 'Push harder', 'Conserve');
  } else if (eventId === 1) {
    const save = hasCrew(state, 'vale') ? 5 : 0;
    state.food -= Math.max(1, 8 - save);
    state.morale -= 3;
    setMessage('Contaminated stores', 'A gray bloom spreads through one crate of meal. The quartermaster orders it burned.', 'Push harder', 'Conserve');
  } else if (eventId === 2) {
    state.cargo -= 4;
    state.morale += hasCrew(state, 'oren') ? 1 : 3;
    setMessage('Lanterns outside', 'Human lights move beside the train. The captain orders no stop, but a cargo crate is thrown out as a decoy.', 'Push harder', 'Conserve');
  } else if (eventId === 3) {
    state.water += 8;
    state.day += 1;
    setMessage('Clean cistern', 'A forgotten tank beside the line gives the crew and boiler a rare clean refill. It costs a day to pump.', 'Push harder', 'Conserve');
  } else if (eventId === 4) {
    const save = hasCrew(state, 'vale') ? 3 : 0;
    state.morale -= Math.max(1, 6 - save);
    state.day += 1;
    setMessage('Sick watchman', 'A crewman wakes shaking and feverish. Work slows while the sick berth fills.', 'Push harder', 'Conserve');
  } else if (eventId === 5) {
    state.parts += 5;
    state.fuel -= 3;
    setMessage('Derelict tender', 'A burned train is found on a siding. The crew cuts loose usable valves before shapes gather in the rain.', 'Push harder', 'Conserve');
  } else if (eventId === 6) {
    const save = hasCrew(state, 'eli') ? 5 : 0;
    state.fuel -= 7;
    state.cargo -= Math.max(1, 8 - save);
    setMessage('Raider barricade', 'Chained freight cars block the line. The engine punches through, bleeding coal and cargo into the dark.', 'Push harder', 'Conserve');
  } else {
    const save = hasCrew(state, 'mara') ? 5 : 0;
    state.fuel -= Math.max(1, 5 - save);
    state.engine -= Math.max(1, 7 - save);
    setMessage('Boiler leak', 'A seam opens under pressure. The crew seals it with wire, sealant, and burned hands.', 'Push harder', 'Conserve');
  }

  clampStats();
}
