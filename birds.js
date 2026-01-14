const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createSky();
}
window.addEventListener("resize", resize);
resize();

/* --------------------
   SUNSET SKY (STATIC)
-------------------- */
const skyCanvas = document.createElement("canvas");
const skyCtx = skyCanvas.getContext("2d");

function createSky() {
  skyCanvas.width = width;
  skyCanvas.height = height;

  const g = skyCtx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0.0, "#0b1026"); // deep blue
  g.addColorStop(0.4, "#3b1c5a"); // purple
  g.addColorStop(0.7, "#b24a3a"); // orange
  g.addColorStop(1.0, "#f6b26b"); // horizon glow

  skyCtx.fillStyle = g;
  skyCtx.fillRect(0, 0, width, height);
}

/* --------------------
   WIND FIELD
-------------------- */
function wind(x, y, t) {
  return {
    x: Math.sin(y * 0.001 + t * 0.0003) * 0.25,
    y: Math.cos(x * 0.001 + t * 0.0002) * 0.25
  };
}

/* --------------------
   BIRDS
-------------------- */
const birds = [];
const COUNT = 420;

class Bird {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    const a = Math.random() * Math.PI * 2;
    this.vx = Math.cos(a);
    this.vy = Math.sin(a);
    this.ax = 0;
    this.ay = 0;
    this.wing = Math.random() * Math.PI * 2;
  }

  applyForce(x, y) {
    this.ax += x;
    this.ay += y;
  }

  flock(birds) {
    let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0;

    for (const o of birds) {
      if (o === this) continue;
      const dx = o.x - this.x;
      const dy = o.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d > 0 && d < 90) {
        ax += o.vx;
        ay += o.vy;
        cx += o.x;
        cy += o.y;
        if (d < 18) {
          sx -= dx / d;
          sy -= dy / d;
        }
        n++;
      }
    }

    if (n) {
      ax /= n; ay /= n;
      cx = cx / n - this.x;
      cy = cy / n - this.y;

      this.applyForce(ax * 0.01, ay * 0.01);
      this.applyForce(cx * 0.0005, cy * 0.0005);
      this.applyForce(sx * 0.05, sy * 0.05);
    }
  }

  update(t) {
    const w = wind(this.x, this.y, t);
    this.applyForce(w.x, w.y);

    const m = 200;
    if (this.x < m) this.applyForce(0.15, 0);
    if (this.x > width - m) this.applyForce(-0.15, 0);
    if (this.y < m) this.applyForce(0, 0.15);
    if (this.y > height - m) this.applyForce(0, -0.15);

    this.vx += this.ax;
    this.vy += this.ay;

    const s = Math.hypot(this.vx, this.vy);
    const max = 3;
    if (s > max) {
      this.vx = (this.vx / s) * max;
      this.vy = (this.vy / s) * max;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.ax = this.ay = 0;
    this.wing += s * 0.2;
  }

  draw() {
    const a = Math.atan2(this.vy, this.vx);
    const flap = Math.sin(this.wing) * 3;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(a);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1.1;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, -3 - flap * 0.3);
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 3 + flap * 0.3);
    ctx.stroke();

    ctx.restore();
  }
}

for (let i = 0; i < COUNT; i++) birds.push(new Bird());

/* --------------------
   LOOP
