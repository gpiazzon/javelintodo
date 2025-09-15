// Utilities for Javelin checklist

const motivationByDay = {
  monday: 'New week. New opportunities!',
  tuesday: 'Consistency compounds results.',
  wednesday: 'Halfway done\u2014bring the heat!',
  thursday: 'Blast off with technique.',
  friday: 'Leave it all on the field.',
  saturday: 'Unlock your body\u2019s potential.',
  sunday: 'Rest today, dominate tomorrow.'
};

function loadTaskHistory() {
  const hist = localStorage.getItem('taskHistory');
  return hist ? JSON.parse(hist) : {};
}

function saveTaskHistory(hist) {
  localStorage.setItem('taskHistory', JSON.stringify(hist));
}

// --- Custom user tasks ---
function loadCustomTasks() {
  return JSON.parse(localStorage.getItem('customTasks') || '[]');
}

function loadWorkouts() {
  return JSON.parse(localStorage.getItem('workouts') || '[]');
}

function saveCustomTasks(tasks) {
  localStorage.setItem('customTasks', JSON.stringify(tasks));
}

function addCustomTask(task) {
  const tasks = loadCustomTasks();
  tasks.push(task);
  saveCustomTasks(tasks);
}

function getTasksFor(dayKey, date) {
  const hist = loadTaskHistory();
  const plans = hist[dayKey] || [];
  if (!plans.length) return {};
  const target = date.toISOString().split('T')[0];
  let result = plans[0].tasks;
  for (const p of plans) {
    if (p.start <= target) result = p.tasks; else break;
  }
  // Merge in any custom tasks for this date
  const custom = loadCustomTasks();
  const dayNum = date.getDay();
  const extras = custom.filter(t => {
    if (t.date) return t.date === target;
    if (t.repeat === 'daily') return true;
    if (Array.isArray(t.repeat)) return t.repeat.includes(dayNum);
    return false;
  });
  if (extras.length) {
    const grp = result['Custom Tasks'] || { items: [] };
    extras.forEach(t => {
      const text = `${t.emoji ? t.emoji + ' ' : ''}<span style="color:${t.color||'inherit'}">${t.label}</span>`;
      grp.items.push(text);
    });
    result['Custom Tasks'] = grp;
  }
  // Merge in scheduled workouts for this weekday
  const workouts = loadWorkouts();
  const todays = workouts.filter(w => Array.isArray(w.days) && w.days.includes(dayNum));
  const randomGroups = {};
  todays.forEach(w => {
    if (w.randomize) {
      if (!randomGroups[w.name]) randomGroups[w.name] = [];
      randomGroups[w.name].push(w);
    } else {
      result[w.name] = { items: w.tasks || [] };
    }
  });
  Object.entries(randomGroups).forEach(([name, arr]) => {
    const chosen = arr[Math.floor(Math.random() * arr.length)];
    result[name] = { items: chosen.tasks || [] };
  });
  return result;
}

function saveNewTasks(dayKey, tasks) {
  const hist = loadTaskHistory();
  const today = new Date().toISOString().split('T')[0];
  if (!hist[dayKey] || !hist[dayKey].length) {
    hist[dayKey] = [{ start: '1970-01-01', tasks: {} }];
  }
  hist[dayKey].push({ start: today, tasks });
  saveTaskHistory(hist);
}

// Expose key utilities globally for modules
window.getTasksFor = getTasksFor;
window.motivationByDay = motivationByDay;

