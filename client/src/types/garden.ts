// Plant information interface
import { PlantGrowthType } from '../utils/plantUtils'

export interface PlantInfo {
    id: string;
    plantName?: string;
    image?: string;
  }
  
  // Plant placement in garden
  export interface PlantPlacement {
    row: number;
    col: number;
    plantId: string;
    plantName?: string;
    image?: string;
  }
  
  // Garden interface
  export interface GardenType {
    id: string;
    name: string;
    rows: number;
    cols: number;
    plants?: PlantPlacement[];
  }

  // Database Plant Interface
export interface DBPlant {
  _id: string;
  plantName: string;
  plantType: string;
  plantVariety: string;
  plantDescription: string;
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
  growthType?: string; 
  isVerticalGrower?: boolean; 
  plantsPerSquareFoot: number;
}

// Plant Interface for use in the garden planner
export interface Plant {
  id: string;
  name: string;
  variety: string;
  width: number;
  height: number;
  spacing: number;
  sunlight: string;
  water: string;
  growthType?: PlantGrowthType; 
  isVerticalGrower?: boolean; 
  plantsPerSquareFoot: number;
  image?: string;
}

// Plot Size Interface
export interface PlotSize {
  id?: string;
  name?: string;
  rows: number;
  cols: number;
}