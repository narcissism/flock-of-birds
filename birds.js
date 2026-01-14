function animate() {
  drawSky();
  drawRoad();
  drawPoles();
  drawPowerLines();

  for (const b of birds) {
    // Organic movement like original working version
    b.x += b.vx;
    b.y += b.vy;

    // Bounce off canvas edges and top of road (vpY * 0.8)
    if (b.x < 0 || b.x > w) b.vx *= -1;
    if (b.y < 0 || b.y > vpY * 0.8) b.vy *= -1;

    b.wing += 0.2;

    const a = Math.atan2(b.vy, b.vx);
    const flap = Math.sin(b.wing) * 3;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(a);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2; // thicker for better visibility
    ctx.shadowColor = "white"; // subtle glow
    ctx.shadowBlur = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, -4 - flap * 0.5); // longer wings for birds
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, 4 + flap * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  requestAnimationFrame(animate);
}
