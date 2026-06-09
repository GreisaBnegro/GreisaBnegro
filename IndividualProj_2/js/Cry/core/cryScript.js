// =========================
// IMPORTS
// =========================

import {
    calculateTemperature,
    determinePhase
} from "./thermodynamics.js";

import {
    determineWeather
} from "../weather/weather.js";

import {
    getCrystalType,
    generateSnowflake,
    initSnowCrystal
} from "../weather/snowCrystal.js";

import {
    initRenderer,
    renderScene
} from "../rendering/renderer.js";

import {
    initGraph,
    drawGraph,
    addHistoryPoint,
    clearGraph
} from "../rendering/graph.js";

import {
    initMolecules,
    drawMolecules
} from "../rendering/molecules.js";

import {
    initNotebook,
    recordObservation,
    exportNotes
} from "../notebook.js";

// =========================
// DOM ELEMENTS
// =========================

const initialTemp =
    document.getElementById("initialTemp");

const ambientTemp =
    document.getElementById("ambientTemp");

const pressure =
    document.getElementById("pressure");

const humidity =
    document.getElementById("humidity");

const material =
    document.getElementById("material");

const insulation =
    document.getElementById("insulation");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");

const recordBtn =
    document.getElementById("recordBtn");

const exportBtn =
    document.getElementById("exportBtn");

const timeSlider =
    document.getElementById("timeSlider");

// =========================
// DISPLAY ELEMENTS
// =========================

const currentTempDisplay =
    document.getElementById("currentTemp");

const phaseDisplay =
    document.getElementById("phaseDisplay");

const weatherDisplay =
    document.getElementById("weatherDisplay");

const crystalDisplay =
    document.getElementById("crystalDisplay");

const scientificNotes =
    document.getElementById("scientificNotes");

const timeDisplay =
    document.getElementById("timeDisplay");

// =========================
// SIMULATION STATE
// =========================

let running = false;
let paused = false;

let currentTime = 0;

let currentTemperature = 0;
let currentPhase = "solid";
let currentWeather = "clear";

const TIME_STEP = 0.05;

// =========================
// HELPERS
// =========================

function getCoolingRate() {

    const materialRate =
        Number(material.value);

    const thickness =
        Number(insulation.value);

    return (
        materialRate /
        Math.max(thickness, 1)
    );
}

// =========================
// UPDATE SIMULATION
// =========================

function updateSimulation() {

    const T0 =
        Number(initialTemp.value);

    const Ta =
        Number(ambientTemp.value);

    const k =
        getCoolingRate();

    currentTemperature =
        calculateTemperature(
            T0,
            Ta,
            k,
            currentTime
        );

    currentPhase =
        determinePhase(
            currentTemperature,
            Number(pressure.value)
        );

    currentWeather =
        determineWeather(
            currentTemperature,
            Number(humidity.value),
            Number(pressure.value)
        );

    const crystalType =
        getCrystalType(
            currentTemperature
        );

    // ---------------------
    // DISPLAYS
    // ---------------------

    currentTempDisplay.textContent =
        `${currentTemperature.toFixed(1)} °C`;

    phaseDisplay.textContent =
        currentPhase;

    weatherDisplay.textContent =
        currentWeather;

    crystalDisplay.textContent =
        crystalType;

    timeDisplay.textContent =
        `Time: ${currentTime.toFixed(1)} min`;

    // ---------------------
    // NOTES
    // ---------------------

    scientificNotes.innerHTML = `
        <b>Temperature:</b>
        ${currentTemperature.toFixed(1)} °C
        <br><br>

        <b>Phase:</b>
        ${currentPhase}
        <br><br>

        <b>Weather:</b>
        ${currentWeather}
        <br><br>

        <b>Crystal:</b>
        ${crystalType}
    `;

    // ---------------------
    // VISUALIZATION
    // ---------------------

    renderScene({
        temp: currentTemperature,
        phase: currentPhase,
        weather: currentWeather
    });

    generateSnowflake(
        currentTemperature
    );

    drawMolecules(
        currentPhase,
        currentTemperature
    );

    addHistoryPoint(
        currentTime,
        currentTemperature
    );

    drawGraph();

    timeSlider.value =
        Math.min(
            Number(timeSlider.max),
            currentTime
        );
}

// =========================
// ANIMATION LOOP
// =========================

function animationLoop() {

    if (
        running &&
        !paused
    ) {

        currentTime +=
            TIME_STEP;

        updateSimulation();
    }

    requestAnimationFrame(
        animationLoop
    );
}

// =========================
// BUTTONS
// =========================

function startSimulation() {

    running = true;
    paused = false;

    pauseBtn.textContent =
        "⏸ Pause";
}

function pauseSimulation() {

    if (!running) return;

    paused = !paused;

    pauseBtn.textContent =
        paused
            ? "▶ Resume"
            : "⏸ Pause";
}

function resetSimulation() {

    running = false;
    paused = false;

    currentTime = 0;

    clearGraph();

    currentTempDisplay.textContent =
        "-- °C";

    phaseDisplay.textContent =
        "--";

    weatherDisplay.textContent =
        "--";

    crystalDisplay.textContent =
        "--";

    scientificNotes.textContent =
        "Ready.";

    timeDisplay.textContent =
        "Time: 0 min";

    timeSlider.value = 0;

    pauseBtn.textContent =
        "⏸ Pause";

    updateSimulation();
}

// =========================
// NOTEBOOK
// =========================

function saveObservation() {

    recordObservation({

        time:
            currentTime,

        temperature:
            currentTemperature,

        phase:
            currentPhase,

        weather:
            currentWeather,

        crystal:
            crystalDisplay.textContent,

        note:
            "Manual observation"
    });
}

// =========================
// EVENT LISTENERS
// =========================

startBtn.addEventListener(
    "click",
    startSimulation
);

pauseBtn.addEventListener(
    "click",
    pauseSimulation
);

resetBtn.addEventListener(
    "click",
    resetSimulation
);

recordBtn.addEventListener(
    "click",
    saveObservation
);

exportBtn.addEventListener(
    "click",
    exportNotes
);

// -------------------------
// PRESSURE
// -------------------------

pressure.addEventListener(
    "input",
    () => {

        document.getElementById(
            "pressureValue"
        ).textContent =
            `${pressure.value} atm`;

        updateSimulation();
    }
);

// -------------------------
// HUMIDITY
// -------------------------

humidity.addEventListener(
    "input",
    () => {

        document.getElementById(
            "humidityValue"
        ).textContent =
            `${humidity.value}%`;

        updateSimulation();
    }
);

// -------------------------
// TIMELINE
// -------------------------

timeSlider.addEventListener(
    "input",
    () => {

        currentTime =
            Number(
                timeSlider.value
            );

        updateSimulation();
    }
);

// =========================
// INITIALIZATION
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        try {

            initRenderer();

            initGraph(
                "graph"
            );

            initMolecules(
                "moleculeCanvas"
            );

            initSnowCrystal();

            initNotebook();

            updateSimulation();

            animationLoop();

            console.log(
                "Water Phase Simulator Loaded"
            );

        } catch (error) {

            console.error(
                "Initialization Error:",
                error
            );
        }
    }
);