// =========================
// SIMPLE TEMPERATURE GRAPH
// =========================

let history = [];
let canvas;
let ctx;

// =========================
// INIT
// =========================

export function initGraph(canvasId) {
    canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("Graph canvas not found");
        return;
    }

    ctx = canvas.getContext("2d");

    clearGraph();
}

// =========================
// ADD DATA POINT
// =========================

export function addHistoryPoint(time, temperature) {
    history.push({
        time,
        temperature
    });

    // prevent memory overload
    if (history.length > 2000) {
        history.shift();
    }
}

// =========================
// CLEAR GRAPH
// =========================

export function clearGraph() {
    history = [];

    if (!ctx) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// =========================
// DRAW GRAPH
// =========================

export function drawGraph() {
    if (!ctx || history.length < 2) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    drawGrid(w, h);

    // find min/max temperature
    let min = history[0].temperature;
    let max = history[0].temperature;

    for (let i = 1; i < history.length; i++) {
        const t = history[i].temperature;
        if (t < min) min = t;
        if (t > max) max = t;
    }

    const range = max - min || 1;

    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;

    history.forEach((point, i) => {

        const x =
            (i / (history.length - 1)) * w;

        const y =
            h - ((point.temperature - min) / range) * h;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    drawLabels(min, max);
}

// =========================
// GRID
// =========================

function drawGrid(w, h) {
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    const step = 50;

    for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }

    for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

// =========================
// LABELS
// =========================

function drawLabels(min, max) {
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";

    ctx.fillText(
        `Min: ${min.toFixed(1)}°C`,
        10,
        20
    );

    ctx.fillText(
        `Max: ${max.toFixed(1)}°C`,
        10,
        40
    );
}