// Simplified settings page logic for Jav Trainer
// Stores workouts with tasks, assigned days, and randomise option

document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('workout-editor');
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let workouts = load();
  render();

  function load() {
    try {
      return JSON.parse(localStorage.getItem('workouts')) || [];
    } catch {
      return [];
    }
  }

  function save(data) {
    localStorage.setItem('workouts', JSON.stringify(data));
  }

  function render() {
    editor.innerHTML = '';
    workouts.forEach((w, idx) => {
      const block = document.createElement('div');
      block.className = 'border rounded p-4 space-y-2';
      block.dataset.index = idx;
      block.innerHTML = `
        <input class="workout-name w-full border p-2 rounded" placeholder="Workout name" value="${w.name || ''}" />
        <textarea class="workout-tasks w-full border p-2 rounded" rows="3" placeholder="One task per line">${(w.tasks||[]).join('\n')}</textarea>
        <div class="flex flex-wrap gap-2">
          ${dayLabels.map((d,i)=>`<label class=\"flex items-center gap-1\"><input type=\"checkbox\" class=\"day-checkbox\" value=\"${i}\" ${w.days&&w.days.includes(i)?'checked':''}/> ${d}</label>`).join('')}
        </div>
        <label class="flex items-center gap-2"><input type="checkbox" class="randomize" ${w.randomize?'checked':''}/> Randomise</label>
        <button class="delete-workout text-red-500 flex items-center gap-1"><i data-lucide="trash-2" class="w-4 h-4"></i>Delete</button>
      `;
      editor.appendChild(block);
    });

    const controls = document.createElement('div');
    controls.className = 'flex gap-2 pt-2';
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Workout';
    addBtn.className = 'px-3 py-2 bg-blue-500 text-white rounded';
    addBtn.onclick = () => {
      workouts.push({ name:'', tasks:[], days:[], randomize:false });
      render();
    };
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'px-3 py-2 bg-green-500 text-white rounded';
    saveBtn.onclick = () => {
      const blocks = editor.querySelectorAll('div[data-index]');
      const data = [];
      blocks.forEach(b => {
        const name = b.querySelector('.workout-name').value.trim();
        if(!name) return;
        const tasks = b.querySelector('.workout-tasks').value.split('\n').map(t=>t.trim()).filter(Boolean);
        const days = Array.from(b.querySelectorAll('.day-checkbox:checked')).map(cb=>parseInt(cb.value));
        const randomize = b.querySelector('.randomize').checked;
        data.push({ name, tasks, days, randomize });
      });
      save(data);
      workouts = load();
      render();
      alert('Saved');
    };
    controls.appendChild(addBtn);
    controls.appendChild(saveBtn);
    editor.appendChild(controls);

    if(window.lucide) window.lucide.createIcons();
  }

  editor.addEventListener('click', (e) => {
    if(e.target.closest('.delete-workout')) {
      const idx = e.target.closest('div[data-index]').dataset.index;
      workouts.splice(idx,1);
      render();
    }
  });
});
