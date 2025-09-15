// react-app.js - simplified React app for Jav Trainer
// Globals: React, lucide, confetti

const { useState, useEffect, useCallback } = React;

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
function showStreakPopup(history) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  const box = document.createElement('div');
  box.className = 'bg-white p-4 rounded shadow text-center';
  const row = document.createElement('div');
  row.className = 'flex gap-2 mb-2';
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    const span = document.createElement('div');
    span.textContent = d
      .toLocaleDateString(undefined, { weekday: 'short' })
      .slice(0, 3);
    span.className = `px-2 py-1 rounded ${history[key] ? 'bg-green-200' : 'bg-red-200'}`;
    row.appendChild(span);
  }
  const close = document.createElement('button');
  close.textContent = 'Close';
  close.className = 'mt-2 px-3 py-1 bg-blue-500 text-white rounded';
  close.onclick = () => document.body.removeChild(overlay);
  box.appendChild(row);
  box.appendChild(close);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function useStreakTracker() {
  const today = new Date().toISOString().split('T')[0];
  const [streak, setStreak] = usePersistentState('streak', 0);
  const [lastDate, setLastDate] = usePersistentState('streakLastDate', null);
  const [history, setHistory] = usePersistentState('streakHistory', {});
  const markComplete = useCallback(() => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const next = lastDate === yesterday ? streak + 1 : 1;
    setStreak(next);
    setLastDate(today);
    setHistory(prev => {
      const updated = { ...prev, [today]: true };
      showStreakPopup(updated);
      return updated;
    });
  }, [lastDate, streak, today, setStreak, setLastDate, setHistory]);
  return { streak, markComplete };
}

const quotes = {
  sunday: 'Rest today, dominate tomorrow.',
  monday: 'New week. New opportunities!',
  tuesday: 'Consistency compounds results.',
  wednesday: 'Halfway done—bring the heat!',
  thursday: 'Blast off with technique.',
  friday: 'Leave it all on the field.',
  saturday: 'Unlock your body\u2019s potential.'
};

// Individual task card with its own persisted checkbox state
function TaskCard({ id, label, onDelete, onCheck }) {
  const [checked, setChecked] = usePersistentState(id, false);
  const handleChange = e => {
    setChecked(e.target.checked);
    onCheck();
  };
  return React.createElement(
    'div',
    {
      className:
        'flex items-center bg-white rounded shadow p-3 mb-2 ' +
        (checked ? 'opacity-60 line-through' : '')
    },
    React.createElement('input', {
      type: 'checkbox',
      className: 'mr-3 h-5 w-5',
      checked,
      onChange: handleChange
    }),
    React.createElement('span', {
      className: 'flex-1',
      dangerouslySetInnerHTML: { __html: label }
    }),
    React.createElement(
      'button',
      { onClick: onDelete, className: 'ml-2 text-[#8C8C8C]' },
      React.createElement('i', { 'data-lucide': 'x', className: 'w-4 h-4' })
    )
  );
}

// --------------------------------------------------------------
// Main App component
// --------------------------------------------------------------
function App() {
  const [date, setDate] = useState(new Date());
  const [groups, setGroups] = useState({});
  const [newTask, setNewTask] = useState('');
  const { streak, markComplete } = useStreakTracker();

  const dayName = date.toLocaleDateString(undefined, { weekday: 'long' }).toLowerCase();

  useEffect(() => {
    if (typeof getTasksFor === 'function') {
      setGroups(getTasksFor(dayName, date));
    } else {
      setGroups({});
    }
    setNewTask('');
  }, [dayName, date]);

  useEffect(() => {
    const handle = e => {
      if (['workouts', 'customTasks', 'taskHistory'].includes(e.key)) {
        if (typeof getTasksFor === 'function') {
          setGroups(getTasksFor(dayName, date));
        }
      }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, [dayName, date]);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  const addTask = () => {
    const label = newTask.trim();
    if (!label) return;
    setGroups(prev => {
      const grp = prev['Extras'] ? { ...prev['Extras'] } : { items: [] };
      grp.items = [...grp.items, label];
      return { ...prev, Extras: grp };
    });
    setNewTask('');
  };

  const deleteTask = (group, index) => {
    setGroups(prev => {
      const grp = { ...prev[group] };
      grp.items = grp.items.filter((_, i) => i !== index);
      const next = { ...prev, [group]: grp };
      if (grp.items.length === 0) delete next[group];
      return next;
    });
    setTimeout(checkAll, 0);
  };

  const checkAll = useCallback(() => {
    const ids = [];
    Object.entries(groups).forEach(([g, data]) => {
      data.items.forEach((_, i) => ids.push(`${dayName}-${g}-${i}`));
    });
    if (!ids.length) {
      markComplete();
      return;
    }
    const allDone = ids.every(id => JSON.parse(localStorage.getItem(id)));
    if (allDone) {
      markComplete();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    }
  }, [groups, dayName, markComplete]);

  const nextDay = () => setDate(new Date(date.getTime() + 86400000));
  const prevDay = () => setDate(new Date(date.getTime() - 86400000));
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return React.createElement(
    'div',
    { className: 'p-4' },
    React.createElement(
      'header',
      null,
      React.createElement(
        'h1',
        { className: 'text-2xl font-bold text-[#2C6DF2]' },
        'Jav Trainer'
      ),
      React.createElement(
        'div',
        { className: 'flex items-center justify-between mt-2' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2' },
          React.createElement(
            'button',
            { onClick: prevDay },
            React.createElement('i', { 'data-lucide': 'arrow-left', className: 'w-5 h-5' })
          ),
          React.createElement('span', null, dateLabel),
          React.createElement(
            'button',
            { onClick: nextDay },
            React.createElement('i', { 'data-lucide': 'arrow-right', className: 'w-5 h-5' })
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center gap-4' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-1 text-[#E6513B]' },
            React.createElement('i', { 'data-lucide': 'flame', className: 'w-5 h-5' }),
            React.createElement('span', null, streak)
          ),
          React.createElement(
            'a',
            { href: 'settings.html', className: 'text-[#8C8C8C]' },
            React.createElement('i', { 'data-lucide': 'settings', className: 'w-5 h-5' })
          )
        )
      ),
      React.createElement('hr', { className: 'my-4' })
    ),
    React.createElement(
      'div',
      { className: 'flex items-center mb-4 border-b pb-2' },
      React.createElement('input', {
        className: 'flex-1 bg-transparent outline-none placeholder-gray-400',
        placeholder: 'Add new task',
        value: newTask,
        onChange: e => setNewTask(e.target.value)
      }),
      React.createElement(
        'button',
        { onClick: addTask },
        React.createElement('i', { 'data-lucide': 'plus', className: 'w-5 h-5' })
      )
    ),
    quotes[dayName] &&
      React.createElement(
        'p',
        { className: 'italic text-gray-400 mb-4' },
        quotes[dayName]
      ),
    Object.entries(groups).map(([group, data]) =>
      React.createElement(
        React.Fragment,
        { key: group },
        React.createElement('h3', { className: 'font-semibold mt-4 mb-2' }, group),
        data.items.map((task, i) => {
          const id = `${dayName}-${group}-${i}`;
          return React.createElement(TaskCard, {
            key: i,
            id,
            label: task,
            onCheck: checkAll,
            onDelete: () => deleteTask(group, i)
          });
        })
      )
    )
  );
}

// expose App globally
window.App = App;
