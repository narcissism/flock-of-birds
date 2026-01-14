window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  /* --------------------
     BIRD SETTINGS
  -------------------- */
  const birdCount = 420;
  const perceptionRadius = 90;
  const separationRadius = 18;
  const maxSpeed = 3.2;
  const maxForce = 0.12;

  const birds = [];

  /* --------------------
     BIRD CLASS
  -------------------- */
  class Bird {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle);
      this.vy = Math.sin(angle);
      this.ax = 0;
      this.ay = 0;
    }

    applyForce(x, y) {
      this.ax += x;
      this.ay += y;
    }

    flock(birds) {
      let alignX = 0, alignY = 0;
      let cohX = 0, cohY = 0;
      let sepX = 0, sepY = 0;
      let count = 0;

      for (const other of birds) {
        if (other === this) continue;
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < perceptionRadius && dist > 0) {
          alignX += other.vx;
          alignY += other.vy;
          cohX += other.x;
          cohY += other.y;

          if (dist < separationRadius) {
            sepX -= dx / dist;
            sepY -= dy / dist;
          }
          count++;
        }
      }

      if (count > 0) {
        alignX /= count;
        alignY /= count;
        cohX = cohX / count - this.x;
        cohY = cohY / count - this.y;

        this.steer(alignX, alignY, 1.4); // STRONG alignment
        this.steer(cohX, cohY, 0.15);
        this.steer(sepX, sepY, 1.0);
      }
    }

    steer(x, y, strength) {
      const mag = Math.hypot(x, y);
      if (mag === 0) return;
      x = (x / mag) * maxSpeed - this.vx;
      y = (y / mag) * maxSpeed - this.vy;

      x = Math.max(-maxForce, Math.min(maxForce, x));
      y = Math.max(-maxForce, Math.min(maxForce, y));

      this.applyForce(x * strength, y * strength);
    }

    avoidEdges() {
      const margin = 120;
      const turn = 0.2;
      if (this.x < margin) this.applyForce(turn, 0);
      if (this.x > width - margin) this.applyForce(-turn, 0);
      if (this.y < margin) this.applyForce(0, turn);
      if (this.y > height - margin) this.applyForce(0, -turn);
    }

    update() {
      this.vx += this.ax;
      this.vy += this.ay;

      const speed = Math.hypot(this.vx, this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }

      this.x += this.vx;
      this.y += this.vy;

      this.ax = 0;
      this.ay = 0;

      this.avoidEdges();
    }

    draw() {
      const angle = Math.atan2(this.vy, this.vx);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      // Simple bird "V"
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-4, -2);
      ctx.lineTo(0, 0);
      ctx.lineTo(-4, 2);
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < birdCount; i++) {
    birds.push(new Bird());
  }

  /* --------------------
     ANIMATION LOOP
  -------------------- */
  function animate() {
    ctx.fillStyle = "rgba(14,17,22,0.25)";
    ctx.fillRect(0, 0, width, height);

    for (const bird of birds) bird.flock(birds);
    for (const bird of birds) bird.update();
    for (const bird of birds) bird.draw();

    requestAnimationFrame(animate);
  }

  animate();
});
