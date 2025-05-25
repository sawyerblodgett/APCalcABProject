let intervalID;
let isRotating = true;
let angle = 0;

function generateDisks(fxString, a, b, xSteps) {
  const disks = [];
  let f;
  try {
    f = new Function("x", `return ${fxString};`);
    f((a + b) / 2); // test if valid
  } catch {
    return [];
  }

  const dx = (b - a) / xSteps;

  for (let i = 0; i <= xSteps; i++) {
    const x = a + i * dx;
    let radius;
    try {
      radius = f(x);
    } catch {
      radius = 0;
    }

    const steps = 30;
    const theta = [...Array(steps + 1).keys()].map(i => (2 * Math.PI * i) / steps);
    const yArray = theta.map(t => radius * Math.cos(t));
    const zArray = theta.map(t => radius * Math.sin(t));
    const xArray = new Array(theta.length).fill(x);

    disks.push({
      x: xArray,
      y: yArray,
      z: zArray,
      mode: "lines",
      line: { color: "green" },
      type: "scatter3d",
      hoverinfo: "none",
      showlegend: false,
    });
  }

  return disks;
}

function calculateVolume(fxString, a, b, steps = 1000) {
  let f;
  try {
    f = new Function("x", `return ${fxString};`);
    f((a + b) / 2);
  } catch {
    return NaN;
  }

  const dx = (b - a) / steps;
  let sum = 0;

  for (let i = 0; i < steps; i++) {
    const x0 = a + i * dx;
    const x1 = a + (i + 1) * dx;
    let y0 = 0, y1 = 0;
    try {
      y0 = f(x0);
      y1 = f(x1);
    } catch {
      continue;
    }
    sum += (Math.PI / 2) * ((y0 ** 2) + (y1 ** 2)) * dx;
  }

  return sum;
}

function updatePlot() {
  const fxString = document.getElementById("fx").value;
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const steps = parseInt(document.getElementById("diskSlider").value);
  const speed = parseInt(document.getElementById("speedSlider").value);

  if (isNaN(a) || isNaN(b) || a >= b) {
    alert("Invalid bounds.");
    return;
  }

  const disks = generateDisks(fxString, a, b, steps);
  const layout = {
    margin: { t: 0 },
    scene: {
      xaxis: { title: "x" },
      yaxis: { title: "y" },
      zaxis: { title: "z" },
      camera: {
        eye: {
          x: 1.5 * Math.cos(angle),
          y: 1.5 * Math.sin(angle),
          z: 1.5,
        },
      },
    },
  };

  Plotly.newPlot("plot", disks, layout);

  const volume = calculateVolume(fxString, a, b);
  document.getElementById("volumeOutput").innerText =
    isNaN(volume) ? "Invalid function" : volume.toFixed(4);

  clearInterval(intervalID);
  intervalID = setInterval(() => {
    if (!isRotating) return;
    angle += 0.01 * (speed / 30);
    Plotly.relayout("plot", {
      "scene.camera.eye": {
        x: 1.5 * Math.cos(angle),
        y: 1.5 * Math.sin(angle),
        z: 1.5,
      },
    });
  }, 30);
}

function updateDiskLabel() {
  const val = document.getElementById("diskSlider").value;
  document.getElementById("diskCount").innerText = val;
  updatePlot();
}

function updateSpeedLabel() {
  const val = document.getElementById("speedSlider").value;
  document.getElementById("speedValue").innerText = val;
}

function toggleRotation() {
  isRotating = !isRotating;
}

window.addEventListener("DOMContentLoaded", updatePlot);

