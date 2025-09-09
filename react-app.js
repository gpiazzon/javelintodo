const { useState, useEffect } = React;

// Access shared utilities exposed on the window
const { loadSettings, getTasksFor, motivationByDay } = window;

// Persistent state hook backed by localStorage
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

// Individual task item
function TaskItem({ id, label, checked, onChange, emoji }) {
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
      { htmlFor: id, className: "flex-1 flex items-center" },
      emoji && React.createElement("span", { className: "task-emoji mr-2" }, emoji),
      React.createElement("span", {
        dangerouslySetInnerHTML: { __html: label }
      })
    )
  );
}

// Group of related tasks
function TaskGroup({ title, note, items, dayKey, emoji, accent }) {
  return React.createElement(
    "div",
    { className: "bg-white rounded shadow mb-4" },
    React.createElement(
      "h2",
      {
        className: "text-white text-sm p-2 rounded-t",
        style: { background: accent }
      },
      title
    ),
    note &&
      React.createElement("p", { className: "italic text-gray-600 px-4 pt-2" }, note),
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
          onChange: handleChange,
          emoji
        });
      })
    )
  );
}

// Main application component
function App() {
  const [date, setDate] = useState(new Date());
  const [settings] = useState(() => (typeof loadSettings === "function" ? loadSettings() : {}));

  const dayKey = date.toLocaleDateString(undefined, { weekday: "long" }).toLowerCase();
  const tasks = typeof getTasksFor === "function" ? getTasksFor(dayKey, date) : {};
  const accent = (settings.colors && settings.colors[dayKey]) || "#3b82f6"; // default blue

  const nextDay = () => setDate((d) => new Date(d.getTime() + 86400000));
  const prevDay = () => setDate((d) => new Date(d.getTime() - 86400000));

  return React.createElement(
    "div",
    null,
    React.createElement(
      "header",
      {
        className: "flex items-center justify-between p-4 text-white shadow",
        style: { background: accent }
      },
      React.createElement(
        "h1",
        {
          className: "flex-1 flex items-center justify-center gap-4 text-lg"
        },
        React.createElement(
          "button",
          { onClick: prevDay, className: "text-xl", "aria-label": "Previous day" },
          "⬅️"
        ),
        date.toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric"
        }),
        React.createElement(
          "button",
          { onClick: nextDay, className: "text-xl", "aria-label": "Next day" },
          "➡️"
        )
      ),
      React.createElement(
        "a",
        { href: "settings.html", className: "ml-4 underline" },
        "Settings"
      )
    ),
    React.createElement(
      "main",
      { className: "p-4" },
      settings.showQuotes &&
        React.createElement(
          "p",
          { className: "text-center font-semibold mb-4" },
          (motivationByDay && motivationByDay[dayKey]) || ""
        ),
      Object.entries(tasks).map(([group, data]) =>
        React.createElement(TaskGroup, {
          key: group,
          title: group,
          note: data.note,
          items: data.items,
          dayKey,
          emoji: settings.emoji,
          accent
        })
      )
    )
  );
}

// Expose App for index.js
window.App = App;

