export type ActivityType = 'transportation' | 'energy' | 'food' | 'lifestyle';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  emissions: number; // in kg CO2
  date: string;
}

export interface EmissionFactor {
  label: string;
  factor: number; // kg CO2 per unit
  unit: string;
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Transportation (per km)
  car_gasoline: { label: 'Car (Gasoline)', factor: 0.21, unit: 'km' },
  car_diesel: { label: 'Car (Diesel)', factor: 0.17, unit: 'km' },
  car_electric: { label: 'Car (Electric)', factor: 0.05, unit: 'km' },
  bus: { label: 'Bus', factor: 0.08, unit: 'km' },
  train: { label: 'Train', factor: 0.04, unit: 'km' },
  plane_domestic: { label: 'Plane (Domestic)', factor: 0.25, unit: 'km' },
  plane_international: { label: 'Plane (International)', factor: 0.15, unit: 'km' },
  
  // Energy (per kWh)
  electricity: { label: 'Electricity', factor: 0.5, unit: 'kWh' },
  natural_gas: { label: 'Natural Gas', factor: 0.2, unit: 'kWh' },
  
  // Food (per serving/kg)
  beef: { label: 'Beef', factor: 6.0, unit: 'serving' },
  pork: { label: 'Pork', factor: 2.9, unit: 'serving' },
  chicken: { label: 'Chicken', factor: 1.6, unit: 'serving' },
  fish: { label: 'Fish', factor: 1.1, unit: 'serving' },
  dairy: { label: 'Dairy Products', factor: 0.9, unit: 'serving' },
  vegetables: { label: 'Vegetables', factor: 0.1, unit: 'serving' },
  
  // Lifestyle
  shopping_clothes: { label: 'Clothing Purchase', factor: 8.0, unit: 'item' },
  shopping_electronics: { label: 'Electronics', factor: 50.0, unit: 'item' },
  waste_general: { label: 'General Waste', factor: 0.5, unit: 'kg' },
};