// react-app.js - UMD-friendly React app using only React.createElement
// Globals: React, loadSettings, getTasksFor, motivationByDay, confetti

const { useState, useEffect, useMemo, useCallback } = React;

// --------------------------------------------------------------
// Persistent state backed by localStorage
// --------------------------------------------------------------
function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(function () {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  useEffect(function () {
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

  const markComplete = useCallback(function () {
    if (history[today]) return; // already counted for today
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const nextStreak = lastDate === yesterday ? streak + 1 : 1;
    const newHistory = Object.assign({}, history, { [today]: true });
    setHistory(newHistory);
    setStreak(nextStreak);
    setLastDate(today);
  }, [history, lastDate, streak, today, setHistory, setLastDate, setStreak]);

  return { streak, history, markComplete };
}

// --------------------------------------------------------------
// Basic shadcn/ui like primitives (Tailwind styled)
// --------------------------------------------------------------
function Button(props) {
  const { className = "", ...rest } = props;
  return React.createElement(
    "button",
    Object.assign({
      className:
        "px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors " +
        className,
    }, rest)
  );
}

function Card(props) {
  const { className = "", ...rest } = props;
  return React.createElement(
    "div",
    Object.assign({
      className:
        "bg-white rounded-lg shadow p-4 flex flex-col gap-2 " + className,
    }, rest)
  );
}

function Checkbox(props) {
  return React.createElement(
    "input",
    Object.assign(
      {
        type: "checkbox",
        className:
          "mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
      },
      props
    )
  );
}

function Label(props) {
  const { className = "", ...rest } = props;
  return React.createElement(
    "label",
    Object.assign(
      {
        className: "select-none " + className,
      },
      rest
    )
  );
}

// --------------------------------------------------------------
// Individual task item
// --------------------------------------------------------------
function TaskItem(_ref) {
  const { id, label, checked, onChange, emoji } = _ref;
  return React.createElement(
    "li",
    {
      className:
        "flex items-center rounded border p-3 bg-gray-50 transition-all list-none " +
        (checked ? "opacity-60 line-through" : "hover:bg-gray-100"),
    },
    React.createElement(Checkbox, {
      id: id,
      checked: checked,
      onChange: function (e) {
        return onChange(e.target.checked);
      },
    }),
    React.createElement(
      Label,
      { htmlFor: id, className: "flex-1 flex items-center" },
      emoji && React.createElement("span", { className: "mr-2" }, emoji),
      React.createElement("span", {
        dangerouslySetInnerHTML: { __html: label },
      })
    )
  );
}

// --------------------------------------------------------------
// Group of related tasks
// --------------------------------------------------------------
function TaskGroup(_ref2) {
  var title = _ref2.title,
    note = _ref2.note,
    items = _ref2.items,
    dayKey = _ref2.dayKey,
    emoji = _ref2.emoji,
    accent = _ref2.accent,
    onItemChange = _ref2.onItemChange;

  return React.createElement(
    Card,
    null,
    React.createElement(
      "h2",
      {
        className: "font-semibold mb-1",
        style: { color: accent },
      },
      title
    ),
    note &&
      React.createElement(
        "p",
        { className: "italic text-gray-600 text-sm" },
        note
      ),
    React.createElement(
      "ul",
      { className: "list-none flex flex-col gap-2" },
      items.map(function (task, i) {
        var id = dayKey + "-" + title + "-" + i;
        var _usePersistentState = usePersistentState(id, false),
          checked = _usePersistentState[0],
          setChecked = _usePersistentState[1];
        var handle = function handle(val) {
          setChecked(val);
          onItemChange();
        };
        return React.createElement(TaskItem, {
          key: i,
          id: id,
          label: task,
          checked: checked,
          onChange: handle,
          emoji: emoji,
        });
      })
    )
  );
}

// --------------------------------------------------------------
// Streak history calendar overlay
// --------------------------------------------------------------
function StreakHistory(_ref3) {
  var history = _ref3.history,
    onClose = _ref3.onClose;

  var today = new Date();
  var cells = [];
  for (var i = 29; i >= 0; i--) {
    var d = new Date(today.getTime() - i * 86400000);
    var key = d.toISOString().split("T")[0];
    var completed = !!history[key];
    cells.push(
      React.createElement(
        "div",
        {
          key: key,
          className:
            "h-8 w-8 flex items-center justify-center rounded text-sm " +
            (completed
              ? "bg-green-300 text-green-800"
              : "bg-gray-200 text-gray-500"),
        },
        completed ? "\u2714\uFE0F" : d.getDate()
      )
    );
  }

  return React.createElement(
    "div",
    {
      className:
        "fixed inset-0 bg-black/50 flex items-center justify-center z-20",
    },
    React.createElement(
      "div",
      { className: "bg-white rounded-lg p-4 w-80 shadow" },
      React.createElement(
        "h3",
        { className: "text-center font-bold mb-2" },
        "Streak History"
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-7 gap-2" },
        cells
      ),
      React.createElement(
        Button,
        { className: "mt-4 w-full", onClick: onClose },
        "Close"
      )
    )
  );
}

// --------------------------------------------------------------
// Main application component
// --------------------------------------------------------------
function App() {
  var _useState = useState(new Date()),
    date = _useState[0],
    setDate = _useState[1];
  var _useState2 = useState(function () {
      return typeof loadSettings === "function" ? loadSettings() : {};
    }),
    settings = _useState2[0];

  var dayKey = date
    .toLocaleDateString(undefined, { weekday: "long" })
    .toLowerCase();
  var tasks = typeof getTasksFor === "function" ? getTasksFor(dayKey, date) : {};
  var accent = (settings.colors && settings.colors[dayKey]) || "#3b82f6";

  var _useState3 = useState(false),
    showHistory = _useState3[0],
    setShowHistory = _useState3[1];

  var _useStreakTracker = useStreakTracker(),
    streak = _useStreakTracker.streak,
    history = _useStreakTracker.history,
    markComplete = _useStreakTracker.markComplete;

  // collect all task ids for completion check
  var taskIds = useMemo(function () {
    var ids = [];
    Object.entries(tasks).forEach(function (_ref4) {
      var group = _ref4[0],
        data = _ref4[1];
      data.items.forEach(function (_, i) {
        ids.push(dayKey + "-" + group + "-" + i);
      });
    });
    return ids;
  }, [tasks, dayKey]);

  var checkAllComplete = useCallback(function () {
    if (!taskIds.length) return;
    var allDone = taskIds.every(function (id) {
      return JSON.parse(localStorage.getItem(id));
    });
    if (allDone) {
      markComplete();
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [taskIds, markComplete]);

  var nextDay = function nextDay() {
    return setDate(function (d) {
      return new Date(d.getTime() + 86400000);
    });
  };
  var prevDay = function prevDay() {
    return setDate(function (d) {
      return new Date(d.getTime() - 86400000);
    });
  };

  var dateLabel = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  var groups = Object.entries(tasks);

  return React.createElement(
    "div",
    null,
    // Streak bar
    React.createElement(
      "div",
      {
        className:
          "flex items-center justify-center gap-1 bg-orange-100 text-orange-600 font-bold py-2",
      },
      "\uD83D\uDD25",
      React.createElement("span", null, streak)
    ),

    // Header with navigation
    React.createElement(
      "header",
      {
        className:
          "sticky top-0 z-10 flex items-center shadow bg-background px-4 py-2 gap-2",
      },
      React.createElement(
        "div",
        { className: "flex items-center w-24" },
        React.createElement(Button, {
          className:
            "bg-transparent text-xl text-foreground p-2 hover:bg-muted rounded",
          onClick: prevDay,
          "aria-label": "Previous day",
        }, "\u2B05\uFE0F")
      ),
      React.createElement(
        "h1",
        { className: "flex-grow text-center font-bold text-lg" },
        dateLabel
      ),
      React.createElement(
        "div",
        { className: "flex items-center justify-end w-24 gap-2" },
        React.createElement(Button, {
          className:
            "bg-transparent text-xl text-foreground p-2 hover:bg-muted rounded",
          onClick: nextDay,
          "aria-label": "Next day",
        }, "\u27A1\uFE0F"),
        React.createElement(Button, {
          className:
            "bg-transparent text-xl text-foreground p-2 hover:bg-muted rounded",
          onClick: function onClick() {
            return setShowHistory(true);
          },
          "aria-label": "Streak history",
        }, "\uD83D\uDCC5"),
        React.createElement(
          "a",
          {
            href: "settings.html",
            className: "p-2 text-xl text-foreground rounded hover:bg-muted",
          },
          "\u2699\uFE0F"
        )
      )
    ),

    // Quote
    settings.showQuotes &&
      React.createElement(
        "p",
        { className: "text-center font-semibold mt-4" },
        (motivationByDay && motivationByDay[dayKey]) || ""
      ),

    // Tasks or empty state
    groups.length
      ? React.createElement(
          "main",
          {
            key: dayKey,
            className: "p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2",
          },
          groups.map(function (_ref5) {
            var group = _ref5[0],
              data = _ref5[1];
            return React.createElement(TaskGroup, {
              key: group,
              title: group,
              note: data.note,
              items: data.items,
              dayKey: dayKey,
              emoji: settings.emoji,
              accent: accent,
              onItemChange: checkAllComplete,
            });
          })
        )
      : React.createElement(
          "div",
          { className: "p-8 text-center text-2xl" },
          "\uD83C\uDFF9 Rest day! Keep the fire alive!"
        ),

    showHistory &&
      React.createElement(StreakHistory, {
        history: history,
        onClose: function onClose() {
          return setShowHistory(false);
        },
      })
  );
}

// expose App globally
window.App = App;

