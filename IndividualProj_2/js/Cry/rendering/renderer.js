// =========================
// SIMPLE SCENE RENDERER
// =========================

let backgroundLayer;
let cloudLayer;
let weatherLayer;
let waterLayer;
let phaseLayer;
let steamLayer;
let snowLayer;

// =========================
// INIT
// =========================

export function initRenderer() {

    backgroundLayer =
        document.getElementById("backgroundLayer");

    cloudLayer =
        document.getElementById("cloudLayer");

    weatherLayer =
        document.getElementById("weatherLayer");

    waterLayer =
        document.getElementById("waterLayer");

    phaseLayer =
        document.getElementById("phaseLayer");

    steamLayer =
        document.getElementById("steamLayer");

    snowLayer =
        document.getElementById("snowLayer");
}

// =========================
// MAIN RENDER
// =========================

export function renderScene({ temp, phase, weather }) {

    clearLayers();
    updateBackground(temp);
    renderPhase(phase);
    renderWeather(weather);
}

// =========================
// CLEAR LAYERS
// =========================

function clearLayers() {

    if (cloudLayer) cloudLayer.innerHTML = "";
    if (weatherLayer) weatherLayer.innerHTML = "";
    if (phaseLayer) phaseLayer.innerHTML = "";
    if (steamLayer) steamLayer.innerHTML = "";
    if (snowLayer) snowLayer.innerHTML = "";
    if (waterLayer) waterLayer.innerHTML = "";
}

// =========================
// BACKGROUND
// =========================

function updateBackground(temp) {

    if (!backgroundLayer) return;

    if (temp < 0) {
        backgroundLayer.style.background =
            "linear-gradient(#dff6ff, #a5d8ff)";
    }

    else if (temp < 100) {
        backgroundLayer.style.background =
            "linear-gradient(#87ceeb, #dff6ff)";
    }

    else {
        backgroundLayer.style.background =
            "linear-gradient(#ffd8a8, #ffe8cc)";
    }
}

// =========================
// PHASE VISUALS
// =========================

function renderPhase(phase) {

    if (!phaseLayer || !steamLayer || !waterLayer) return;

    switch (phase) {

        case "solid":
            renderIce();
            break;

        case "liquid":
            renderWater();
            break;

        case "gas":
            renderSteam();
            break;
    }
}

// ICE
function renderIce() {

    for (let i = 0; i < 15; i++) {
        createParticle(phaseLayer, "🧊", "ice");
    }
}

// WATER
function renderWater() {

    for (let i = 0; i < 8; i++) {

        const wave = document.createElement("div");
        wave.textContent = "🌊";

        wave.style.position = "absolute";
        wave.style.bottom = "20px";
        wave.style.left = `${i * 12}%`;
        wave.style.fontSize = "40px";

        waterLayer.appendChild(wave);
    }
}

// STEAM
function renderSteam() {

    for (let i = 0; i < 12; i++) {
        createParticle(steamLayer, "🌫️", "steam");
    }
}

// =========================
// WEATHER
// =========================

function renderWeather(weather) {

    switch (weather) {

        case "clouds":
            renderClouds();
            break;

        case "rain":
            renderClouds();
            renderRain();
            break;

        case "snow":
            renderClouds();
            renderSnow();
            break;

        case "fog":
            renderFog();
            break;

        default:
            renderClouds();
            break;
    }
}

// CLOUDS
function renderClouds() {

    for (let i = 0; i < 4; i++) {
        createParticle(cloudLayer, "☁️", "cloud");
    }
}

// RAIN
function renderRain() {

    for (let i = 0; i < 30; i++) {
        createParticle(weatherLayer, "💧", "rain");
    }
}

// SNOW
function renderSnow() {

    for (let i = 0; i < 25; i++) {
        createParticle(snowLayer, "❄️", "snow");
    }
}

// FOG
function renderFog() {

    for (let i = 0; i < 15; i++) {
        createParticle(weatherLayer, "🌫️", "fog");
    }
}

// =========================
// PARTICLE HELPER
// =========================

function createParticle(parent, emoji, className) {

    if (!parent) return;

    const el = document.createElement("div");

    el.textContent = emoji;
    el.className = className;

    el.style.position = "absolute";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * 100 + "%";

    parent.appendChild(el);
}