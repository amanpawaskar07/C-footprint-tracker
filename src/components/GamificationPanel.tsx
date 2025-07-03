import React from 'react';
import { Trophy, Star, Zap, Calendar, Target, Award } from 'lucide-react';
import { UserStats, Achievement, Challenge } from '../types/Gamification';
import AnimatedCounter from './AnimatedCounter';

interface GamificationPanelProps {
  userStats: UserStats;
  achievements: Achievement[];
  challenges: Challenge[];
  recentUnlocks: Achievement[];
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({
  userStats,
  achievements,
  challenges,
  recentUnlocks
}) => {
  const iconMap: Record<string, any> = {
    play: Star,
    calendar: Calendar,
    leaf: Target,
    bike: Zap,
    zap: Zap,
    trophy: Trophy
  };

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <div className="space-y-6">
      {/* Recent Unlocks Notification */}
      {recentUnlocks.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {recentUnlocks.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Award;
            return (
              <div
                key={achievement.id}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-lg animate-bounce"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Achievement Unlocked!</p>
                    <p className="text-sm">{achievement.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Level & XP Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Level {userStats.level}</h3>
              <p className="text-gray-400">Eco Warrior</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-400">
              <AnimatedCounter value={userStats.totalXp} />
            </p>
            <p className="text-sm text-gray-400">Total XP</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress to Level {userStats.level + 1}</span>
            <span className="text-emerald-400">{userStats.xp}/{userStats.xp + userStats.xpToNextLevel}</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
              style={{ 
                width: `${(userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{userStats.streak}</p>
          <p className="text-xs text-gray-500">Best: {userStats.longestStreak}</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white">{userStats.achievementsUnlocked}</p>
          <p className="text-xs text-gray-500">of {achievements.length}</p>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="h-6 w-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Active Challenges</h3>
        </div>
        
        <div className="space-y-3">
          {activeChallenges.slice(0, 3).map((challenge) => (
            <div key={challenge.id} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-white">{challenge.title}</h4>
                  <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  challenge.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                  challenge.type === 'weekly' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {challenge.type}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-emerald-400">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Expires: {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-yellow-400 font-medium">
                    +{challenge.xp} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.slice(0, 6).map((achievement) => {
            const Icon = iconMap[achievement.icon] || Award;
            return (
              <div 
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
                    : 'bg-slate-700/30 border-slate-600/50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-yellow-500/20' : 'bg-slate-600/50'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <span className="text-xs text-yellow-400 font-medium">
                      +{achievement.xp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;