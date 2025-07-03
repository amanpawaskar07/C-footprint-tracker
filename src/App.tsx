import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ActivityForm from './components/ActivityForm';
import Tips from './components/Tips';
import Header from './components/Header';
import GamificationPanel from './components/GamificationPanel';
import ReportsPanel from './components/ReportsPanel';
import { Activity, ActivityType } from './types/Activity';
import { useGamification } from './hooks/useGamification';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'tips' | 'gamification' | 'reports'>('dashboard');

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('ecotracker-activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('ecotracker-activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
    setActiveTab('dashboard');
  };

  const totalEmissions = activities.reduce((sum, activity) => sum + activity.emissions, 0);
  
  // Initialize gamification system
  const gamification = useGamification(activities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          totalEmissions={totalEmissions}
          userLevel={gamification.userStats.level}
        />
        
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              activities={activities} 
              totalEmissions={totalEmissions}
              userStats={gamification.userStats}
            />
          )}
          {activeTab === 'add' && (
            <ActivityForm onAddActivity={addActivity} />
          )}
          {activeTab === 'reports' && (
            <ReportsPanel 
              activities={activities}
              userStats={gamification.userStats}
            />
          )}
          {activeTab === 'gamification' && (
            <GamificationPanel
              userStats={gamification.userStats}
              achievements={gamification.achievements}
              challenges={gamification.challenges}
              recentUnlocks={gamification.recentUnlocks}
            />
          )}
          {activeTab === 'tips' && (
            <Tips totalEmissions={totalEmissions} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;