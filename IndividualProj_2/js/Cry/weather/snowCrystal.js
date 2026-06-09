// =========================
// SIMPLE SNOW CRYSTAL SYSTEM
// =========================

let crystalSVG;
let crystalNotes;

// =========================
// INIT
// =========================

export function initSnowCrystal() {
    crystalSVG = document.getElementById("crystalSVG");
    crystalNotes = document.getElementById("crystalNotes");
}

// =========================
// CRYSTAL TYPE
// =========================

export function getCrystalType(temp) {

    if (temp > 0) return "No snow crystal";

    if (temp >= -3) return "Thin Plates";

    if (temp >= -8) return "Needles";

    if (temp >= -10) return "Hexagonal Plates";

    if (temp >= -22) return "Dendrites";

    return "Columns";
}

// =========================
// DESCRIPTION
// =========================

function getDescription(temp) {

    if (temp > 0) {
        return "Above freezing — no ice crystals form.";
    }

    if (temp >= -3) {
        return "Thin flat ice plates forming in mild cold clouds.";
    }

    if (temp >= -8) {
        return "Elongated needle-like crystals growing quickly.";
    }

    if (temp >= -10) {
        return "Hexagonal symmetry begins to form.";
    }

    if (temp >= -22) {
        return "Classic snowflake dendrites with branching arms.";
    }

    return "Very cold conditions forming column-like crystals.";
}

// =========================
// MAIN GENERATOR
// =========================

export function generateSnowflake(temp) {

    if (!crystalSVG) return;

    crystalSVG.innerHTML = "";

    if (crystalNotes) {
        crystalNotes.textContent = getDescription(temp);
    }

    if (temp > 0) {
        drawDrop();
    }

    else if (temp >= -3) {
        drawPlate();
    }

    else if (temp >= -8) {
        drawNeedles();
    }

    else if (temp >= -10) {
        drawHexagon();
    }

    else if (temp >= -22) {
        drawDendrite();
    }

    else {
        drawColumns();
    }
}

// =========================
// SVG HELPERS
// =========================

function line(x1, y1, x2, y2, width = 3) {

    const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    el.setAttribute("x1", x1);
    el.setAttribute("y1", y1);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute("stroke", "#7dd3fc");
    el.setAttribute("stroke-width", width);

    crystalSVG.appendChild(el);
}

// circle helper
function circle(cx, cy, r) {

    const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    el.setAttribute("cx", cx);
    el.setAttribute("cy", cy);
    el.setAttribute("r", r);
    el.setAttribute("fill", "#7dd3fc");

    crystalSVG.appendChild(el);
}

// polygon helper
function polygon(points) {

    const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    el.setAttribute("points", points);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "#7dd3fc");
    el.setAttribute("stroke-width", "3");

    crystalSVG.appendChild(el);
}

// =========================
// CRYSTAL TYPES
// =========================

// water drop
function drawDrop() {
    circle(0, 0, 40);
}

// plate
function drawPlate() {
    polygon(`
        0,-80
        70,-40
        70,40
        0,80
        -70,40
        -70,-40
    `);
}

// needles
function drawNeedles() {
    line(0, -80, 0, 80, 6);
    line(-50, 0, 50, 0, 4);
}

// hexagon
function drawHexagon() {
    drawPlate();
    circle(0, 0, 8);
}

// dendrite (basic star)
function drawDendrite() {

    for (let angle = 0; angle < 360; angle += 60) {

        const rad = angle * Math.PI / 180;

        const x = Math.cos(rad) * 90;
        const y = Math.sin(rad) * 90;

        line(0, 0, x, y, 3);

        // small branch
        line(
            x * 0.5,
            y * 0.5,
            x * 0.6 + y * 0.1,
            y * 0.6 - x * 0.1,
            2
        );
    }
}

// columns
function drawColumns() {
    line(-20, -80, -20, 80, 6);
    line(20, -80, 20, 80, 6);
}