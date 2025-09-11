// react-app.js - UMD-friendly React app using only React.createElement
// Globals: React, loadSettings, confetti

const { useState, useEffect, useMemo, useCallback } = React;

// --------------------------------------------------------------
// Persistent state backed by localStorage
// --------------------------------------------------------------
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

// --------------------------------------------------------------
// Streak tracker hook
// --------------------------------------------------------------
function useStreakTracker() {
  const today = new Date().toISOString().split("T")[0];
  const [streak, setStreak] = usePersistentState("streak", 0);
  const [lastDate, setLastDate] = usePersistentState("streakLastDate", null);
  const [history, setHistory] = usePersistentState("streakHistory", {});

  const markComplete = useCallback(() => {
    if (history[today]) return; // already counted
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const nextStreak = lastDate === yesterday ? streak + 1 : 1;
    const newHistory = { ...history, [today]: true };
    setHistory(newHistory);
    setStreak(nextStreak);
    setLastDate(today);
  }, [history, lastDate, streak, today, setHistory, setLastDate, setStreak]);

  return { streak, history, markComplete };
}

// --------------------------------------------------------------
// Tailwind primitives
// --------------------------------------------------------------
function Button(props) {
  const { className = "", ...rest } = props;
  return React.createElement("button", {
    className:
      "px-3 py-2 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors " +
      className,
    ...rest,
  });
}

function Card(props) {
  return React.createElement("div", {
    className: "bg-white rounded shadow p-4 flex flex-col gap-4 " + (props.className || ""),
    ...props,
  });
}

function Checkbox(props) {
  return React.createElement("input", {
    type: "checkbox",
    className:
      "mr-3 h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 transition",
    ...props,
  });
}

function Label(props) {
  return React.createElement("label", {
    className: "select-none " + (props.className || ""),
    ...props,
  });
}

// --------------------------------------------------------------
// Task components
// --------------------------------------------------------------
function TaskItem({ id, label, checked, onChange, emoji }) {
  return React.createElement(
    "li",
    {
      className:
        "flex items-center rounded border p-2 bg-gray-50 transition-all list-none " +
        (checked ? "opacity-60 line-through" : "hover:bg-gray-100"),
    },
    React.createElement(Checkbox, {
      id,
      checked,
      onChange: (e) => onChange(e.target.checked),
    }),
    React.createElement(
      Label,
      { htmlFor: id, className: "flex-1 flex items-center" },
      emoji && React.createElement("span", { className: "mr-2" }, emoji),
      React.createElement("span", null, label)
    )
  );
}

function TaskGroup({ title, note, items, dayKey, emoji, accent, onItemChange }) {
  return React.createElement(
    Card,
    null,
    React.createElement("h2", { className: "font-semibold mb-2", style: { color: accent } }, title),
    note && React.createElement("p", { className: "italic text-gray-600 text-sm" }, note),
    React.createElement(
      "ul",
      { className: "task-list flex flex-col gap-2" },
      items.map((task, i) => {
        const id = `${dayKey}-${title}-${i}`;
        const [checked, setChecked] = usePersistentState(id, false);
        const handle = (val) => {
          setChecked(val);
          onItemChange();
        };
        return React.createElement(TaskItem, {
          key: i,
          id,
          label: task,
          checked,
          onChange: handle,
          emoji,
        });
      })
    )
  );
}

// --------------------------------------------------------------
// Streak history calendar overlay
// --------------------------------------------------------------
function StreakHistory({ history, onClose }) {
  const today = new Date();
  const cells = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    const completed = !!history[key];
    cells.push(
      React.createElement(
        "div",
        {
          key,
          className:
            "h-8 w-8 flex items-center justify-center rounded text-sm " +
            (completed ? "bg-green-300 text-green-800" : "bg-gray-200 text-gray-500"),
        },
        completed ? "✔️" : d.getDate()
      )
    );
  }

  return React.createElement(
    "div",
    { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-20" },
    React.createElement(
      "div",
      { className: "bg-white rounded p-4 w-80 shadow" },
      React.createElement("h3", { className: "text-center font-bold mb-2" }, "Streak History"),
      React.createElement("div", { className: "grid grid-cols-7 gap-2" }, cells),
      React.createElement(Button, { className: "mt-4 w-full", onClick: onClose }, "Close")
    )
  );
}

// --------------------------------------------------------------
// Task Loader from workoutConfig
// --------------------------------------------------------------
function getTasksForDay(dayKey) {
  const cfg = JSON.parse(localStorage.getItem("workoutConfig") || "{}");
  const slots = cfg.schedule?.[dayKey] || [];

  let workouts = {};
  slots.forEach((slot) => {
    const [type, sel] = slot.split(":");
    const list = cfg.types?.[type] || [];
    let workout;
    if (sel === "random") {
      if (list.length > 0) workout = list[Math.floor(Math.random() * list.length)];
    } else {
      workout = list[parseInt(sel, 10)];
    }
    if (workout) {
      workouts[workout.title] = { note: workout.note || "", items: workout.items || [] };
    }
  });

  if (cfg.tendon_snacks) {
    workouts[cfg.tendon_snacks.title] = {
      note: cfg.tendon_snacks.note || "",
      items: cfg.tendon_snacks.items || [],
    };
  }

  return workouts;
}

// --------------------------------------------------------------
// Main application component
// --------------------------------------------------------------
function App() {
  const [date, setDate] = useState(new Date());
  const [settings] = useState(() => (typeof loadSettings === "function" ? loadSettings() : {}));
  const [showHistory, setShowHistory] = useState(false);

  const dayKey = date.toLocaleDateString(undefined, { weekday: "long" }).toLowerCase();
  const tasks = getTasksForDay(dayKey);
  const accent = (settings.colors && settings.colors[dayKey]) || "#3b82f6";

  const { streak, history, markComplete } = useStreakTracker();

  // collect all task ids for completion check
  const taskIds = useMemo(() => {
    const ids = [];
    Object.entries(tasks).forEach(([group, data]) => {
      data.items.forEach((_, i) => {
        ids.push(`${dayKey}-${group}-${i}`);
      });
    });
    return ids;
  }, [tasks, dayKey]);

  const checkAllComplete = useCallback(() => {
    if (!taskIds.length) return;
    const allDone = taskIds.every((id) => JSON.parse(localStorage.getItem(id)));
    if (allDone) {
      markComplete();
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [taskIds, markComplete]);

  const nextDay = () => setDate((d) => new Date(d.getTime() + 86400000));
  const prevDay = () => setDate((d) => new Date(d.getTime() - 86400000));

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const groups = Object.entries(tasks);

  return React.createElement(
    "div",
    null,
    // Header
    React.createElement(
      "header",
      { className: "sticky top-0 z-10 shadow text-white", style: { backgroundColor: accent } },
      React.createElement(
        "div",
        { className: "flex items-center px-4 py-2" },
        React.createElement(
          Button,
          {
            className:
              "bg-transparent text-white p-2 hover:bg-white/20 rounded flex items-center gap-1 font-bold",
            onClick: () => setShowHistory(true),
          },
          "🔥",
          React.createElement("span", null, streak)
        ),
        React.createElement(
          "h1",
          { className: "flex-grow text-center font-bold text-lg" },
          "Jav Trainer"
        ),
        React.createElement(
          "div",
          { className: "flex items-center justify-end w-24" },
          React.createElement(
            "a",
            { href: "settings.html", className: "p-2 text-xl rounded hover:bg-white/20" },
            "⚙️"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "flex items-center px-4 py-2" },
        React.createElement(Button, { className: "bg-transparent text-white p-2", onClick: prevDay }, "⬅️"),
        React.createElement("h2", { className: "flex-grow text-center font-bold text-lg" }, dateLabel),
        React.createElement(Button, { className: "bg-transparent text-white p-2", onClick: nextDay }, "➡️")
      )
    ),

    // Tasks
    groups.length
      ? React.createElement(
          "main",
          { key: dayKey, className: "p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2" },
          groups.map(([group, data]) =>
            React.createElement(TaskGroup, {
              key: group,
              title: group,
              note: data.note,
              items: data.items,
              dayKey,
              emoji: settings.emoji,
              accent,
              onItemChange: checkAllComplete,
            })
          )
        )
      : React.createElement("div", { className: "p-8 text-center text-2xl" }, "🏹 Rest day!"),

    showHistory &&
      React.createElement(StreakHistory, { history, onClose: () => setShowHistory(false) })
  );
}

// expose App globally
window.App = App;
