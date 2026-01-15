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
function drawPoles() {
  ctx.fillStyle = "#6b3e26";

  for (const p of poles) {
    p.t += 0.002;
    if (p.t > 1) p.t = 0;

    const yBase = vpY + (h - vpY) * p.t;

    const spread = p.t;
    const xL = vpX - vpX * spread;
    const xR = vpX + (w - vpX) * spread;

    // Pole grows from vpY toward top of canvas
    const topY = vpY * (1 - p.t);
    const height = yBase - topY;
    const width = 4 + p.t * 16;

    ctx.fillRect(xL - width / 2, topY, width, height);
    ctx.fillRect(xR - width / 2, topY, width, height);

    // store pole tops for powerlines
    p.leftTop = { x: xL, y: topY };
    p.rightTop = { x: xR, y: topY };
  }
}


/* ---------- POWER LINES ---------- */
function drawPowerLines() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  // use the furthest pole (closest to camera)
  const p = poles[poles.length - 1];
  if (!p.leftTop || !p.rightTop) return;

  // left side
  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(p.leftTop.x, p.leftTop.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(p.leftTop.x + 40, p.leftTop.y + 20);
  ctx.stroke();

  // right side
  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(p.rightTop.x, p.rightTop.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(vpX, vpY);
  ctx.lineTo(p.rightTop.x - 40, p.rightTop.y + 20);
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
