import React from 'react';
import { Plant } from '../types/garden';

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
    <div className="plant-items" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      {plants.map((plant) => (
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
          onClick={() => onPlantSelect({ ...plant, image: plant.image || '' })}
        >
          <img
            src={plant.image}
            alt={plant.name}
            style={{ width: '30px', height: '30px', marginBottom: '4px' }}
          />
          <span style={{ fontSize: '12px', textAlign: 'center' }}>{plant.name}</span>
          <div className="plant-per-foot" style={{
            fontSize: '10px',
            color: '#666',
            backgroundColor: '#f0f0f0',
            padding: '2px 5px',
            borderRadius: '10px',
            marginTop: '2px'
          }}>
            {plant.plantsPerSquareFoot} per sq ft
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantPalette;