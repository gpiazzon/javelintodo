// Default tasks and utilities for Javelin checklist
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

function loadTaskHistory() {
  let hist = localStorage.getItem('taskHistory');
  if (hist) return JSON.parse(hist);
  const start = '1970-01-01';
  const h = {};
  for (const [day, tasks] of Object.entries(defaultTasksByDay)) {
    h[day] = [{ start, tasks }];
  }
  localStorage.setItem('taskHistory', JSON.stringify(h));
  return h;
}

function saveTaskHistory(hist) {
  localStorage.setItem('taskHistory', JSON.stringify(hist));
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
  return result;
}

function saveNewTasks(dayKey, tasks) {
  const hist = loadTaskHistory();
  const today = new Date().toISOString().split('T')[0];
  if (!hist[dayKey] || !hist[dayKey].length) {
    hist[dayKey] = [{ start: '1970-01-01', tasks: defaultTasksByDay[dayKey] || {} }];
  }
  hist[dayKey].push({ start: today, tasks });
  saveTaskHistory(hist);
}
