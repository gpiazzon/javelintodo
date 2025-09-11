// --- Helpers for saving/loading ---
function loadConfig() {
  try {
    return JSON.parse(localStorage.getItem("workoutConfig") || "{}");
  } catch {
    return {};
  }
}

function saveConfig(cfg) {
  localStorage.setItem("workoutConfig", JSON.stringify(cfg));
}

// --- State ---
const config = loadConfig();
config.types = config.types || {};      // { Gym: [ {title, items: []} ], WOD: [...] }
config.schedule = config.schedule || {}; // { monday: [ "Gym:Session1", "WOD:random" ], ... }

// --- UI Elements ---
const workoutTypesDiv = document.getElementById("workout-types");
const addTypeBtn = document.getElementById("add-type-btn");
const weeklySplitDiv = document.getElementById("weekly-split");
const saveScheduleBtn = document.getElementById("save-schedule-btn");

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

// --- Render Workout Library ---
function renderWorkoutTypes() {
  workoutTypesDiv.innerHTML = "";
  Object.entries(config.types).forEach(([type, workouts]) => {
    const container = document.createElement("div");
    container.className = "border rounded p-3";

    const title = document.createElement("h3");
    title.className = "font-semibold mb-2";
    title.textContent = type;
    container.appendChild(title);

    const list = document.createElement("div");
    workouts.forEach((w, i) => {
      const box = document.createElement("div");
      box.className = "border rounded p-2 mb-2 bg-gray-50";
      box.innerHTML = `
        <input type="text" value="${w.title}" class="w-full font-medium mb-1 border rounded p-1 workout-title"/>
        <textarea rows="3" class="w-full border rounded p-1 workout-items">${w.items.join("\n")}</textarea>
      `;
      list.appendChild(box);

      // Save edits on blur
      box.querySelector(".workout-title").addEventListener("blur", e => {
        w.title = e.target.value;
        saveConfig(config);
        renderWeeklySplit();
      });
      box.querySelector(".workout-items").addEventListener("blur", e => {
        w.items = e.target.value.split("\n").filter(Boolean);
        saveConfig(config);
      });
    });
    container.appendChild(list);

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Workout";
    addBtn.className = "px-2 py-1 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    addBtn.onclick = () => {
      config.types[type].push({ title: "New Workout", items: [] });
      saveConfig(config);
      renderWorkoutTypes();
      renderWeeklySplit();
    };
    container.appendChild(addBtn);

    workoutTypesDiv.appendChild(container);
  });
}

addTypeBtn.onclick = () => {
  const typeName = prompt("Enter workout type (e.g. Gym, WOD, Mobility, Tendon):");
  if (!typeName) return;
  if (!config.types[typeName]) config.types[typeName] = [];
  saveConfig(config);
  renderWorkoutTypes();
  renderWeeklySplit();
};

// --- Render Weekly Split ---
function renderWeeklySplit() {
  weeklySplitDiv.innerHTML = "";
  days.forEach(day => {
    const card = document.createElement("div");
    card.className = "border rounded p-3 bg-gray-50";
    const title = document.createElement("h3");
    title.className = "font-semibold mb-2 capitalize";
    title.textContent = day;
    card.appendChild(title);

    const slotList = document.createElement("div");
    slotList.className = "space-y-2";

    (config.schedule[day] || []).forEach((slot, idx) => {
      const [type, sel] = slot.split(":");
      const slotDiv = document.createElement("div");
      slotDiv.className = "flex gap-2 items-center";

      // Type select
      const typeSel = document.createElement("select");
      typeSel.className = "border rounded p-1 flex-1";
      Object.keys(config.types).forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        if (t === type) opt.selected = true;
        typeSel.appendChild(opt);
      });

      // Workout select
      const wSel = document.createElement("select");
      wSel.className = "border rounded p-1 flex-1";
      const randomOpt = document.createElement("option");
      randomOpt.value = "random";
      randomOpt.textContent = "Random from type";
      wSel.appendChild(randomOpt);

      if (config.types[type]) {
        config.types[type].forEach((w, wi) => {
          const opt = document.createElement("option");
          opt.value = wi;
          opt.textContent = w.title;
          if (sel == wi) opt.selected = true;
          wSel.appendChild(opt);
        });
      }

      // Save changes
      typeSel.onchange = () => {
        config.schedule[day][idx] = `${typeSel.value}:random`;
        saveConfig(config);
        renderWeeklySplit();
      };
      wSel.onchange = () => {
        config.schedule[day][idx] = `${typeSel.value}:${wSel.value}`;
        saveConfig(config);
      };

      slotDiv.appendChild(typeSel);
      slotDiv.appendChild(wSel);

      // Remove slot
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✕";
      removeBtn.className = "px-2 py-1 bg-red-500 text-white rounded";
      removeBtn.onclick = () => {
        config.schedule[day].splice(idx, 1);
        saveConfig(config);
        renderWeeklySplit();
      };
      slotDiv.appendChild(removeBtn);

      slotList.appendChild(slotDiv);
    });

    // Add slot button
    const addSlotBtn = document.createElement("button");
    addSlotBtn.textContent = "+ Add Slot";
    addSlotBtn.className = "px-2 py-1 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600";
    addSlotBtn.onclick = () => {
      if (!config.schedule[day]) config.schedule[day] = [];
      const firstType = Object.keys(config.types)[0] || "Gym";
      config.schedule[day].push(`${firstType}:random`);
      saveConfig(config);
      renderWeeklySplit();
    };

    card.appendChild(slotList);
    card.appendChild(addSlotBtn);
    weeklySplitDiv.appendChild(card);
  });
}

saveScheduleBtn.onclick = () => {
  saveConfig(config);
  alert("Schedule saved!");
};

// --- Init ---
renderWorkoutTypes();
renderWeeklySplit();
