import React, { useMemo } from 'react';
import { Activity } from '../types/Activity';
import { BarChart3 } from 'lucide-react';

interface EmissionsChartProps {
  activities: Activity[];
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ activities }) => {
  const chartData = useMemo(() => {
    // Group activities by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayActivities = activities.filter(
        activity => activity.date.split('T')[0] === date
      );
      const emissions = dayActivities.reduce((sum, activity) => sum + activity.emissions, 0);
      
      return {
        date,
        emissions,
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      };
    });
  }, [activities]);

  const maxEmissions = Math.max(...chartData.map(d => d.emissions), 1);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-500/20 rounded-lg">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Weekly Emissions</h3>
          <p className="text-gray-400">Last 7 days activity</p>
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map((day, index) => (
          <div key={day.date} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-gray-400 font-medium">
              {day.label}
            </div>
            <div className="flex-1 bg-slate-700/50 rounded-lg overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-8 rounded-lg transition-all duration-1000 flex items-center px-3"
                style={{ 
                  width: `${(day.emissions / maxEmissions) * 100}%`,
                  minWidth: day.emissions > 0 ? '2rem' : '0',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {day.emissions > 0 && (
                  <span className="text-white text-xs font-medium">
                    {day.emissions.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <div className="w-16 text-right text-sm text-gray-400">
              {day.emissions.toFixed(1)} kg
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No activities recorded yet. Start tracking to see your emissions chart!</p>
        </div>
      )}
    </div>
  );
};

export default EmissionsChart;