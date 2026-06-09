// =========================
// SIMPLE WEATHER ENGINE
// =========================

const FREEZING_POINT = 0;

// =========================
// MAIN WEATHER FUNCTION
// =========================

export function determineWeather(temp, humidity, pressure = 1) {

    // very dry air → clear
    if (humidity < 25) {
        return "clear";
    }

    // slightly humid → partly cloudy
    if (humidity < 45) {
        return "partly-cloudy";
    }

    // normal clouds
    if (humidity < 65) {

        if (temp <= FREEZING_POINT) {
            return "cold-clouds";
        }

        return "clouds";
    }

    // fog (high humidity + mild temps)
    if (humidity >= 85 && temp > -5 && temp < 15) {
        return "fog";
    }

    // snow conditions
    if (temp <= 0 && humidity >= 60) {
        return "snow";
    }

    // rain conditions
    if (temp > 0 && humidity >= 70) {
        return "rain";
    }

    // freezing rain (rare mixed condition)
    if (temp <= 0 && humidity >= 90) {
        return "freezing-rain";
    }

    return "clear";
}

// =========================
// CLOUD COUNT (optional visual helper)
// =========================

export function getCloudCount(humidity) {

    if (humidity < 25) return 0;
    if (humidity < 45) return 2;
    if (humidity < 65) return 4;
    if (humidity < 80) return 6;

    return 10;
}

// =========================
// PRECIPITATION INTENSITY
// =========================

export function getPrecipitationIntensity(humidity) {

    if (humidity < 60) return 0;
    if (humidity < 75) return 1;
    if (humidity < 90) return 2;

    return 3;
}

// =========================
// VISIBILITY MODEL
// =========================

export function getVisibility(weather) {

    switch (weather) {

        case "clear":
            return 100;

        case "partly-cloudy":
            return 90;

        case "clouds":
            return 80;

        case "rain":
            return 60;

        case "snow":
            return 50;

        case "fog":
            return 20;

        case "freezing-rain":
            return 30;

        default:
            return 100;
    }
}

// =========================
// DESCRIPTION (for UI text)
// =========================

export function getWeatherDescription(weather) {

    switch (weather) {

        case "clear":
            return "Clear sky with high visibility.";

        case "partly-cloudy":
            return "Scattered clouds with stable conditions.";

        case "clouds":
            return "Cloud-covered sky with high moisture.";

        case "rain":
            return "Liquid precipitation forming from clouds.";

        case "snow":
            return "Frozen precipitation forming snowflakes.";

        case "fog":
            return "Low visibility due to condensed moisture.";

        case "freezing-rain":
            return "Rain freezing on contact with surfaces.";

        default:
            return "Stable atmospheric conditions.";
    }
}

// =========================
// CLOUD TYPE (optional helper)
// =========================

export function getCloudType(temp, humidity) {

    if (humidity < 30) return "none";

    if (humidity < 50) return "cumulus";

    if (humidity < 75) return "stratus";

    if (temp <= 0) return "nimbostratus";

    return "cumulonimbus";
}