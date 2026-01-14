throw new Error("THIS IS THE CURRENT JS FILE");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h, vpX, vpY;
let dashOffset = 0;

/* ---------- RESIZE ---------- */
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  vpX = w / 2;
  vpY = h * 0.55;
}
window.addEventListener("resize", resize);
resize();

/* ---------- SKY ---------- */
const skyStops = [
  { top:[255,120,60], bottom:[255,190,120] },
  { top:[15,20,60], bottom:[40,50,90] },
  { top:[180,120,180], bottom:[255,210,170] },
  { top:[135,206,235], bottom:[255,255,255] }
];

function lerp(a,b,f){ return a + (b-a)*f; }

function drawSky(time) {
  const cycle = 45000;
  const t = (time % cycle) / cycle * skyStops.length;
  const i = Math.floor(t);
  const n = (i + 1) % skyStops.length;
  const f = t - i;

  const top = skyStops[i].top.map((v,j)=>Math.floor(lerp(v, skyStops[n].top[j], f)));
  const bottom = skyStops[i].bottom.map((v,j)=>Math.floor(lerp(v, skyStops[n].bottom[j], f)));

  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, `rgb(${top[0]},${top[1]},${top[2]})`);
  g.addColorStop(1, `rgb(${bottom[0]},${bottom[1]},${bottom[2]})`);
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);
}

/* ---------- ROAD ---------- */
function drawRoad() {
  ctx.fillStyle = "#2e2e2e";
  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  dashOffset += 2;
  ctx.setLineDash([40, 40]);
  ctx.lineDashOffset = -dashOffset;
  ctx.strokeStyle = "gold";
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  ctx.setLineDash([]);
}

/* ---------- POLES ---------- */
const poles = [];
const POLE_COUNT = 6;

for (let i = 0; i < POLE_COUNT; i++) {
  poles.push({ t: i / POLE_COUNT });
}

function drawPoles() {
  ctx.fillStyle = "#6b3e26";

  for (const p of poles) {
    p.t += 0.002;
    if (p.t > 1) p.t = 0;

    const y = vpY + (h - vpY) * p.t;
    const spread = p.t;
    const xL = vpX - vpX * spread;
    const xR = vpX + (w - vpX) * spread;

    const height = 40 + p.t * 260;
    const width = 4 + p.t * 14;

    ctx.fillRect(xL - width/2, y - height, width, height);
    ctx.fillRect(xR - width/2, y - height, width, height);
  }
}

/* ---------- POWER LINES ---------- */
function drawPowerLines() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  const endY1 = h * 0.75;
  const endY2 = h * 0.78;

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(40, endY1);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(40, endY2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w - 40, endY1);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(w - 40, endY2);
  ctx.stroke();
}

/* ---------- ANIMATION LOOP ---------- */
function animate(time) {
  drawSky(time);
  drawRoad();
  drawPoles();
  drawPowerLines();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
