import React from 'react';
import { Plant } from '../types/garden';

interface PlantLegendProps {
  garden: (Plant | null)[][];
  plantTypes: Plant[];
}

export const PlantLegend: React.FC<PlantLegendProps> = ({
  garden,
  plantTypes
}) => {
  // Get unique plant IDs from the garden
  const usedPlantIds = Array.from(
    new Set(garden.flat().filter(Boolean).map(plant => plant?.id))
  );

  return (
    <div className="legend-items" style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      {/* Only show used plants in the legend */}
      {usedPlantIds.map(id => {
        const plant = plantTypes.find(p => p.id === id);
        if (!plant) return null;

        return (
          <div
            key={plant.id}
            className="legend-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <img
              src={plant.image}
              alt={plant.name}
              style={{
                width: '25px',
                height: '25px',
                marginRight: '8px',
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{plant.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {plant.plantsPerSquareFoot} plants per square foot
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlantLegend;