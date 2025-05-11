import React from 'react';
import { Plant } from '../types/garden';
import { PlantGrowthType, formatPlantDensity } from '../utils/plantUtils';
import PlantingDensityGrid from './PlantingDensityGrid';

interface PlantDensityInfoProps {
  plant: Plant | null;
}

const PlantDensityInfo: React.FC<PlantDensityInfoProps> = ({ plant }) => {
  if (!plant) {
    return (
      <div className="plant-density-info empty-state">
        <p>Select a plant to view spacing information</p>
      </div>
    );
  }

  // Function to get spacing explanation text based on square foot gardening rules
  const getSpacingExplanation = (spacing: number): string => {
    if (spacing >= 36) return "Plants requiring 36\" spacing need 1 square foot for every 4 plants.";
    if (spacing >= 24) return "Plants requiring 24\" spacing need 1 square foot for every 3 plants.";
    if (spacing >= 18) return "Plants requiring 18\" spacing need 1 square foot for every 2 plants.";
    if (spacing >= 12) return "Plants requiring 12\" spacing need 1 square foot per plant.";
    if (spacing >= 8) return "Plants requiring 8\" spacing can fit 2 plants per square foot.";
    if (spacing >= 6) return "Plants requiring 6\" spacing can fit 4 plants per square foot.";
    if (spacing >= 4) return "Plants requiring 4\" spacing can fit 9 plants per square foot.";
    return "Plants requiring 3\" spacing or less can fit 16 plants per square foot.";
  };

  // Get growth type explanation
  const getGrowthTypeExplanation = (growthType: PlantGrowthType): string => {
    switch(growthType) {
      case PlantGrowthType.VERTICAL:
        return "This plant grows vertically and should be provided with a trellis or other support. Plant 1 per square foot.";
      case PlantGrowthType.VERTICAL_BEAN_PEA:
        return "This plant is a vertical-growing bean or pea that can be planted at 9 plants per square foot with proper support.";
      default:
        return "";
    }
  };

  // Get plant spacing patterns
  const getPlantingPattern = (plantsPerSquareFoot: number): string => {
    if (plantsPerSquareFoot === 16) return "Plant in a 4×4 grid, 3 inches apart.";
    if (plantsPerSquareFoot === 9) return "Plant in a 3×3 grid, 4 inches apart.";
    if (plantsPerSquareFoot === 4) return "Plant in a 2×2 grid, 6 inches apart.";
    if (plantsPerSquareFoot === 2) return "Plant 2 plants, 8 inches apart.";
    if (plantsPerSquareFoot === 1) return "Plant 1 plant in the center of the square.";
    if (plantsPerSquareFoot === 0.5) return "Plant 1 plant in the center of a 2 square foot area.";
    if (plantsPerSquareFoot === 0.33) return "Plant 1 plant in the center of a 3 square foot area.";
    if (plantsPerSquareFoot === 0.25) return "Plant 1 plant in the center of a 4 square foot area.";
    return "Custom planting density.";
  };

  return (
    <div className="plant-density-info">
      <h3>{plant.name} Planting Guide</h3>
      
      <div className="density-info-container" style={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: '20px',
        margin: '15px 0'
      }}>
        {/* Left side - text information */}
        <div className="density-text-info" style={{ flex: '1' }}>
          <div className="info-group">
            <div className="info-label">Plant Spacing:</div>
            <div className="info-value">{plant.spacing}" apart</div>
          </div>
          
          <div className="info-group">
            <div className="info-label">Plants per Square Foot:</div>
            <div className="info-value">{formatPlantDensity(plant.plantsPerSquareFoot)}</div>
          </div>
          
          {plant.growthType !== PlantGrowthType.NORMAL && (
     
            <div className="info-group">
              <div className="info-label">Growth Type:</div>
              <div className="info-value">
                {plant.growthType === PlantGrowthType.VERTICAL ? 'Vertical' : 'Vertical Bean/Pea'}
              </div>
            </div>
          )}
          
          <div className="info-group">
            <div className="info-label">Planting Pattern:</div>
            <div className="info-value">{getPlantingPattern(plant.plantsPerSquareFoot)}</div>
          </div>
          
          <div className="info-explanation" style={{ marginTop: '10px' }}>
            <p>{getSpacingExplanation(plant.spacing)}</p>
            {plant.growthType !== PlantGrowthType.NORMAL && (
              <p>{getGrowthTypeExplanation(plant.growthType as PlantGrowthType)}</p>
            )}
          </div>
        </div>
        
        {/* Right side - visual grid */}
        <div className="density-visual" style={{ flex: '1', maxWidth: '200px' }}>
          <PlantingDensityGrid 
            plantsPerSquareFoot={plant.plantsPerSquareFoot}
            growthType={plant.growthType as PlantGrowthType}
            spacing={plant.spacing}
            plantName={plant.name}
          />
        </div>
      </div>
      
      <div className="sq-foot-methodology-note" style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '0.9em',
        marginTop: '15px'
      }}>
        <strong>Square Foot Gardening Method:</strong> Plants are arranged based on their spacing needs:
        3" spacing = 16 plants per sq ft | 4" spacing = 9 plants per sq ft | 6" spacing = 4 plants per sq ft |
        8" spacing = 2 plants per sq ft | 12" spacing = 1 plant per sq ft | 18" spacing = 1 plant per 2 sq ft |
        24" spacing = 1 plant per 3 sq ft | 36" spacing = 1 plant per 4 sq ft
      </div>
    </div>
  );
};

export default PlantDensityInfo;