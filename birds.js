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
   CREATE BIRDS ABOVE ROAD
-------------------- */
const birds = [];
const COUNT = 300;
const vpY = h * 0.55; // vanishing point

for (let i = 0; i < COUNT; i++) {
  birds.push({
    x: Math.random() * w,
    y: Math.random() * vpY, // spawn above road
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
   UPDATE & DRAW
-------------------- */
function animate() {
  drawSky();
  drawRoad(); // road drawn first, birds drawn on top

  for (const b of birds) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < 0 || b.x > w) b.vx *= -1;
    if (b.y < 0 || b.y > vpY) b.vy *= -1; // keep birds above road

    b.wing += 0.2;

    const a = Math.atan2(b.vy, b.vx);
    const flap = Math.sin(b.wing) * 3;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(a);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, -3 - flap * 0.3);
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 3 + flap * 0.3);
    ctx.stroke();

    ctx.restore();
  }

  requestAnimationFrame(animate);
}

animate();
