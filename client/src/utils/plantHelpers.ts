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