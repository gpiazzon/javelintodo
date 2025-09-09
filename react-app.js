const { useState, useEffect } = React;

// Simple circle icon component
function Circle({ size = 16 }) {
  return React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" })
  );
}

// Default tasks for each day
const defaultTasksByDay = {
  monday: {
    "🌅 AM Mobility (5–10 min)": {
      note: "Brief morning flow to loosen spine and shoulders",
      items: ["1–2 sets Cat–Cows", "1–2 sets Thoracic rotations", "1–2 sets Arm circles", "1–2 sets Band pull-aparts"]
    },
    "☀️ PM Javelin Session": {
      note: "Dynamic warm-up, technique drills, run-up & throws",
      items: [
        "Dynamic warm-up: jog, skips, arm/leg swings",
        "Throwing drills: running crossovers, elastic band drills",
        "Lead with hip & chest, relaxed arm until final whip",
        "Firm block leg and good shoulder layback",
        "Eyes on target through release"
      ]
    },
    "🛠️ Post-Throw Arm Care": {
      note: "Cooldown to recover shoulder and elbow",
      items: [
        "Band pull-aparts 2×15–20",
        "External rotations 2×15 each arm",
        "High-rep band curls & triceps ext 1×50–100",
        "Sleeper stretch",
        "Forearm & wrist stretches",
        "Gentle spinal twist / thrower’s stretch"
      ]
    }
  },
  // … (keep the rest of your tasks exactly as before)
};

const motivationByDay = {
  monday: "New week. New opportunities!",
  tuesday: "Consistency compounds results.",
  wednesday: "Halfway done—bring the heat!",
  thursday: "Blast off with technique.",
  friday: "Leave it all on the field.",
  saturday: "Unlock your body’s potential.",
  sunday: "Rest today, dominate tomorrow."
};

// Persistent state hook (localStorage-backed)
function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// Task item component
function TaskItem({ id, label, checked, onChange }) {
  return React.createElement(
    "li",
    {
      className: `flex items-center border-b last:border-0 p-3 ${
        checked ? "opacity-60" : ""
      }`
    },
    React.createElement("input", {
      type: "checkbox",
      className: "mr-2 h-5 w-5 accent-blue-500",
      id,
      checked,
      onChange: (e) => onChange(e.target.checked)
    }),
    React.createElement(
      "label",
      { htmlFor: id, className: "flex-1 flex items-center gap-2" },
      React.createElement(Circle, { size: 16 }),
      label
    )
  );
}

// Task group (a set of items for a category)
function TaskGroup({ title, note, items, dayKey }) {
  return React.createElement(
    "div",
    { className: "bg-white rounded shadow mb-4" },
    React.createElement("h2", { className: "bg-blue-500 text-white text-sm p-2 rounded-t" }, title),
    note && React.createElement("p", { className: "italic text-gray-600 px-4 pt-2" }, note),
    React.createElement(
      "ul",
      null,
      items.map((task, i) => {
        const id = `${dayKey}-${title}-${i}`;
        const [checked, setChecked] = usePersistentState(id, false);
        const handleChange = (val) => {
          setChecked(val);
          if (val && typeof confetti === "function") {
            confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
          }
        };
        return React.createElement(TaskItem, {
          key: i,
          id,
          label: task,
          checked,
          onChange: handleChange
        });
      })
    )
  );
}

// Main App
function App() {
  const [date, setDate] = useState(new Date());
  const dayKey = date.toLocaleDateString(undefined, { weekday: "long" }).toLowerCase();
  const tasks = defaultTasksByDay[dayKey] || {};

  const nextDay = () => setDate((d) => new Date(d.getTime() + 86400000));
  const prevDay = () => setDate((d) => new Date(d.getTime() - 86400000));

  return React.createElement(
    "div",
    null,
    // Header
    React.createElement(
      "header",
      { className: "flex items-center justify-between p-4 bg-blue-500 text-white shadow" },
      React.createElement("button", { onClick: prevDay, className: "text-xl" }, "⬅️"),
      React.createElement(
        "h1",
        { className: "text-lg flex-1 text-center" },
        date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
      ),
      React.createElement("button", { onClick: nextDay, className: "text-xl" }, "➡️")
    ),
    // Main content
    React.createElement(
      "main",
      { className: "p-4" },
      React.createElement("p", { className: "text-center font-semibold mb-4" }, motivationByDay[dayKey] || ""),
      Object.entries(tasks).map(([group, data]) =>
        React.createElement(TaskGroup, {
          key: group,
          title: group,
          note: data.note,
          items: data.items,
          dayKey
        })
      )
    )
  );
}

// Expose globally for index.js
window.App = App;
