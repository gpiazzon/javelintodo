// --- Helpers ---
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

// --- Default Starter Plan ---
const defaultConfig = {
  types: {
    Gym: [
      {
        title: "Session 1 – Lower Body Power & Strength",
        items: [
          "Box Jumps or Broad Jumps – 4×3 (fast, max intent)",
          "Back Squat – 4×4 (heavy, low reps)",
          "Romanian Deadlift – 3×8",
          "Split Squat (DBs) – 3×10 each leg",
          "Hanging Knee Raises or Ab Rollouts – 3×12"
        ],
        note: "Builds legs, hips, and posterior chain."
      },
      {
        title: "Session 2 – Upper Body Push/Pull + Shoulder Stability",
        items: [
          "Med Ball Overhead Slam – 4×5",
          "Bench Press – 4×5 (fast bar speed, not max)",
          "Pull-ups (weighted if possible) – 4×6–8",
          "Strict Overhead Press – 3×8",
          "Face Pulls + Cuban Rotations – 3×12"
        ],
        note: "Keeps pressing strong, shoulders bulletproof."
      },
      {
        title: "Session 3 – Power & Rotation",
        items: [
          "Sprint or Sled Push 4×20–30m",
          "Trap Bar Deadlift – 4×4 (fast concentric)",
          "Landmine Rotational Press – 3×8 each side",
          "Single-arm Dumbbell Row – 3×10",
          "Farmer’s Carry – 3×40m"
        ],
        note: "Bridge day: rotation, unilateral, carries."
      }
    ],
    WOD: [
      {
        title: "WOD 1 – Power Engine Builder (AMRAP 12)",
        items: [
          "6 × Rotational Med Ball Throws each side",
          "40m Sled Push (medium weight)",
          "8 × Overhead Walking Lunges",
          "200m Run"
        ]
      },
      {
        title: "WOD 2 – Sprint & Smash (EMOM x12)",
        items: [
          "Odd min: 5 Box Jumps + 30m Sprint",
          "Even min: 10 Rotational Slams + 6 Push Press"
        ]
      },
      {
        title: "WOD 3 – Grip & Core Gauntlet (5 Rounds)",
        items: [
          "40m Farmers Carry",
          "10 Pull-ups (strict)",
          "8 Landmine Rotational Press each side",
          "200m Row"
        ]
      },
      {
        title: "WOD 4 – Jav Grinder (AMRAP 15)",
        items: [
          "5 Trap Bar Deadlifts (70% fast concentric)",
          "10 Med Ball Chest Passes",
          "20m Bear Crawl",
          "250m Ski Erg / Row"
        ]
      }
      // add WOD5-8 if you want all in
    ],
    Mobility: [
      {
        title: "Day A – Shoulders & Upper Back",
        items: [
          "Band pull-aparts ×15",
          "YTWs ×8 each",
          "Scap push-ups ×12",
          "Thread-the-needle stretch ×30s each side"
        ]
      },
      {
        title: "Day B – Hips & Back",
        items: [
          "Hip airplanes ×5 each side",
          "Glute bridge hold 30s + march ×10",
          "Cat-cow ×6",
          "Jefferson curl ×8 (light DB)"
        ]
      },
      {
        title: "Day C – Rotation & Core",
        items: [
          "Side plank with reach-through ×8 each side",
          "Pallof press ×10 each side",
          "Russian twists ×12 each side",
          "Open books ×8 each side"
        ]
      }
    ],
    Conditioning: [
      {
        title: "Sunday Conditioning",
        items: [
          "Medicine ball throws (varied, 10–15 mins)",
          "Short hill sprints or 200m runs",
          "General play throws / drills"
        ]
      }
    ]
  },
  tendon_snacks: {
    title: "Tendon Snacks (Daily)",
    items: [
      "Calf isometric holds (45s)",
      "Reverse wrist curls (light, high reps)",
      "Isometric holds in deep lunge (30s each side)"
    ]
  },
  schedule: {
    monday: ["Gym:0", "Mobility:0"],
    tuesday: ["Gym:1", "Mobility:1"],
    wednesday: ["Gym:2", "Mobility:2"],
    thursday: ["Conditioning:0"], // swap for Jav-specific drills if needed
    friday: ["WOD:random", "Mobility:0"],
    saturday: ["Mobility:1"],
    sunday: ["Mobility:2", "Conditioning:0"]
  }
};

// --- State ---
let config = loadConfig();
if (!config.types || Object.keys(config.types).length === 0) {
  config = defaultConfig;
  saveConfig(config);
}
