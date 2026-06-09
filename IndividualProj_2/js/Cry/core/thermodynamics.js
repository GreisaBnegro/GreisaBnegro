// =========================
// SIMPLE THERMODYNAMICS ENGINE
// =========================

// Newton's Law of Cooling
// T(t) = Ta + (T0 - Ta) * e^(-kt)

export function calculateTemperature(
    initialTemp,
    ambientTemp,
    k,
    time
) {
    return (
        ambientTemp +
        (initialTemp - ambientTemp) *
        Math.exp(-k * time)
    );
}

// =========================
// BOILING POINT (PRESSURE EFFECT)
// =========================

export function getBoilingPoint(pressure) {
    // simple approximation:
    // higher pressure → higher boiling point
    return 100 + (pressure - 1) * 20;
}

// =========================
// PHASE DETECTION
// =========================

export function determinePhase(
    temp,
    pressure = 1
) {
    const boilingPoint =
        getBoilingPoint(pressure);

    // SOLID
    if (temp < 0) {
        return "solid";
    }

    // LIQUID
    if (temp >= 0 && temp < boilingPoint) {
        return "liquid";
    }

    // GAS
    return "gas";
}

// =========================
// OPTIONAL SIMPLE CLAMP
// =========================

export function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}