//helpers.ts

// utils/helpers.js or .ts
export enum PlantGrowthType {
  NORMAL = 'normal',
  VERTICAL = 'vertical',
  VERTICAL_BEAN_PEA = 'vertical_bean_pea'
}

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