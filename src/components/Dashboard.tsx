import React, { useState, useEffect } from 'react';
import { Activity, ActivityType } from '../types/Activity';
import { UserStats } from '../types/Gamification';
import { TrendingUp, TrendingDown, Car, Zap, UtensilsCrossed, ShoppingBag, Calendar, Target, Star, Trophy } from 'lucide-react';
import EmissionsChart from './EmissionsChart';
import ActivityList from './ActivityList';
import AnimatedCounter from './AnimatedCounter';

interface DashboardProps {
  activities: Activity[];
  totalEmissions: number;
  userStats?: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ activities, totalEmissions, userStats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Calculate emissions by category
  const emissionsByCategory = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + activity.emissions;
    return acc;
  }, {} as Record<ActivityType, number>);

  // Calculate weekly average
  const weeklyAverage = totalEmissions / Math.max(1, Math.ceil(activities.length / 7));
  const monthlyProjection = weeklyAverage * 4.33; // Average weeks per month

  // Get recent activities
  const recentActivities = activities.slice(0, 5);

  // Calculate trend (comparing last 7 days to previous 7 days)
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previousWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const lastWeekEmissions = activities
    .filter(a => new Date(a.date) >= lastWeek)
    .reduce((sum, a) => sum + a.emissions, 0);

  const previousWeekEmissions = activities
    .filter(a => new Date(a.date) >= previousWeek && new Date(a.date) < lastWeek)
    .reduce((sum, a) => sum + a.emissions, 0);

  const trend = previousWeekEmissions > 0 
    ? ((lastWeekEmissions - previousWeekEmissions) / previousWeekEmissions) * 100
    : 0;

  const categoryIcons = {
    transportation: Car,
    energy: Zap,
    food: UtensilsCrossed,
    lifestyle: ShoppingBag,
  };

  const categoryColors = {
    transportation: 'from-blue-500 to-blue-600',
    energy: 'from-yellow-500 to-yellow-600',
    food: 'from-green-500 to-green-600',
    lifestyle: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="space-y-8">
      {/* Gamification Stats Row */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-semibold">Level {userStats.level}</p>
                <p className="text-xs text-gray-400">{userStats.totalXp} XP</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-semibold">{userStats.streak} Day Streak</p>
                <p className="text-xs text-gray-400">Best: {userStats.longestStreak}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-purple-400 font-semibold">{userStats.achievementsUnlocked} Achievements</p>
                <p className="text-xs text-gray-400">{userStats.challengesCompleted} Challenges</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-blue-400 font-semibold">{userStats.totalActivities} Activities</p>
                <p className="text-xs text-gray-400">Total logged</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Total Emissions</h3>
            <div className={`p-2 rounded-lg ${trend > 0 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              {trend > 0 ? (
                <TrendingUp className="h-5 w-5 text-red-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-400" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <AnimatedCounter value={totalEmissions} decimals={1} />
              <span className="text-emerald-400 font-medium">kg CO₂</span>
            </div>
            <p className={`text-sm ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}% vs last week
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Weekly Average</h3>
            <Calendar className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <AnimatedCounter value={weeklyAverage} decimals={1} />
              <span className="text-emerald-400 font-medium">kg CO₂</span>
            </div>
            <p className="text-sm text-gray-400">per week</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-200">Monthly Goal</h3>
            <Target className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <AnimatedCounter value={monthlyProjection} decimals={0} />
              <span className="text-emerald-400 font-medium">kg CO₂</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (totalEmissions / monthlyProjection) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Emissions by Category</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(emissionsByCategory).map(([category, emissions]) => {
            const Icon = categoryIcons[category as ActivityType];
            const percentage = totalEmissions > 0 ? (emissions / totalEmissions) * 100 : 0;
            
            return (
              <div key={category} className="group">
                <div className={`bg-gradient-to-br ${categoryColors[category as ActivityType]} p-4 rounded-xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium opacity-90">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide opacity-80">
                      {category}
                    </p>
                    <p className="text-lg font-bold">
                      {emissions.toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmissionsChart activities={activities} />
        <ActivityList activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;