import { useState, useEffect } from 'react';
import { Activity } from '../types/Activity';
import { 
  Achievement, 
  Challenge, 
  UserStats, 
  DEFAULT_ACHIEVEMENTS, 
  LEVEL_THRESHOLDS,
  generateDailyChallenges,
  generateWeeklyChallenges
} from '../types/Gamification';

export const useGamification = (activities: Activity[]) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    totalActivities: 0,
    achievementsUnlocked: 0,
    challengesCompleted: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  // Load gamification data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('ecotracker-stats');
    const savedAchievements = localStorage.getItem('ecotracker-achievements');
    const savedChallenges = localStorage.getItem('ecotracker-challenges');

    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      // Generate initial challenges
      const dailyChallenges = generateDailyChallenges();
      const weeklyChallenges = generateWeeklyChallenges();
      setChallenges([...dailyChallenges, ...weeklyChallenges]);
    }
  }, []);

  // Save gamification data to localStorage
  useEffect(() => {
    localStorage.setItem('ecotracker-stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('ecotracker-achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('ecotracker-challenges', JSON.stringify(challenges));
  }, [challenges]);

  // Calculate level from XP
  const calculateLevel = (xp: number) => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    return level;
  };

  // Calculate streak
  const calculateStreak = (activities: Activity[]) => {
    if (activities.length === 0) return 0;

    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) { // Check up to a year
      const dayActivities = sortedActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });

      if (dayActivities.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Add XP and check for level up
  const addXP = (amount: number) => {
    setUserStats(prev => {
      const newTotalXp = prev.totalXp + amount;
      const newLevel = calculateLevel(newTotalXp);
      const currentLevelXp = LEVEL_THRESHOLDS[newLevel - 1] || 0;
      const nextLevelXp = LEVEL_THRESHOLDS[newLevel] || newTotalXp;
      
      return {
        ...prev,
        xp: newTotalXp - currentLevelXp,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel: nextLevelXp - newTotalXp
      };
    });
  };

  // Check and unlock achievements
  const checkAchievements = () => {
    const newUnlocks: Achievement[] = [];
    const currentStreak = calculateStreak(activities);
    const totalEmissions = activities.reduce((sum, a) => sum + a.emissions, 0);
    const dailyEmissions = activities
      .filter(a => {
        const today = new Date();
        const activityDate = new Date(a.date);
        return activityDate.toDateString() === today.toDateString();
      })
      .reduce((sum, a) => sum + a.emissions, 0);

    const transportActivities = activities.filter(a => a.type === 'transportation').length;
    const completedChallenges = challenges.filter(c => c.completed).length;

    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_activity':
          shouldUnlock = activities.length >= 1;
          break;
        case 'week_streak':
          shouldUnlock = currentStreak >= 7;
          break;
        case 'low_emissions':
          shouldUnlock = dailyEmissions > 0 && dailyEmissions <= 5;
          break;
        case 'transport_hero':
          shouldUnlock = transportActivities >= 10;
          break;
        case 'challenge_master':
          shouldUnlock = completedChallenges >= 5;
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        newUnlocks.push(unlockedAchievement);
        addXP(achievement.xp);
        return unlockedAchievement;
      }

      return achievement;
    }));

    if (newUnlocks.length > 0) {
      setRecentUnlocks(newUnlocks);
      setTimeout(() => setRecentUnlocks([]), 5000);
    }
  };

  // Update challenges progress
  const updateChallenges = () => {
    const today = new Date();
    
    setChallenges(prev => prev.map(challenge => {
      if (challenge.completed || new Date(challenge.endDate) < today) {
        return challenge;
      }

      let progress = challenge.progress;

      // Update progress based on challenge type
      const relevantActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= new Date(challenge.startDate) && 
               activityDate <= new Date(challenge.endDate);
      });

      switch (challenge.id.split('_')[1]) {
        case 'walk':
          // Count walking/cycling activities
          progress = relevantActivities
            .filter(a => a.description.toLowerCase().includes('walk') || 
                        a.description.toLowerCase().includes('bike'))
            .length;
          break;
        case 'energy':
          // Sum energy consumption
          progress = relevantActivities
            .filter(a => a.type === 'energy')
            .reduce((sum, a) => sum + parseFloat(a.description.split(' ')[2] || '0'), 0);
          break;
        case 'plant':
          // Count plant-based meals
          progress = relevantActivities
            .filter(a => a.type === 'food' && 
                        a.description.toLowerCase().includes('vegetables'))
            .length;
          break;
        case 'transport':
          // Count sustainable transport days
          const transportDays = new Set(
            relevantActivities
              .filter(a => a.type === 'transportation' && 
                          (a.description.includes('Bus') || 
                           a.description.includes('Train') || 
                           a.description.includes('Electric')))
              .map(a => new Date(a.date).toDateString())
          );
          progress = transportDays.size;
          break;
        case 'emissions':
          // Sum total emissions
          progress = relevantActivities.reduce((sum, a) => sum + a.emissions, 0);
          break;
      }

      const completed = progress >= challenge.target;
      
      if (completed && !challenge.completed) {
        addXP(challenge.xp);
      }

      return {
        ...challenge,
        progress,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined
      };
    }));
  };

  // Update stats when activities change
  useEffect(() => {
    const streak = calculateStreak(activities);
    const longestStreak = Math.max(userStats.longestStreak, streak);
    
    setUserStats(prev => ({
      ...prev,
      streak,
      longestStreak,
      totalActivities: activities.length,
      lastActivityDate: activities.length > 0 ? activities[0].date : undefined,
      achievementsUnlocked: achievements.filter(a => a.unlocked).length,
      challengesCompleted: challenges.filter(c => c.completed).length
    }));

    checkAchievements();
    updateChallenges();
  }, [activities, achievements, challenges]);

  // Generate new challenges when current ones expire
  const refreshChallenges = () => {
    const today = new Date();
    const activeChallenges = challenges.filter(c => new Date(c.endDate) >= today);
    
    if (activeChallenges.length < 3) {
      const newDailyChallenges = generateDailyChallenges();
      const newWeeklyChallenges = generateWeeklyChallenges();
      setChallenges([...activeChallenges, ...newDailyChallenges, ...newWeeklyChallenges]);
    }
  };

  return {
    userStats,
    achievements,
    challenges: challenges.filter(c => new Date(c.endDate) >= new Date()),
    recentUnlocks,
    addXP,
    refreshChallenges
  };
};