import React from 'react';
import { Plant } from '../types/garden';
import { resolveImagePath, handleImageError } from '../utils/imageUtils';
import { formatPlantDensity } from '../utils/plantUtils';


interface PlantPaletteProps {
  plants: Plant[];
  selectedPlant: Plant | null;
  onPlantSelect: (plant: Plant) => void;
}

export const PlantPalette: React.FC<PlantPaletteProps> = ({
  plants,
  selectedPlant,
  onPlantSelect
}) => {


  return (
  <div>
    <div className="plant-items" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    }}>

{plants.map((plant) => {
  console.log(`${plant.name}: spacing=${plant.spacing}, type=${plant.growthType}, density=${plant.plantsPerSquareFoot}`);
  return (
    <div
      key={plant.id}
      className={`plant-item ${selectedPlant?.id === plant.id ? 'plant-item-selected' : ''}`}
      style={{
        backgroundColor: 'white',
        border: selectedPlant?.id === plant.id ? '2px solid #4CAF50' : '1px solid #ddd',
        borderRadius: '4px',
        padding: '5px',
        width: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={() => onPlantSelect({ ...plant, image: plant.image || '/images/sprout.png' })}
    >
      <div style={{ width: '30px', height: '30px', marginBottom: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={resolveImagePath(plant.image)}
          alt={plant.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          onError={(e) => handleImageError(e, plant.name)}
        />
      </div>
      <span style={{ fontSize: '12px', textAlign: 'center' }}>{plant.name}</span>
      <span style={{ fontSize: '12px', textAlign: 'center' }}>{plant.variety}</span>
      <span className="plant-per-foot" style={{ fontSize: '12px', textAlign: 'center' }}>
        {formatPlantDensity(plant.plantsPerSquareFoot)}
      </span >
      <span style={{ fontSize: '10px', textAlign: 'center' }}>
         {(plant.isVerticalGrower) ? 'Grow Vertical' : ''}
      </span>
    </div>
  );
})}
     </div>

      {/* Attribution text placed at the bottom of the plant palette area */}
      <p style={{ 
        fontSize: '15px', 
        color: '#666', 
        textAlign: 'center',
      }}>
        <a href="https://www.flaticon.com/free-icons/sprout" 
           title="plant icons" 
           style={{ textDecoration: 'none', color: '#666' }}>
          Plant icons created by Freepik - Flaticon
        </a>
      </p>
  
  </div>
  );
};

export default PlantPalette;