import React, { useState } from 'react';
import { ActivityType, EMISSION_FACTORS } from '../types/Activity';
import { Calculator, Plus } from 'lucide-react';

interface ActivityFormProps {
  onAddActivity: (activity: {
    type: ActivityType;
    description: string;
    emissions: number;
  }) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity }) => {
  const [type, setType] = useState<ActivityType>('transportation');
  const [selectedFactor, setSelectedFactor] = useState('');
  const [amount, setAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFactor || !amount) return;
    
    const factor = EMISSION_FACTORS[selectedFactor];
    const emissions = parseFloat(amount) * factor.factor;
    
    const description = customDescription || 
      `${factor.label} - ${amount} ${factor.unit}`;
    
    onAddActivity({
      type,
      description,
      emissions,
    });

    // Reset form
    setAmount('');
    setCustomDescription('');
  };

  const getFactorsForType = (activityType: ActivityType) => {
    return Object.entries(EMISSION_FACTORS).filter(([key]) => {
      switch (activityType) {
        case 'transportation':
          return ['car_gasoline', 'car_diesel', 'car_electric', 'bus', 'train', 'plane_domestic', 'plane_international'].includes(key);
        case 'energy':
          return ['electricity', 'natural_gas'].includes(key);
        case 'food':
          return ['beef', 'pork', 'chicken', 'fish', 'dairy', 'vegetables'].includes(key);
        case 'lifestyle':
          return ['shopping_clothes', 'shopping_electronics', 'waste_general'].includes(key);
        default:
          return false;
      }
    });
  };

  const currentFactors = getFactorsForType(type);
  const calculatedEmissions = selectedFactor && amount 
    ? parseFloat(amount) * EMISSION_FACTORS[selectedFactor].factor 
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Plus className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Activity</h2>
            <p className="text-gray-400">Track your carbon footprint by logging daily activities</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Activity Category
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(['transportation', 'energy', 'food', 'lifestyle'] as ActivityType[]).map((activityType) => (
                <button
                  key={activityType}
                  type="button"
                  onClick={() => {
                    setType(activityType);
                    setSelectedFactor('');
                  }}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    type === activityType
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400'
                      : 'border-slate-600 bg-slate-700/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <span className="block text-sm font-medium capitalize">
                    {activityType}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Specific Activity
            </label>
            <select
              value={selectedFactor}
              onChange={(e) => setSelectedFactor(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
              required
            >
              <option value="">Select an activity...</option>
              {currentFactors.map(([key, factor]) => (
                <option key={key} value={key}>
                  {factor.label} (per {factor.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          {selectedFactor && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Amount ({EMISSION_FACTORS[selectedFactor].unit})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.1"
                min="0"
                placeholder={`Enter ${EMISSION_FACTORS[selectedFactor].unit}...`}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                required
              />
            </div>
          )}

          {/* Custom Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Custom Description (optional)
            </label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Add a custom description..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
            />
          </div>

          {/* Emission Preview */}
          {calculatedEmissions > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calculator className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-gray-300">Estimated Emissions</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {calculatedEmissions.toFixed(2)} kg CO₂
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFactor || !amount}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-emerald-400/20"
          >
            Add Activity
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;