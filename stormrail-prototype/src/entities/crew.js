export const crewCandidates = [
  {
    id: 'mara',
    name: 'Mara Voss',
    role: 'Boiler Mechanic',
    benefit: 'Repairs restore more engine condition.',
    drawback: 'Starts with lower morale.',
    repairBonus: 5,
    moraleStart: -4
  },
  {
    id: 'eli',
    name: 'Eli Rook',
    role: 'Ex-Transit Guard',
    benefit: 'Reduces raider cargo loss.',
    drawback: 'Consumes more food.',
    raidSave: 5,
    foodBurn: 0.04
  },
  {
    id: 'vale',
    name: 'Sister Vale',
    role: 'Medic',
    benefit: 'Reduces sickness and contamination losses.',
    drawback: 'Uses more water for treatment.',
    sicknessSave: 5,
    waterBurn: 0.04
  },
  {
    id: 'jonah',
    name: 'Jonah Pike',
    role: 'Fireman',
    benefit: 'Lowers fuel use while traveling.',
    drawback: 'Small morale penalty from harsh discipline.',
    fuelSave: 0.16,
    moraleStart: -2
  },
  {
    id: 'nell',
    name: 'Nell Ash',
    role: 'Track Scout',
    benefit: 'Reduces track-damage losses.',
    drawback: 'Scouting costs extra food.',
    trackSave: 4,
    foodBurn: 0.03
  },
  {
    id: 'oren',
    name: 'Oren Kade',
    role: 'Quartermaster',
    benefit: 'Reduces food and water consumption.',
    drawback: 'Charity and mercy choices recover less morale.',
    rationSave: 0.08,
    moraleGainPenalty: 2
  }
];

export function hasCrew(state, id) {
  return state.crew.indexOf(id) !== -1;
}

export function crewNames(state) {
  const names = [];

  for (let i = 0; i < crewCandidates.length; i += 1) {
    if (hasCrew(state, crewCandidates[i].id)) {
      names.push(crewCandidates[i].name);
    }
  }

  return names;
}
