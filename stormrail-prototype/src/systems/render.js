const train = {
  x: 0,
  y: 0,
  wheelA: 0,
  wheelB: 0
};

export function render(ctx, state, route) {
  const width = state.width;
  const height = state.height;
  const trackY = height * 0.68;
  const progressX = 28 + (width - 56) * state.progress * 0.01;

  ctx.fillStyle = '#0b0d10';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#111820';
  ctx.fillRect(0, height * 0.55, width, height * 0.45);

  ctx.strokeStyle = '#26323a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, trackY);
  ctx.lineTo(width - 20, trackY);
  ctx.stroke();

  ctx.strokeStyle = '#3d4a52';
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i += 1) {
    const x = 20 + i * ((width - 40) / 15);
    ctx.beginPath();
    ctx.moveTo(x - 9, trackY + 12);
    ctx.lineTo(x + 9, trackY - 12);
    ctx.stroke();
  }

  drawRain(ctx, state, width);
  drawRoute(ctx, state, route, width, trackY);
  drawTrain(ctx, progressX, trackY - 32);
}

function drawRain(ctx, state, width) {
  ctx.strokeStyle = '#1f2a33';
  ctx.lineWidth = 2;

  for (let i = 0; i < 7; i += 1) {
    const y = 26 + i * 31 + ((state.distance * 11 + i * 19) % 19);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + 18);
    ctx.stroke();
  }
}

function drawRoute(ctx, state, route, width, trackY) {
  const count = route.length - 1;

  ctx.fillStyle = '#65717a';
  for (let i = 0; i < count; i += 1) {
    const x = 28 + (width - 56) * (i / (count - 1));
    ctx.beginPath();
    ctx.arc(x, trackY + 42, i === state.leg ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTrain(ctx, x, y) {
  train.x = x;
  train.y = y;
  train.wheelA = x + 18;
  train.wheelB = x + 54;

  ctx.fillStyle = '#1d2429';
  ctx.fillRect(train.x, train.y, 76, 24);

  ctx.fillStyle = '#2d363d';
  ctx.fillRect(train.x + 12, train.y - 18, 24, 18);
  ctx.fillRect(train.x + 52, train.y - 10, 12, 10);

  ctx.fillStyle = '#161b20';
  ctx.beginPath();
  ctx.arc(train.wheelA, train.y + 28, 8, 0, Math.PI * 2);
  ctx.arc(train.wheelB, train.y + 28, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5f6a70';
  ctx.fillRect(train.x - 6, train.y + 20, 88, 4);
}
