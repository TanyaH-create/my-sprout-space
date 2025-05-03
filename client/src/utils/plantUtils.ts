// utils/plantUtils.ts
import { DBPlant, Plant } from '../types/garden';
import { resolveImagePath } from './imageUtils';

// Calculate plants per square foot based on spacing
export const calculatePlantsPerSquareFoot = (spacing: number): number => {
  if (spacing >= 18) return 0.25; // 1 plant per 4 squares
  if (spacing >= 12) return 1;
  if (spacing >= 6) return 4;
  if (spacing >= 4) return 9;
  return 16; // 3 inches or less spacing
};

// Format plant density for display
export const formatPlantDensity = (plantsPerSquareFoot: number): string => {
  if (plantsPerSquareFoot < 1) {
    // For plants that take more than 1 square foot
    const squareFeetNeeded = Math.round(1 / plantsPerSquareFoot);
    return `1 per ${squareFeetNeeded} sq ft`;
  }
  // For plants that fit 1 or more per square foot
  return `${plantsPerSquareFoot} per sq ft`;
};

// Convert database plant to local plant format
export const convertDbPlantToLocalPlant = (dbPlant: DBPlant): Plant => {
  return {
    id: dbPlant._id,
    name: dbPlant.plantName,
    color: dbPlant.color,
    width: 1,
    height: 1,
    spacing: dbPlant.spacing,
    sunlight: dbPlant.plantLight,
    water: dbPlant.plantWatering,
    plantsPerSquareFoot: dbPlant.plantsPerSquareFoot,
    image: resolveImagePath(dbPlant.plantImage)
  };
};


/**
 * Format spacing value to string display format
 * @param spacingInInches - Spacing value in inches
 * @returns Formatted spacing string
 */
export const formatSpacing = (spacingInInches: number): string => {
    return `${spacingInInches}"`;
  };
  
  /**
   * Extract basic water requirements from detailed watering information
   * @param wateringInfo - Detailed watering information
   * @returns Simplified water requirement string
   */
  export const formatWater = (wateringInfo: string): string => {
    // Try to extract something like "1-2 inches per week"
    if (wateringInfo.includes("inch")) {
      const match = wateringInfo.match(/(\d+(?:-\d+)?)\s*inch(?:es)?\s*per\s*week/i);
      if (match) {
        return `${match[1]} inches per week`;
      }
    }
    
    // Default return if no pattern is matched
    return wateringInfo.split('.')[0]; // Return first sentence
  };

