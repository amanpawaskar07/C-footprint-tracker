export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'emissions' | 'streak' | 'activity' | 'challenge';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'transportation' | 'energy' | 'food' | 'lifestyle' | 'general';
  target: number;
  progress: number;
  xp: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActivityDate?: string;
  totalActivities: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000,
  13000, 16500, 20500, 25000, 30000, 35500, 41500, 48000, 55000, 62500
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_activity',
    title: 'Getting Started',
    description: 'Log your first activity',
    icon: 'play',
    category: 'activity',
    requirement: 1,
    unlocked: false,
    xp: 50
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Log activities for 7 consecutive days',
    icon: 'calendar',
    category: 'streak',
    requirement: 7,
    unlocked: false,
    xp: 200
  },
  {
    id: 'low_emissions',
    title: 'Eco Champion',
    description: 'Keep daily emissions under 5kg CO₂',
    icon: 'leaf',
    category: 'emissions',
    requirement: 5,
    unlocked: false,
    xp: 150
  },
  {
    id: 'transport_hero',
    title: 'Transport Hero',
    description: 'Log 10 sustainable transport activities',
    icon: 'bike',
    category: 'activity',
    requirement: 10,
    unlocked: false,
    xp: 300
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Reduce energy emissions by 50%',
    icon: 'zap',
    category: 'emissions',
    requirement: 50,
    unlocked: false,
    xp: 250
  },
  {
    id: 'challenge_master',
    title: 'Challenge Master',
    description: 'Complete 5 challenges',
    icon: 'trophy',
    category: 'challenge',
    requirement: 5,
    unlocked: false,
    xp: 500
  }
];

export const generateDailyChallenges = (): Challenge[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: `daily_walk_${today.toISOString().split('T')[0]}`,
      title: 'Walk It Off',
      description: 'Walk at least 2km instead of driving',
      type: 'daily',
      category: 'transportation',
      target: 2,
      progress: 0,
      xp: 100,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      completed: false
    },
    {
      id: `daily_energy_${today.toISOString().split('T')[0]}`,
      title: 'Power Down',
      description: 'Keep energy consumption under 10 kWh',
      type: 'daily',
      category: 'energy',
      target: 10,
      progress: 0,
      xp: 80,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      completed: false
    },
    {
      id: `daily_plant_${today.toISOString().split('T')[0]}`,
      title: 'Plant Power',
      description: 'Have at least 2 plant-based meals',
      type: 'daily',
      category: 'food',
      target: 2,
      progress: 0,
      xp: 120,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      completed: false
    }
  ];
};

export const generateWeeklyChallenges = (): Challenge[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: `weekly_transport_${today.toISOString().split('T')[0]}`,
      title: 'Sustainable Week',
      description: 'Use sustainable transport for 5 days',
      type: 'weekly',
      category: 'transportation',
      target: 5,
      progress: 0,
      xp: 300,
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
      completed: false
    },
    {
      id: `weekly_emissions_${today.toISOString().split('T')[0]}`,
      title: 'Carbon Cutter',
      description: 'Keep weekly emissions under 50kg CO₂',
      type: 'weekly',
      category: 'general',
      target: 50,
      progress: 0,
      xp: 400,
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
      completed: false
    }
  ];
};