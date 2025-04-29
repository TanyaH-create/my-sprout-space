//helpers.ts

export const calculatePlantsPerSquareFoot = (spacing: number): number => {
    if (spacing >= 18) return 0.25; // 1 plant per 4 squares
    if (spacing >= 12) return 1;
    if (spacing >= 6) return 4;
    if (spacing >= 4) return 9;
    return 16; // 3 inches or less spacing
  };