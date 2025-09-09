import { Circle } from "lucide-react";
const { useState, useEffect } = React;

const defaultTasksByDay = {
  monday: {
    '\uD83C\uDF05 AM Mobility (5\u201310\u00a0min)': {
      note: 'Brief morning flow to loosen spine and shoulders',
      items: [
        '1\u20132 sets Cat\u2011Cows',
        '1\u20132 sets Thoracic rotations',
        '1\u20132 sets Arm circles',
        '1\u20132 sets Band pull-aparts'
      ]
    },
    '\u2600\uFE0F PM Javelin Session': {
      note: 'Dynamic warm-up, technique drills, run-up & throws',
      items: [
        'Dynamic warm-up: jog, skips, arm/leg swings',
        'Throwing drills: running crossovers, elastic band drills',
        'Lead with hip & chest, relaxed arm until final whip',
        'Firm block leg and good shoulder layback',
        'Eyes on target through release'
      ]
    },
    '\uD83D\uDEE0\uFE0F Post-Throw Arm Care': {
      note: 'Cooldown to recover shoulder and elbow',
      items: [
        'Band pull-aparts 2\u00d715\u201320',
        'External rotations 2\u00d715 each arm',
        'High-rep band curls & triceps ext 1\u00d750\u2013100',
        'Sleeper stretch',
        'Forearm & wrist stretches',
        'Gentle spinal twist / thrower\u2019s stretch'
      ]
    }
  },
  tuesday: {
    '\uD83C\uDF19 Evening Mobility (Day\u00a01)': {
      note: 'Hanging + Back Bridge focus',
      items: [
        'Quadruped straw breathing',
        'Single leg stand',
        'Segmented Cat\u2011Cow',
        'Flexion to extension spinal hygiene',
        'Scapula circles',
        'Cross\u2011crawl supermans',
        'Passive/Active hang 30\u201360s',
        'Hanging lat stretch',
        'Standing bridge rotations against wall',
        'Cross-bench pullover',
        'Optional back bridge hold',
        'Barefoot jog/hops 5\u201310\u00a0min'
      ]
    },
    '\uD83D\uDEE1\uFE0F Shoulder Prehab': {
      items: [
        'Scapular push-ups\u00a02\u00d715',
        'Wall Angels\u00a02\u00d710',
        'External rotation with dumbbell\u00a02\u00d710 each',
        'Y\u2011T\u2011W raises\u00a02\u00d78 each'
      ]
    }
  },
  wednesday: {
    '\uD83C\uDFCB\uFE0F Gym Session (Lower Body)': {
      note: 'Morning strength work for legs and core',
      items: [
        'Warm-up: cardio, leg swings, lunges',
        'Optional plyometrics: box jumps or bounding',
        'Trap-bar deadlift\u00a04\u00d75',
        'Box squat\u00a03\u00d78',
        'Split squats/lunges\u00a03\u00d78 each leg',
        'Nordic curls or RDL\u00a02\u00d710',
        'Back extensions\u00a02\u00d715',
        'Planks or side planks\u00a02\u00d745s',
        'Cooldown stretch & roll'
      ]
    }
  },
  thursday: {
    '\uD83C\uDF05 AM Mobility (5\u201310\u00a0min)': {
      note: 'Quick activation for evening throws',
      items: [
        'Cat\u2011Cows',
        'Arm circles',
        'Band pull-aparts'
      ]
    },
    '\u2600\uFE0F PM Javelin Session': {
      note: 'Evening technical throwing practice',
      items: [
        'Dynamic warm-up with extra leg prep',
        'Smooth crossovers with hip drive',
        'Focus on tall posture then finish low',
        'Use whole body, throw through the point'
      ]
    },
    '\uD83D\uDEE0\uFE0F Post-Throw Arm Care': {
      items: ['Repeat Monday arm care routine']
    }
  },
  friday: {
    '\uD83C\uDFCB\uFE0F Gym Session (Upper Body)': {
      note: 'Build pressing and pulling strength',
      items: [
        'Warm-up: jump rope & shoulder mobility',
        'Bench press\u00a05\u00d75',
        'Overhead med ball reverse throws\u00a03\u00d75',
        'Dumbbell chest fly\u00a03\u00d78\u201110',
        'Single-arm dumbbell rows\u00a03\u00d710',
        'Face pulls\u00a03\u00d712',
        'Y\u2011T\u2011W or scap pull-ups\u00a02\u00d78',
        'Pallof press/Russian twists',
        'Stretch chest & lats'
      ]
    }
  },
  saturday: {
    '\uD83C\uDF19 Evening Mobility (Day\u00a02)': {
      note: 'Side Split + Palms to Floor work',
      items: [
        'Quadruped straw breathing',
        'Single leg stand',
        'Seated leg raises',
        'Couch stretch',
        'Triangle pose',
        'Toes-elevated single-leg hamstring stretch',
        'Deep squat groin stretch',
        'Side split push-ups',
        'Knee-to-head marches',
        '3-step horse stance isometric',
        'ATG split squat pulses',
        'Sissy squats',
        'Wide stance alternating windmill',
        'Iso lunge hold 2\u20135\u00a0min each side',
        'Test side split & forward fold',
        'Sprint drills or easy jog',
        'Foam roll or extra prehab'
      ]
    }
  },
  sunday: {
    '\uD83C\uDF04 Recovery & Mobility (Day\u00a03)': {
      note: 'Thrower\u2019s Stretch + Front Split focus',
      items: [
        'Quadruped straw breathing',
        'Single leg stand',
        '90/90 switches',
        'Pigeon stretch',
        'Wall-blocked shoulder arcs',
        'Cross-legged side bend',
        'Overhead lunging reach',
        'Assisted chest stretch on floor',
        'Eccentric front split lowering',
        'Thoracic bridge reaches',
        'Hold thrower\u2019s stretch with stick',
        'Test front split',
        'Walk or bike',
        'Reflect & plan next week'
      ]
    }
  }
};

const motivationByDay = {
  monday: 'New week. New opportunities!',
  tuesday: 'Consistency compounds results.',
  wednesday: 'Halfway done\u2014bring the heat!',
  thursday: 'Blast off with technique.',
  friday: 'Leave it all on the field.',
  saturday: 'Unlock your body\u2019s potential.',
  sunday: 'Rest today, dominate tomorrow.'
};

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

function TaskItem({ id, label, checked, onChange }) {
  return (
    <li className={`flex items-center border-b last:border-0 p-3 ${checked ? 'opacity-60' : ''}`}>
      <input type="checkbox" className="mr-2 h-5 w-5 accent-blue-500" id={id} checked={checked} onChange={e => onChange(e.target.checked)} />
      <label htmlFor={id} className="flex-1 flex items-center gap-2">
        <Circle size={16} />
        {label}
      </label>
    </li>
  );
}

function TaskGroup({ title, note, items, dayKey }) {
  return (
    <div className="bg-white rounded shadow mb-4">
      <h2 className="bg-blue-500 text-white text-sm p-2 rounded-t">{title}</h2>
      {note && <p className="italic text-gray-600 px-4 pt-2">{note}</p>}
      <ul>
        {items.map((task, i) => {
          const id = `${dayKey}-${title}-${i}`;
          const [checked, setChecked] = usePersistentState(id, false);
          const handleChange = val => {
            setChecked(val);
            if (val) confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
          };
          return <TaskItem key={i} id={id} label={task} checked={checked} onChange={handleChange} />;
        })}
      </ul>
    </div>
  );
}

function App() {
  const [date, setDate] = useState(new Date());
  const dayKey = date.toLocaleDateString(undefined,{weekday:'long'}).toLowerCase();

  const tasks = defaultTasksByDay[dayKey] || {};

  const nextDay = () => setDate(d => new Date(d.getTime() + 86400000));
  const prevDay = () => setDate(d => new Date(d.getTime() - 86400000));


  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-blue-500 text-white shadow">
        <button onClick={prevDay} className="text-xl">⬅️</button>
        <h1 className="text-lg flex-1 text-center">{date.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}</h1>
        <button onClick={nextDay} className="text-xl">➡️</button>
      </header>
      <main className="p-4">
        <p className="text-center font-semibold mb-4">{motivationByDay[dayKey] || ''}</p>
        {Object.entries(tasks).map(([group, data]) => (
          <TaskGroup key={group} title={group} note={data.note} items={data.items} dayKey={dayKey} />
        ))}
      </main>
    </div>
  );
}

export default App;
