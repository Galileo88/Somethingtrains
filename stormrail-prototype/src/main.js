import { crewCandidates, crewNames, hasCrew } from './entities/crew.js';
import { updateTravel } from './systems/travel.js';
import { render } from './systems/render.js';
import { resolveEvent } from './systems/events.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

const ui = {
  date: document.getElementById('date'),
  location: document.getElementById('location'),
  fuel: document.getElementById('fuel'),
  food: document.getElementById('food'),
  water: document.getElementById('water'),
  parts: document.getElementById('parts'),
  morale: document.getElementById('morale'),
  cargo: document.getElementById('cargo'),
  engine: document.getElementById('engine'),
  crew: document.getElementById('crew'),
  eventTitle: document.getElementById('event-title'),
  eventBody: document.getElementById('event-body'),
  actionA: document.getElementById('action-a'),
  actionB: document.getElementById('action-b')
};

const route = [
  'Atlanta Prison Depot',
  'Chattanooga Cut',
  'Nashville Junction',
  'St. Louis Iron Gate',
  'Omaha Repair Yard',
  'Denver Boilerhouse',
  'Salt Basin Line',
  'Boise Refuge',
  'Spokane Signal Tower',
  'Seattle'
];

const state = {
  phase: 'crew',
  day: 1,
  leg: 0,
  progress: 0,
  speed: 0,
  mode: 0,
  fuel: 82,
  food: 70,
  water: 76,
  parts: 28,
  morale: 58,
  cargo: 100,
  engine: 72,
  distance: 0,
  outcome: 0,
  width: 0,
  height: 0,
  candidate: 0,
  crew: [],
  lastMarker: -1,
  messageDirty: true,
  title: 'Choose your crew',
  body: '',
  actionA: 'Select',
  actionB: 'Next'
};

function clampStats() {
  state.fuel = Math.max(0, Math.min(100, state.fuel));
  state.food = Math.max(0, Math.min(100, state.food));
  state.water = Math.max(0, Math.min(100, state.water));
  state.parts = Math.max(0, Math.min(100, state.parts));
  state.morale = Math.max(0, Math.min(100, state.morale));
  state.cargo = Math.max(0, Math.min(100, state.cargo));
  state.engine = Math.max(0, Math.min(100, state.engine));
}

function setMessage(title, body, actionA, actionB) {
  state.title = title;
  state.body = body;
  state.actionA = actionA;
  state.actionB = actionB;
  state.messageDirty = true;
}

function showCandidate() {
  const candidate = crewCandidates[state.candidate];
  const selected = hasCrew(state, candidate.id);
  const label = selected ? 'Remove' : 'Select';
  const count = `${state.crew.length}/3 selected`;

  setMessage(
    `${candidate.name}, ${candidate.role}`,
    `${candidate.benefit} ${candidate.drawback} ${count}.`,
    state.crew.length === 3 && !selected ? 'Begin run' : label,
    'Next'
  );
}

function showCrewReady() {
  setMessage(
    'Crew assembled',
    `${crewNames(state).join(', ')}. The train is ready to leave Atlanta.`,
    'Begin run',
    'Review crew'
  );
}

function syncUi() {
  ui.date.textContent = `Day ${state.day | 0}`;
  ui.location.textContent = route[state.leg];
  ui.fuel.textContent = state.fuel | 0;
  ui.food.textContent = state.food | 0;
  ui.water.textContent = state.water | 0;
  ui.parts.textContent = state.parts | 0;
  ui.morale.textContent = state.morale | 0;
  ui.cargo.textContent = state.cargo | 0;
  ui.engine.textContent = state.engine | 0;
  ui.crew.textContent = `${state.crew.length}/3`;

  if (state.messageDirty) {
    ui.eventTitle.textContent = state.title;
    ui.eventBody.textContent = state.body;
    ui.actionA.textContent = state.actionA;
    ui.actionB.textContent = state.actionB;
    state.messageDirty = false;
  }
}

function resize() {
  const scale = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  state.width = rect.width | 0;
  state.height = rect.height | 0;
  canvas.width = (state.width * scale) | 0;
  canvas.height = (state.height * scale) | 0;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function applyCrewStart() {
  for (let i = 0; i < crewCandidates.length; i += 1) {
    const candidate = crewCandidates[i];

    if (hasCrew(state, candidate.id)) {
      state.morale += candidate.moraleStart || 0;
    }
  }

  clampStats();
}

function beginRun() {
  if (state.crew.length !== 3) {
    showCandidate();
    return;
  }

  state.phase = 'travel';
  applyCrewStart();
  setMessage('The Redemption Run', 'The sealed cargo is coupled behind the engine. Seattle needs it before the year ends.', 'Depart', 'Inspect train');
}

function depart() {
  if (state.mode !== 0 || state.outcome !== 0 || state.phase !== 'travel') {
    return;
  }

  state.mode = 1;
  state.speed = 14 + state.engine * 0.05;
  setMessage('Into the storm', 'The boiler wakes. The crew seals the doors and the train leaves the pocket of habitable air.', 'Push harder', 'Conserve');
}

function inspect() {
  if (state.mode !== 0 || state.outcome !== 0 || state.phase !== 'travel') {
    return;
  }

  const repairBonus = hasCrew(state, 'mara') ? 5 : 0;

  if (state.parts >= 4 && state.engine < 92) {
    state.parts -= 4;
    state.engine += 9 + repairBonus;
    state.day += 1;
    clampStats();
    setMessage('Cold repairs', 'The crew spends a day patching steam leaks, clearing grit from valves, and reinforcing the cowcatcher.', 'Depart', 'Inspect train');
    return;
  }

  setMessage('Nothing easy left', 'The train needs more parts before meaningful repairs can be made.', 'Depart', 'Inspect train');
}

function toggleCrew() {
  const candidate = crewCandidates[state.candidate];
  const index = state.crew.indexOf(candidate.id);

  if (index !== -1) {
    state.crew.splice(index, 1);
    showCandidate();
    return;
  }

  if (state.crew.length < 3) {
    state.crew.push(candidate.id);
  }

  if (state.crew.length === 3) {
    showCrewReady();
  } else {
    showCandidate();
  }
}

function nextCandidate() {
  state.candidate = (state.candidate + 1) % crewCandidates.length;
  showCandidate();
}

function chooseA() {
  if (state.phase === 'crew') {
    if (state.crew.length === 3 && state.actionA === 'Begin run') {
      beginRun();
      return;
    }

    toggleCrew();
    return;
  }

  if (state.outcome !== 0) {
    reset();
    return;
  }

  if (state.mode === 1) {
    state.fuel -= 5;
    state.engine -= 2;
    state.morale += 1;
    state.speed += 5;
    clampStats();
    setMessage('Boiler forced', 'The train gains speed, but the engine screams under the pressure.', 'Push harder', 'Conserve');
    return;
  }

  depart();
}

function chooseB() {
  if (state.phase === 'crew') {
    nextCandidate();
    return;
  }

  if (state.outcome !== 0) {
    reset();
    return;
  }

  if (state.mode === 1) {
    state.speed = Math.max(8, state.speed - 3);
    state.fuel += 1;
    state.morale -= 1;
    clampStats();
    setMessage('Low burn', 'The fireman chokes the furnace down. The crew watches the storm hammer the windows.', 'Push harder', 'Conserve');
    return;
  }

  inspect();
}

function arrive() {
  state.mode = 0;
  state.progress = 0;
  state.leg += 1;
  state.day += 3;
  state.fuel += 14;
  state.food += 10;
  state.water += 12;
  state.parts += 6;
  state.morale += 5;
  state.engine += 3;
  clampStats();

  if (state.leg >= route.length - 1) {
    state.outcome = state.day <= 365 && state.cargo >= 60 ? 1 : 2;
    state.phase = 'ended';

    if (state.outcome === 1) {
      setMessage('Seattle receives the train', 'The cargo reaches Seattle before the year dies. The prisoner-captain is no longer just a sentence on paper.', 'Restart', 'Restart');
    } else {
      setMessage('Too little, too late', 'Seattle sees the headlamp through the storm, but too much was lost on the rails.', 'Restart', 'Restart');
    }
    return;
  }

  setMessage('Settlement reached', `The train reaches ${route[state.leg]}. Trade crews refuel the tender and patch what they can.`, 'Depart', 'Inspect train');
}

function fail(title, body) {
  state.outcome = 2;
  state.mode = 0;
  state.phase = 'ended';
  setMessage(title, body, 'Restart', 'Restart');
}

function reset() {
  state.phase = 'crew';
  state.day = 1;
  state.leg = 0;
  state.progress = 0;
  state.speed = 0;
  state.mode = 0;
  state.fuel = 82;
  state.food = 70;
  state.water = 76;
  state.parts = 28;
  state.morale = 58;
  state.cargo = 100;
  state.engine = 72;
  state.distance = 0;
  state.outcome = 0;
  state.candidate = 0;
  state.crew.length = 0;
  state.lastMarker = -1;
  showCandidate();
}

function checkFailure() {
  if (state.fuel <= 0) {
    fail('Dead firebox', 'The engine cools outside the settlements. By dawn, something is walking on the roof.');
  } else if (state.food <= 0 || state.water <= 0) {
    fail('Crew collapse', 'The train still has cargo, but no crew strong enough to move it.');
  } else if (state.engine <= 0) {
    fail('Boiler death', 'The engine tears itself open on a dead stretch of rail.');
  } else if (state.morale <= 0) {
    fail('Mutiny', 'The crew uncouples the captain car and leaves judgment to the storm.');
  } else if (state.day > 365) {
    fail('Winter closes', 'The year ends before Seattle receives the supplies.');
  }
}

let lastTime = 0;

function frame(time) {
  const dt = Math.min(0.05, (time - lastTime) * 0.001 || 0);
  lastTime = time;

  if (state.mode === 1 && state.outcome === 0 && state.phase === 'travel') {
    updateTravel(state, dt, hasCrew);
    resolveEvent(state, setMessage, clampStats, hasCrew);
    if (state.progress >= 100) {
      arrive();
    }
    checkFailure();
  }

  render(ctx, state, route);
  syncUi();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resize);
ui.actionA.addEventListener('click', chooseA);
ui.actionB.addEventListener('click', chooseB);

resize();
showCandidate();
syncUi();
requestAnimationFrame(frame);
