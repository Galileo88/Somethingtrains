export function updateTravel(state, dt, hasCrew) {
  const fuelSave = hasCrew(state, 'jonah') ? 0.16 : 0;
  const rationSave = hasCrew(state, 'oren') ? 0.08 : 0;
  const foodPenalty = (hasCrew(state, 'eli') ? 0.04 : 0) + (hasCrew(state, 'nell') ? 0.03 : 0);
  const waterPenalty = hasCrew(state, 'vale') ? 0.04 : 0;
  const engineDrag = 0.55 + state.engine * 0.006;
  const rate = state.speed * engineDrag * dt;

  state.progress += rate;
  state.distance += rate;
  state.day += dt * 0.35;

  state.fuel -= dt * Math.max(0.28, 0.72 + state.speed * 0.018 - fuelSave);
  state.food -= dt * Math.max(0.06, 0.16 - rationSave + foodPenalty);
  state.water -= dt * Math.max(0.07, 0.2 - rationSave + waterPenalty);
  state.engine -= dt * 0.024;
}
