import React from 'react';
import { Leaf, BarChart3, Plus, Lightbulb, Trophy, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'add' | 'tips' | 'gamification' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'add' | 'tips' | 'gamification' | 'reports') => void;
  totalEmissions: number;
  userLevel?: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, totalEmissions, userLevel = 1 }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Leaf className="h-8 w-8 text-emerald-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EcoTracker</h1>
              <p className="text-emerald-400 text-sm">Carbon Footprint Monitor</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'add'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xl:inline">Add Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden xl:inline">Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('gamification')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'gamification'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden xl:inline">Challenges</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'tips'
                  ? 'bg-emerald-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden xl:inline">Tips</span>
            </button>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Level {userLevel}</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-yellow-400">★</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Impact</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-white">
                    {totalEmissions.toFixed(1)}
                  </span>
                  <span className="text-sm text-emerald-400">kg CO₂</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-center mt-4 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'add'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">Add</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('gamification')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'gamification'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="text-xs">Challenges</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === 'tips'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs">Tips</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;