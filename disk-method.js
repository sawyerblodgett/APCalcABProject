let intervalID;
let isRotating = true;
let angle = 0;

function generateDisks(fxString, a, b, xSteps = 30) {
  const disks = [];
  const thetaSteps = 30;
  const xVals = Array.from({ length: xSteps }, (_, i) =>
    a + (i * (b - a)) / (xSteps - 1)
  );

  let f;
  try {
    f = new Function("x", `return ${fxString};`);
    f((a + b) / 2); // test call to validate
  } catch (e) {
    alert("Invalid function! Please check your syntax.");
    return [];
  }

  for (let x of xVals) {
    let r;
    try {
      r = f(x);
    } catch {
      r = 0;
    }

    const theta = Array.from({ length: thetaSteps + 1 }, (_, i) =>
      (2 * Math.PI * i) / thetaSteps
    );
    const xArray = Array(thetaSteps + 1).fill(x);
    const yArray = theta.map((t) => r * Math.cos(t));
    const zArray = theta.map((t) => r * Math.sin(t));

    disks.push({
      x: xArray,
      y: yArray,
      z: zArray,
      mode: "lines",
      line: { color: "blue" },
      type: "scatter3d",
      hoverinfo: "none",
      showlegend: false,
    });
  }

  return disks;
}

function updatePlot() {
  const fxString = document.getElementById("fx").value;
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const xSteps = parseInt(document.getElementById("diskSlider").value);
  const speed = parseInt(document.getElementById("speedSlider").value);

  if (isNaN(a) || isNaN(b) || a >= b) {
    alert("Bounds must be valid numbers with a < b.");
    return;
  }

  const disks = generateDisks(fxString, a, b, xSteps);
  if (disks.length === 0) return;

  const layout = {
    title: `Solid of Revolution: f(x) = ${fxString}, x from ${a} to ${b}`,
    width: 1200,
    height: 700,
    scene: {
      xaxis: { title: "x" },
      yaxis: { title: "y" },
      zaxis: { title: "z" },
      camera: {
        eye: { x: 1.5 * Math.cos(angle), y: 1.5 * Math.sin(angle), z: 1.5 },
      },
    },
  };

  Plotly.newPlot("plot", disks, layout);

  if (intervalID) clearInterval(intervalID);
  isRotating = true;
  angle = 0;
  document.getElementById("toggleRotationBtn").innerText = "Pause Rotation";
  intervalID = setInterval(() => {
    angle += 0.01;
    Plotly.relayout("plot", {
      "scene.camera.eye": {
        x: 1.5 * Math.cos(angle),
        y: 1.5 * Math.sin(angle),
        z: 1.5,
      },
    });
  }, speed);
}

function toggleRotation() {
  const btn = document.getElementById("toggleRotationBtn");
  if (isRotating) {
    clearInterval(intervalID);
    btn.innerText = "Play Rotation";
  } else {
    const speed = parseInt(document.getElementById("speedSlider").value);
    intervalID = setInterval(() => {
      angle += 0.01;
      Plotly.relayout("plot", {
        "scene.camera.eye": {
          x: 1.5 * Math.cos(angle),
          y: 1.5 * Math.sin(angle),
          z: 1.5,
        },
      });
    }, speed);
    btn.innerText = "Pause Rotation";
  }
  isRotating = !isRotating;
}

window.addEventListener("DOMContentLoaded", updatePlot);
