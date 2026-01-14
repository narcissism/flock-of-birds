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
    createSky();
  });

  /* --------------------
     SUNSET SKY
  -------------------- */
  const skyCanvas = document.createElement("canvas");
  const skyCtx = skyCanvas.getContext("2d");

  function cr
