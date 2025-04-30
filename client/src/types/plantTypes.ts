/**
 * Interface for plant data from database
 */
export interface PlantData {
    _id: string;
    plantName: string;
    plantType: string;
    plantVariety: string;
    plantImage: string;
    plantWatering: string;
    plantLight: string;
    plantSoil: string;
    plantFertilizer: string;
    plantHumidity: string;
    plantTemperature: string;
    plantToxicity: string;
    plantPests: string;
    plantDiseases: string;
    spacing: number;
    plantsPerSquareFoot: number;
    color: string;
  }
  
  /**
   * Interface defining a plant's properties for display
   */
  export interface Plant {
    readonly id: string;
    readonly name: string;
    readonly density: number; // Same as plantsPerSquareFoot
    readonly category: string; // Same as plantType
    readonly spacing: string; // Formatted spacing
    readonly water: string; // Using plantWatering
    readonly waterDetails: string; // Using plantWatering
    readonly sunlight: string; // Using plantLight
    readonly image: string; // Using plantImage
  }