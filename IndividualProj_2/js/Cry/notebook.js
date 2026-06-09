// =========================
// SIMPLE SCIENTIFIC NOTEBOOK
// =========================

let observations = [];

let notebookContainer;
let notebookCount;

// =========================
// INIT
// =========================

export function initNotebook() {

    notebookContainer =
        document.getElementById("labNotebook");

    notebookCount =
        document.getElementById("notebookCount");

    renderNotebook();
}

// =========================
// RECORD OBSERVATION
// =========================

export function recordObservation({
    time,
    temperature,
    phase,
    weather,
    crystal,
    note = ""
}) {

    const entry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleString(),
        time: Number(time).toFixed(2),
        temperature: Number(temperature).toFixed(2),
        phase,
        weather,
        crystal,
        note
    };

    observations.push(entry);

    renderNotebook();

    return entry;
}

// =========================
// DELETE ENTRY
// =========================

export function deleteObservation(id) {

    observations =
        observations.filter(e => e.id !== id);

    renderNotebook();
}

// =========================
// CLEAR NOTEBOOK
// =========================

export function clearNotebook() {

    observations = [];

    renderNotebook();
}

// =========================
// GET ALL
// =========================

export function getObservations() {
    return [...observations];
}

// =========================
// SEARCH
// =========================

export function searchNotebook(query) {

    const term = query.toLowerCase();

    return observations.filter(e =>
        e.note.toLowerCase().includes(term) ||
        e.phase.toLowerCase().includes(term) ||
        e.weather.toLowerCase().includes(term) ||
        e.crystal.toLowerCase().includes(term)
    );
}

// =========================
// EXPORT TXT
// =========================

export function exportNotes() {

    if (observations.length === 0) {
        alert("No observations recorded.");
        return;
    }

    let content =
`=== SIMULATION NOTEBOOK ===
Generated: ${new Date().toLocaleString()}
\n`;

    observations.forEach((e, i) => {

        content += `
Entry ${i + 1}
Time: ${e.time} min
Temperature: ${e.temperature} °C
Phase: ${e.phase}
Weather: ${e.weather}
Crystal: ${e.crystal}
Note: ${e.note}
-------------------------
`;
    });

    downloadFile(content, "simulation_notes.txt", "text/plain");
}

// =========================
// EXPORT JSON
// =========================

export function exportJSON() {

    const json = JSON.stringify(observations, null, 2);

    downloadFile(json, "simulation_notes.json", "application/json");
}

// =========================
// DOWNLOAD HELPER
// =========================

function downloadFile(content, filename, type) {

    const blob = new Blob([content], { type });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

// =========================
// RENDER NOTEBOOK
// =========================

function renderNotebook() {

    if (!notebookContainer) return;

    notebookContainer.innerHTML = "";

    observations
        .slice()
        .reverse()
        .forEach(entry => {

            const card = document.createElement("div");

            card.className = "noteEntry";

            card.innerHTML = `
                <div>
                    <strong>${entry.temperature} °C</strong>
                    <button class="deleteBtn" data-id="${entry.id}">
                        ✖
                    </button>
                </div>

                <div>Time: ${entry.time} min</div>
                <div>Phase: ${entry.phase}</div>
                <div>Weather: ${entry.weather}</div>
                <div>Crystal: ${entry.crystal}</div>
                <div>Recorded: ${entry.timestamp}</div>
                <div>Note: ${entry.note}</div>
            `;

            notebookContainer.appendChild(card);
        });

    // delete buttons
    notebookContainer
        .querySelectorAll(".deleteBtn")
        .forEach(btn => {

            btn.addEventListener("click", () => {
                deleteObservation(btn.dataset.id);
            });
        });

    // update counter if exists
    if (notebookCount) {
        notebookCount.textContent = observations.length;
    }
}

// =========================
// AUTO RECORD (optional)
// =========================

export function autoRecord(data) {

    recordObservation({
        ...data,
        note: "Auto-generated observation"
    });
}