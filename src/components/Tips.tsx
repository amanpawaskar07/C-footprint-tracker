import React from 'react';
import { Lightbulb, Leaf, Car, Zap, UtensilsCrossed, ShoppingBag, Award, Target } from 'lucide-react';

interface TipsProps {
  totalEmissions: number;
}

const Tips: React.FC<TipsProps> = ({ totalEmissions }) => {
  const getEmissionLevel = () => {
    if (totalEmissions < 50) return 'excellent';
    if (totalEmissions < 100) return 'good';
    if (totalEmissions < 200) return 'moderate';
    return 'high';
  };

  const level = getEmissionLevel();

  const generalTips = [
    {
      icon: Car,
      title: 'Sustainable Transportation',
      tips: [
        'Walk, bike, or use public transport when possible',
        'Consider carpooling or ride-sharing',
        'Work from home when you can',
        'Plan errands efficiently to reduce trips',
      ],
    },
    {
      icon: Zap,
      title: 'Energy Efficiency',
      tips: [
        'Switch to LED light bulbs',
        'Unplug electronics when not in use',
        'Use programmable thermostats',
        'Consider renewable energy sources',
      ],
    },
    {
      icon: UtensilsCrossed,
      title: 'Sustainable Diet',
      tips: [
        'Reduce meat consumption, especially beef',
        'Buy local and seasonal produce',
        'Minimize food waste',
        'Try plant-based meals several times a week',
      ],
    },
    {
      icon: ShoppingBag,
      title: 'Conscious Consumption',
      tips: [
        'Buy quality items that last longer',
        'Shop secondhand when possible',
        'Repair instead of replacing',
        'Reduce unnecessary purchases',
      ],
    },
  ];

  const levelMessages = {
    excellent: {
      color: 'from-green-500 to-green-600',
      message: 'Outstanding! You\'re doing great at keeping your carbon footprint low.',
      icon: Award,
    },
    good: {
      color: 'from-emerald-500 to-emerald-600',
      message: 'Good work! You\'re on the right track with your environmental impact.',
      icon: Target,
    },
    moderate: {
      color: 'from-yellow-500 to-yellow-600',
      message: 'You\'re doing okay, but there\'s room for improvement.',
      icon: Lightbulb,
    },
    high: {
      color: 'from-red-500 to-red-600',
      message: 'Your carbon footprint is quite high. Let\'s work on reducing it together.',
      icon: Target,
    },
  };

  const currentLevel = levelMessages[level];
  const LevelIcon = currentLevel.icon;

  return (
    <div className="space-y-8">
      {/* Status Card */}
      <div className={`bg-gradient-to-br ${currentLevel.color} rounded-2xl p-8 text-white`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <LevelIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Environmental Impact</h2>
            <p className="text-white/90">{currentLevel.message}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">{totalEmissions.toFixed(1)}</span>
          <span className="text-white/90">kg CO₂ total emissions</span>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {generalTips.map((category, index) => {
          const Icon = category.icon;
          return (
            <div 
              key={category.title}
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
              </div>
              <div className="space-y-3">
                {category.tips.map((tip, tipIndex) => (
                  <div 
                    key={tipIndex}
                    className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Leaf className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Quick Impact Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg">
            <h4 className="font-semibold text-green-400 mb-2">Today</h4>
            <p className="text-sm text-gray-300">Take a 15-minute walk instead of driving</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">This Week</h4>
            <p className="text-sm text-gray-300">Try 3 plant-based meals</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg">
            <h4 className="font-semibold text-purple-400 mb-2">This Month</h4>
            <p className="text-sm text-gray-300">Switch to energy-efficient appliances</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;