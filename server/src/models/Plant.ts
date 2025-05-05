// server/models/Plant.js
import { Schema, model, Document } from 'mongoose';

// Define growth type enum values for the database
export enum PlantGrowthType {
  NORMAL = 'normal',
  VERTICAL = 'vertical',
  VERTICAL_BEAN_PEA = 'vertical_bean_pea'
}

interface IPlant extends Document {
    plantName: string;
    plantType: string;
    plantVariety?: string;
    plantImage?: string;
    plantWatering?: string;
    plantLight?: string;
    plantSoil?: string;
    plantFertilizer?: string;
    plantHumidity?: string;
    plantTemperature?: string;
    plantToxicity?: string;
    plantPests?: string;
    plantDiseases?: string;
    spacing: number;              // From seed packet
    growthType: PlantGrowthType;  // Manually set field for growth type
    isVerticalGrower: boolean;    // Quick flag for vertical growers
    plantsPerSquareFoot: number;  // Calculated field, not manually entered
}

const plantSchema = new Schema<IPlant>(
{
    plantName: {
        type: String,
        required: true,
        trim: true,
    },
    plantType: {
        type: String,           
        required: true,
        trim: true,
    },
    plantVariety: {
        type: String,
        required: false,
        trim: true,
    },
    plantImage: {
        type: String,
        required: false,
        trim: true,
    },
    plantWatering: {
        type: String,
        required: false,
        trim: true,
    },
    plantLight: {
        type: String,
        required: false,
        trim: true,
    },
    plantSoil: {
        type: String,
        required: false,
        trim: true,
    },
    plantFertilizer: {
        type: String,
        required: false,
        trim: true,
    },
    plantHumidity: {
        type: String,
        required: false,
        trim: true,
    },
    plantTemperature: {
        type: String,
        required: false,                 
        trim: true,
    },              
    plantToxicity: {
        type: String,
        required: false,
        trim: true,
    },
    plantPests: {   
        type: String,
        required: false,
        trim: true,
    },
    plantDiseases: {
        type: String,
        required: false,
        trim: true,
    },
    // Additional fields for garden planner
    spacing: {
        type: Number,
        required: true,
        default: 12
    },
    growthType: {
        type: String,
        enum: Object.values(PlantGrowthType),
        default: PlantGrowthType.NORMAL,
        required: true
    },
    isVerticalGrower: {
        type: Boolean,
        default: false
    },
    plantsPerSquareFoot: {
        type: Number,
        required: true,
        default: 1
    }
});

// Add pre-save hook to automatically calculate plants per square foot and update isVerticalGrower flag
plantSchema.pre('save', function(next) {
    // Always update isVerticalGrower based on growthType
    this.isVerticalGrower = this.growthType !== PlantGrowthType.NORMAL;
    
    // Always recalculate plantsPerSquareFoot based on spacing and growth type
    if (this.growthType === PlantGrowthType.VERTICAL) {
        this.plantsPerSquareFoot = 1;
    } else if (this.growthType === PlantGrowthType.VERTICAL_BEAN_PEA) {
        this.plantsPerSquareFoot = 9;
    } else {
        // Normal plants based on spacing
        if (this.spacing >= 36) this.plantsPerSquareFoot = 0.25;     // 1 per 4 sq ft
        else if (this.spacing >= 24) this.plantsPerSquareFoot = 0.33; // 1 per 3 sq ft
        else if (this.spacing >= 18) this.plantsPerSquareFoot = 0.5;  // 1 per 2 sq ft
        else if (this.spacing >= 12) this.plantsPerSquareFoot = 1;    // 1 per sq ft
        else if (this.spacing >= 8) this.plantsPerSquareFoot = 2;     // 2 per sq ft
        else if (this.spacing >= 6) this.plantsPerSquareFoot = 4;     // 4 per sq ft
        else if (this.spacing >= 4) this.plantsPerSquareFoot = 9;     // 9 per sq ft
        else this.plantsPerSquareFoot = 16;                          // 16 per sq ft (3" or less)
    }
    next();
});

const Plant = model<IPlant>('Plant', plantSchema);
export default Plant;