const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* --------------------
   CREATE BIRDS
-------------------- */
const birds = [];
const COUNT = 300;

for (let i = 0; i < COUNT; i++) {
  birds.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    wing: Math.random() * Math.PI * 2
  });
}

/* --------------------
   DRAW SKY
-------------------- */
function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0b1026");
  g.addColorStop(0.5, "#5a246d");
  g.addColorStop(0.8, "#c95a3a");
  g.addColorStop(1, "#f6b26b");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* --------------------
   DRAW ROAD
-------------------- */
function drawRoad() {
  // Draw road triangle
  ctx.fillStyle = "#333";
  ctx.beginPath();
  const vpX = w / 2;
  const vpY = h * 0.55; // vanishing point
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Dashed line
  ctx.setLineDash([30, 30]);
  ctx.strokeStyle = "yellow";

  // Single dashed line from vanishing point to bottom center
  const lineX1 = vpX;
  const lineY1 = vpY;
  const lineX2 = w / 2;
  const lineY2 = h;

  const segments = 100; // divide into small sections just for lineWidth growth
  for (let i = 0; i < segments; i++) {
    const t1 = i / segments;
    const t2 = (i + 1) / segments;

    const xStart = lineX1 * (1 - t1) + lineX2 * t1;
    const yStart = lineY1 * (1 - t1) + lineY2 * t1;
    const xEnd = lineX1 * (1 - t2) + lineX2 * t2;
    const yEnd = lineY1 * (1 - t2) + lineY2 * t2;

    // Line width grows from 4 at top to 8 at bottom
    ctx.lineWidth = 4 + 4 * t2;

    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
  }

  ctx.setLineDash([]); // reset dash
}

/* --------------------
   UPDATE & DRAW
-------------------- */
function animate() {
  drawSky();
  drawRoad(); // road below birds

  for (const b of birds) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < 0 || b.x > w) b.vx *= -1;
    if (b.y < 0 || b.y > h) b.vy *= -1;

    b.wing += 0.2;

    const a = Math.atan2(b.vy, b.vx);
    const flap = Math.sin(b.wing) * 3;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(a);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0
