import React, { useState, useMemo } from 'react';
import { Activity, ActivityType } from '../types/Activity';
import { UserStats } from '../types/Gamification';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Filter,
  Share2,
  FileSpreadsheet,
  FileImage,
  Printer
} from 'lucide-react';
import { exportToPDF, exportToCSV, exportToJSON, generateShareableReport } from '../utils/exportUtils';
import EmissionsChart from './EmissionsChart';
import AnimatedCounter from './AnimatedCounter';

interface ReportsPanelProps {
  activities: Activity[];
  userStats: UserStats;
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ activities, userStats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [selectedCategory, setSelectedCategory] = useState<ActivityType | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Filter activities based on selected period
  const filteredActivities = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const matchesPeriod = activityDate >= startDate;
      const matchesCategory = selectedCategory === 'all' || activity.type === selectedCategory;
      return matchesPeriod && matchesCategory;
    });
  }, [activities, selectedPeriod, selectedCategory]);

  // Calculate report statistics
  const reportStats = useMemo(() => {
    const totalEmissions = filteredActivities.reduce((sum, a) => sum + a.emissions, 0);
    const averageDaily = totalEmissions / Math.max(1, getDaysInPeriod(selectedPeriod));
    
    const categoryBreakdown = filteredActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + activity.emissions;
      return acc;
    }, {} as Record<ActivityType, number>);

    const monthlyData = getMonthlyData(filteredActivities);
    const topEmissionDays = getTopEmissionDays(filteredActivities);
    
    return {
      totalEmissions,
      averageDaily,
      totalActivities: filteredActivities.length,
      categoryBreakdown,
      monthlyData,
      topEmissionDays,
      reductionFromPrevious: calculateReductionFromPrevious(filteredActivities, selectedPeriod)
    };
  }, [filteredActivities, selectedPeriod]);

  const getDaysInPeriod = (period: string) => {
    switch (period) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return Math.max(1, Math.ceil((Date.now() - new Date(activities[activities.length - 1]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24)));
    }
  };

  const getMonthlyData = (activities: Activity[]) => {
    const monthlyEmissions: Record<string, number> = {};
    activities.forEach(activity => {
      const month = new Date(activity.date).toISOString().slice(0, 7);
      monthlyEmissions[month] = (monthlyEmissions[month] || 0) + activity.emissions;
    });
    return Object.entries(monthlyEmissions)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);
  };

  const getTopEmissionDays = (activities: Activity[]) => {
    const dailyEmissions: Record<string, number> = {};
    activities.forEach(activity => {
      const day = activity.date.split('T')[0];
      dailyEmissions[day] = (dailyEmissions[day] || 0) + activity.emissions;
    });
    return Object.entries(dailyEmissions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const calculateReductionFromPrevious = (activities: Activity[], period: string) => {
    // Calculate reduction compared to previous period
    const now = new Date();
    const periodDays = getDaysInPeriod(period);
    const previousPeriodStart = new Date(now.getTime() - (periodDays * 2 * 24 * 60 * 60 * 1000));
    const currentPeriodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

    const previousEmissions = activities
      .filter(a => {
        const date = new Date(a.date);
        return date >= previousPeriodStart && date < currentPeriodStart;
      })
      .reduce((sum, a) => sum + a.emissions, 0);

    const currentEmissions = activities
      .filter(a => {
        const date = new Date(a.date);
        return date >= currentPeriodStart;
      })
      .reduce((sum, a) => sum + a.emissions, 0);

    if (previousEmissions === 0) return 0;
    return ((previousEmissions - currentEmissions) / previousEmissions) * 100;
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const reportData = {
        period: selectedPeriod,
        category: selectedCategory,
        activities: filteredActivities,
        stats: reportStats,
        userStats,
        generatedAt: new Date().toISOString()
      };

      switch (format) {
        case 'pdf':
          await exportToPDF(reportData);
          break;
        case 'csv':
          exportToCSV(reportData);
          break;
        case 'json':
          exportToJSON(reportData);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareableReport = generateShareableReport(reportStats, selectedPeriod);
      if (navigator.share) {
        await navigator.share({
          title: 'My Carbon Footprint Report',
          text: shareableReport,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareableReport);
        alert('Report copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Carbon Footprint Reports</h2>
              <p className="text-gray-400">Analyze your environmental impact over time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="all">All Categories</option>
              <option value="transportation">Transportation</option>
              <option value="energy">Energy</option>
              <option value="food">Food</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50"
          >
            <FileImage className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Total Emissions</span>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedCounter value={reportStats.totalEmissions} decimals={1} />
          </p>
          <p className="text-xs text-emerald-400">kg CO₂</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedCounter value={reportStats.averageDaily} decimals={1} />
          </p>
          <p className="text-xs text-blue-400">kg CO₂/day</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">Activities</span>
          </div>
          <p className="text-2xl font-bold text-white">{reportStats.totalActivities}</p>
          <p className="text-xs text-purple-400">logged</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className={`h-4 w-4 ${reportStats.reductionFromPrevious >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-sm text-gray-400">vs Previous</span>
          </div>
          <p className={`text-2xl font-bold ${reportStats.reductionFromPrevious >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {reportStats.reductionFromPrevious >= 0 ? '+' : ''}{reportStats.reductionFromPrevious.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400">reduction</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="h-6 w-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Category Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Object.entries(reportStats.categoryBreakdown).map(([category, emissions]) => {
              const percentage = reportStats.totalEmissions > 0 ? (emissions / reportStats.totalEmissions) * 100 : 0;
              const colors = {
                transportation: 'from-blue-500 to-blue-600',
                energy: 'from-yellow-500 to-yellow-600',
                food: 'from-green-500 to-green-600',
                lifestyle: 'from-purple-500 to-purple-600'
              };
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 capitalize">{category}</span>
                    <span className="text-white font-semibold">{emissions.toFixed(1)} kg</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${colors[category as ActivityType]} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Top Emission Days</h4>
            {reportStats.topEmissionDays.map(([date, emissions], index) => (
              <div key={date} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">#{index + 1}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-semibold">{emissions.toFixed(1)} kg</p>
                  <p className="text-gray-400 text-xs">CO₂</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-6 w-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">Monthly Trend</h3>
        </div>
        
        <div className="space-y-3">
          {reportStats.monthlyData.map(([month, emissions]) => {
            const maxEmissions = Math.max(...reportStats.monthlyData.map(([, e]) => e));
            const percentage = maxEmissions > 0 ? (emissions / maxEmissions) * 100 : 0;
            
            return (
              <div key={month} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-400 font-medium">
                  {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                </div>
                <div className="flex-1 bg-slate-700/50 rounded-lg overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-8 rounded-lg transition-all duration-1000 flex items-center px-3"
                    style={{ 
                      width: `${percentage}%`,
                      minWidth: emissions > 0 ? '3rem' : '0'
                    }}
                  >
                    {emissions > 0 && (
                      <span className="text-white text-xs font-medium">
                        {emissions.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-gray-400">
                  {emissions.toFixed(1)} kg
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Chart */}
      <EmissionsChart activities={filteredActivities} />
    </div>
  );
};

export default ReportsPanel;