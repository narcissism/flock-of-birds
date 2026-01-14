const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h, vpY;

/* --------------------
   RESIZE CANVAS
-------------------- */
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  vpY = h * 0.55;

  // Recreate birds on resize
  createBirds();
}
window.addEventListener("resize", resize);
resize();

/* --------------------
   CREATE BIRDS
-------------------- */
const birds = [];
const COUNT = 300;

function createBirds() {
  birds.length = 0; // clear existing birds
  for (let i = 0; i < COUNT; i++) {
    birds.push({
      x: Math.random() * w,
      y: Math.random() * vpY, // spawn above the road
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      wing: Math.random() * Math.PI * 2
    });
  }
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
  ctx.fillStyle = "#333";
  ctx.beginPath();
  const vpX = w / 2;
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Dashed line
  ctx.setLineDash([30, 30]);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w/2, h);
  ctx.stroke();
  ctx.setLineDash([]);
}

/* --------------------
   UPDATE & DRAW BIRDS
-------------------- */
function animate() {
  drawSky();
  drawRoad();

  for (const b of birds) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < 0 || b.x > w) b.vx *= -1;
    if (b.y
