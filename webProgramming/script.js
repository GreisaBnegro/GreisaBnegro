
"use strict";

// USER GREETING
const user = "visitor"; // Change this to your username
document.getElementById("greeting").textContent =
  `Hi there, ${user}!`;

// CLOCK AND DATE
function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent =
    now.toLocaleTimeString("en-GB");

  document.getElementById("todayDate").textContent =
    now.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);

// CALENDAR
let monthOffset = 0;
const weekNames = ["M", "T", "W", "T", "F", "S", "S"];

function createMonth(date) {
  const month = document.createElement("div");
  month.className = "month";

  const title = document.createElement("h3");
  title.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  month.appendChild(title);

  const days = document.createElement("div");
  days.className = "days";

  for (const name of weekNames) {
    const cell = document.createElement("div");
    cell.className = "day weekday";
    cell.textContent = name;
    days.appendChild(cell);
  }

  const year = date.getFullYear();
  const monthNumber = date.getMonth();
  const firstDay = new Date(year, monthNumber, 1);
  const dayOffset = (firstDay.getDay() + 6) % 7;
  const totalDays =
    new Date(year, monthNumber + 1, 0).getDate();

  for (let i = 0; i < dayOffset; i++) {
    const empty = document.createElement("div");
    days.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = day;

    if (
      day === today.getDate() &&
      monthNumber === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("current-day");
    }

    days.appendChild(cell);
  }

  month.appendChild(days);
  return month;
}

function renderCalendar() {
  const container = document.getElementById("calendars");
  container.replaceChildren();

  const now = new Date();

  for (let i = -1; i <= 1; i++) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset + i,
      1
    );

    container.appendChild(createMonth(date));
  }
}

document.getElementById("prevMonth").onclick = () => {
  monthOffset--;
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  monthOffset++;
  renderCalendar();
};

document.getElementById("todayBtn").onclick = () => {
  monthOffset = 0;
  renderCalendar();
};

renderCalendar();

// TO-DO LIST
const STORAGE_KEY = "findly_tasks";

let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  tasks = Array.isArray(saved) ? saved : [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeButton(symbol, title, action, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = symbol;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.className = className;
  button.addEventListener("click", action);
  return button;
}

function moveTask(index, direction) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= tasks.length) return;

  [tasks[index], tasks[nextIndex]] =
    [tasks[nextIndex], tasks[index]];

  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.replaceChildren();

  const done = tasks.filter(task => task.done).length;
  document.getElementById("taskCount").textContent =
    `${done}/${tasks.length} done`;

  if (tasks.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "No tasks yet. Add your first task!";
    list.appendChild(message);
    return;
  }

  tasks.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "task";

    if (task.done) row.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Complete task");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const edit = makeButton("✎", "Edit task", () => {
      const updated = prompt("Edit task:", task.text);

      if (updated !== null && updated.trim()) {
        task.text = updated.trim();
        saveTasks();
        renderTasks();
      }
    });

    const up = makeButton("↑", "Move up", () => {
      moveTask(index, -1);
    });
    up.disabled = index === 0;

    const down = makeButton("↓", "Move down", () => {
      moveTask(index, 1);
    });
    down.disabled = index === tasks.length - 1;

    const remove = makeButton(
      "✕",
      "Delete task",
      () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      },
      "delete"
    );

    actions.append(edit, up, down, remove);
    row.append(checkbox, text, actions);
    list.appendChild(row);
  });
}

document.getElementById("taskForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) return;

    tasks.push({
      id: Date.now(),
      text,
      done: false
    });

    saveTasks();
    renderTasks();
    input.value = "";
  });

renderTasks();

// ITEM SEARCH - DEMO DATA
const items = [
  {
    name: "CR2032 battery",
    description: "Small 3V coin cell.",
    shop: "Electronics shop"
  },
  {
    name: "USB-C to HDMI adapter",
    description: "Check video output compatibility.",
    shop: "Computer accessories shop"
  },
  {
    name: "M4 machine screw",
    description: "Check thread size and length.",
    shop: "Hardware shop"
  }
];

document.getElementById("searchForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const query = document.getElementById("searchInput")
      .value.trim().toLowerCase();

    const results = document.getElementById("searchResults");
    results.replaceChildren();

    if (!query) return;

    const matches = items.filter(item =>
      `${item.name} ${item.description} ${item.shop}`
        .toLowerCase()
        .includes(query)
    );

    if (matches.length === 0) {
      const message = document.createElement("p");
      message.className = "empty-message";
      message.textContent = "No matching demo items found.";
      results.appendChild(message);
      return;
    }

    for (const item of matches) {
      const card = document.createElement("div");
      card.className = "search-result";

      const heading = document.createElement("h3");
      heading.textContent = item.name;

      const description = document.createElement("p");
      description.textContent = item.description;

      const link = document.createElement("a");
      link.textContent = `Find ${item.shop} on Google Maps ↗`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.href = "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(item.shop);

      card.append(heading, description, link);
      results.appendChild(card);
    }
  });
