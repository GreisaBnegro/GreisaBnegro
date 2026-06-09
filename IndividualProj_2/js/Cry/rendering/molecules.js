// =========================
// SIMPLE MOLECULE SIMULATION
// =========================

let canvas;
let ctx;
let molecules = [];

const MOLECULE_COUNT = 100;

// =========================
// INIT
// =========================

export function initMolecules(canvasId) {
    canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("Molecule canvas not found");
        return;
    }

    ctx = canvas.getContext("2d");

    createMolecules();
}

// =========================
// CREATE MOLECULES
// =========================

function createMolecules() {
    molecules = [];

    for (let i = 0; i < MOLECULE_COUNT; i++) {
        molecules.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: 3
        });
    }
}

// =========================
// MAIN DRAW FUNCTION
// =========================

export function drawMolecules(phase, temperature) {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateMolecules(phase, temperature);

    for (let m of molecules) {
        drawParticle(m);
    }

    drawInfo(phase, temperature);
}

// =========================
// UPDATE PHYSICS
// =========================

function updateMolecules(phase, temperature) {

    const speed = getSpeed(phase, temperature);

    for (let m of molecules) {

        if (phase === "solid") {
            solidMotion(m, speed);
        }

        else if (phase === "liquid") {
            liquidMotion(m, speed);
        }

        else {
            gasMotion(m, speed);
        }

        bounceWalls(m);
    }
}

// =========================
// SPEED MODEL
// =========================

function getSpeed(phase, temperature) {

    const tempFactor =
        Math.max(0.5, Math.abs(temperature) / 30);

    if (phase === "solid") return 0.5 * tempFactor;
    if (phase === "liquid") return 2 * tempFactor;
    return 4 * tempFactor; // gas
}

// =========================
// MOTION TYPES
// =========================

// solid = vibration only
function solidMotion(m, speed) {
    m.x += Math.sin(Date.now() * 0.002) * speed;
    m.y += Math.cos(Date.now() * 0.002) * speed;
}

// liquid = mild random drift
function liquidMotion(m, speed) {
    m.vx += (Math.random() - 0.5) * 0.1;
    m.vy += (Math.random() - 0.5) * 0.1;

    m.x += m.vx * speed;
    m.y += m.vy * speed;
}

// gas = fast chaotic motion
function gasMotion(m, speed) {
    m.vx += (Math.random() - 0.5) * 0.4;
    m.vy += (Math.random() - 0.5) * 0.4;

    m.x += m.vx * speed;
    m.y += m.vy * speed;
}

// =========================
// WALL COLLISION
// =========================

function bounceWalls(m) {

    if (m.x < 0) {
        m.x = 0;
        m.vx *= -1;
    }

    if (m.x > canvas.width) {
        m.x = canvas.width;
        m.vx *= -1;
    }

    if (m.y < 0) {
        m.y = 0;
        m.vy *= -1;
    }

    if (m.y > canvas.height) {
        m.y = canvas.height;
        m.vy *= -1;
    }
}

// =========================
// DRAW PARTICLE
// =========================

function drawParticle(m) {
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fillStyle = "#7dd3fc";
    ctx.fill();
}

// =========================
// INFO TEXT
// =========================

function drawInfo(phase, temperature) {
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";

    ctx.fillText(`Phase: ${phase}`, 10, 20);
    ctx.fillText(
        `Temp: ${temperature.toFixed(1)} °C`,
        10,
        40
    );
}

// =========================
// RESET
// =========================

export function resetMolecules() {
    if (!canvas) return;
    createMolecules();
}