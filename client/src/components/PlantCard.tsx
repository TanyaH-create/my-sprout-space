import * as React from 'react';
import { Plant } from '../types/plantTypes';
import '../styles/gardentoolkit.css';

/**
 * Props for the plant card component
 */
interface PlantCardProps {
  plant: Plant;
  isSelected: boolean;
  onSelect: (plant: Plant) => void;
}

/**
 * Component to display a single plant card
 */
const PlantCard: React.FC<PlantCardProps> = ({ 
  plant, 
  isSelected, 
  onSelect 
}): React.ReactElement => {
  
  // Get density category class
  const getDensityCategoryClass = (density: number): string => {
    if (density <= 0.25) return "density-very-low";
    if (density <= 0.5) return "density-low";
    if (density <= 1) return "density-medium";
    if (density <= 4) return "density-high";
    if (density <= 9) return "density-very-high";
    return "density-ultra-high";
  };
  
  // Get density category text
  const getDensityCategory = (density: number): string => {
    if (density <= 0.25) return "Very Low";
    if (density <= 0.5) return "Low";
    if (density <= 1) return "Medium";
    if (density <= 4) return "High";
    if (density <= 9) return "Very High";
    return "Ultra High";
  };

  return (
    <div 
      onClick={() => onSelect(plant)}
      className={`plant-card ${getDensityCategoryClass(plant.density)} ${isSelected ? 'plant-card-selected' : ''}`}
    >
      <h3 className="plant-title">{plant.name}</h3>
      <div className="plant-details">
        <div className="density-info">
          <span><strong>Density:</strong> {plant.density}</span>
          <span className={`density-tag ${isSelected ? 'density-tag-selected' : ''}`}>
            {getDensityCategory(plant.density)}
          </span>
        </div>
        <p className="spacing-info"><strong>Spacing:</strong> {plant.spacing}</p>
        <p className="water-info"><strong>Water:</strong> {plant.water}</p>
        {isSelected && (
          <div className="expanded-info">
            <p><strong>Category:</strong> {plant.category}</p>
            <p><strong>Sunlight:</strong> {plant.sunlight}</p>
            <p className="watering-details"><strong>Watering:</strong> {plant.waterDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCard;