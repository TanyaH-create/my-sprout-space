// utils/plantUtils.ts
import { DBPlant, Plant } from '../types/garden';
import { resolveImagePath } from './imageUtils';

// Plant growth type enum
export enum PlantGrowthType {
  NORMAL = 'normal',
  VERTICAL = 'vertical',
  VERTICAL_BEAN_PEA = 'vertical_bean_pea'
}

/**
 * Calculate plants per square foot based on spacing and growth type
 * This is the core function that implements the square foot gardening method's spacing rules
 * @param spacing - Plant spacing in inches (from seed packet)
 * @param growthType - Type of growth (normal, vertical, vertical bean/pea)
 * @returns Number of plants that can be grown per square foot
 */
export const calculatePlantsPerSquareFoot = (
  spacing: number, 
  growthType: PlantGrowthType = PlantGrowthType.NORMAL
): number => {


  // Handle vertical growing plants first
  if (growthType === PlantGrowthType.VERTICAL) {
    return 1; // 1 plant per square foot for vertical plants
  }
  
  if (growthType === PlantGrowthType.VERTICAL_BEAN_PEA) {
    return 9; // 9 plants per square foot for vertical beans and peas
  }
  
    // Normal plants based on spacing
    if (spacing >= 36) return 0.25; // 1 plant per 4 square feet
    if (spacing >= 24) return 0.33; // 1 plant per 3 square feet
    if (spacing >= 18) return 0.5;  // 1 plant per 2 square feet
    if (spacing >= 12) return 1;    // 1 plant per square foot
    if (spacing >= 8) return 2;     // 2 plants per square foot
    if (spacing >= 6) return 4;     // 4 plants per square foot
    if (spacing >= 4) return 9;     // 9 plants per square foot
    return 16;                      // 16 plants per square foot (3" spacing or less)

};

/**
 * Format plant density for display in a user-friendly way
 * @param plantsPerSquareFoot - Density value
 * @returns Formatted string representing the density
 */
export const formatPlantDensity = (plantsPerSquareFoot: number): string => {
  if (plantsPerSquareFoot < 1) {
    // For plants that take more than 1 square foot
    const squareFeetNeeded = Math.round(1 / plantsPerSquareFoot);
    return `1 per ${squareFeetNeeded} sq ft`;
  }
  // For plants that fit 1 or more per square foot
  return `${plantsPerSquareFoot} per sq ft`;
};

/**
 * Convert a database plant object to a local plant object
 * @param dbPlant - Plant object from the database
 * @returns Local plant object for use in the UI
 */
export const convertDbPlantToLocalPlant = (dbPlant: DBPlant): Plant => {
  const growthType = dbPlant.growthType === 'vertical' ? PlantGrowthType.VERTICAL :
                     dbPlant.growthType === 'vertical_bean_pea' ? PlantGrowthType.VERTICAL_BEAN_PEA :
                     PlantGrowthType.NORMAL;
  
  const calculatedPlantsPerSquareFoot = calculatePlantsPerSquareFoot(
     dbPlant.spacing, 
     growthType
  );

  return {
    id: dbPlant._id,
    name: dbPlant.plantName,
    variety: dbPlant.plantVariety,
    width: 1,
    height: 1,
    spacing: dbPlant.spacing,
    sunlight: dbPlant.plantLight,
    water: dbPlant.plantWatering,
    growthType: dbPlant.growthType === 'vertical' ? PlantGrowthType.VERTICAL :
                dbPlant.growthType === 'vertical_bean_pea' ? PlantGrowthType.VERTICAL_BEAN_PEA :
                PlantGrowthType.NORMAL,
    isVerticalGrower: dbPlant.isVerticalGrower || false, 
    plantsPerSquareFoot: calculatedPlantsPerSquareFoot,
    image: resolveImagePath(dbPlant.plantImage)
  };
  
};

/**
 * Suggest a growth type based on plant name and type
 * Used only as a helper in the UI, not for automatic determination
 * @param plantName - Name of the plant
 * @param plantType - Type of the plant
 * @returns Suggested PlantGrowthType enum value
 */
export const suggestGrowthType = (plantName: string, plantType: string): PlantGrowthType => {
  // Check if plant is a known vertical grower
  const verticalPlants = [
    'cucumber', 'tomato', 'squash', 'melon', 'watermelon', 'pumpkin',
    'gourd', 'pole bean', 'lima bean', 'pea', 'sweet pea', 'snow pea',
    'snap pea', 'indeterminate tomato'
  ];
  
  // Plants that are specifically beans or peas that can be planted 9 per square foot when vertical
  const verticalBeanPeas = [
    'pole bean', 'lima bean', 'pea', 'sweet pea', 'snow pea', 'snap pea'
  ];
  
  const plantNameLower = plantName.toLowerCase();
  const plantTypeLower = plantType.toLowerCase();
  
  // Check for bean/pea vertical plants first (more specific case)
  for (const plant of verticalBeanPeas) {
    if (plantNameLower.includes(plant) || plantTypeLower.includes(plant)) {
      return PlantGrowthType.VERTICAL_BEAN_PEA;
    }
  }
  
  // Then check for other vertical plants
  for (const plant of verticalPlants) {
    if (plantNameLower.includes(plant) || plantTypeLower.includes(plant)) {
      return PlantGrowthType.VERTICAL;
    }
  }
  
  // Default to normal growth type
  return PlantGrowthType.NORMAL;
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
  if (wateringInfo && wateringInfo.includes("inch")) {
    const match = wateringInfo.match(/(\d+(?:-\d+)?)\s*inch(?:es)?\s*per\s*week/i);
    if (match) {
      return `${match[1]} inches per week`;
    }
  }
  
  // Default return if no pattern is matched
  return wateringInfo ? wateringInfo.split('.')[0] : ''; // Return first sentence
};