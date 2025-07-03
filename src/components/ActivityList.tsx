import React from 'react';
import { Activity } from '../types/Activity';
import { Clock, Car, Zap, UtensilsCrossed, ShoppingBag } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const typeIcons = {
    transportation: Car,
    energy: Zap,
    food: UtensilsCrossed,
    lifestyle: ShoppingBag,
  };

  const typeColors = {
    transportation: 'text-blue-400 bg-blue-500/20',
    energy: 'text-yellow-400 bg-yellow-500/20',
    food: 'text-green-400 bg-green-500/20',
    lifestyle: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-500/20 rounded-lg">
          <Clock className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Recent Activities</h3>
          <p className="text-gray-400">Your latest emissions</p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = typeIcons[activity.type];
            const colorClass = typeColors[activity.type];
            
            return (
              <div 
                key={activity.id}
                className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 transform hover:scale-102"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {activity.description}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">
                    {activity.emissions.toFixed(1)}
                  </p>
                  <p className="text-gray-400 text-xs">kg CO₂</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No activities recorded yet.</p>
            <p className="text-gray-500 text-sm mt-1">Add your first activity to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;