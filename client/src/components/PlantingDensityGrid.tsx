import React from 'react';
import { PlantGrowthType } from '../utils/plantUtils';

interface PlantingDensityGridProps {
  plantsPerSquareFoot: number;
  growthType?: PlantGrowthType;
  spacing?: number;
  plantName?: string;
}

/**
 * A visual representation of plants per square foot
 */
const PlantingDensityGrid: React.FC<PlantingDensityGridProps> = ({
  plantsPerSquareFoot,
  growthType = PlantGrowthType.NORMAL,
  spacing = 12,
  plantName = "Plant"
}) => {
  // Determine grid configuration based on plants per square foot
  const getGridConfig = (): { rows: number, cols: number, totalPlants: number } => {
    if (plantsPerSquareFoot < 1) {
      return { rows: 1, cols: 1, totalPlants: 1 };
    } else if (plantsPerSquareFoot === 1) {
      return { rows: 1, cols: 1, totalPlants: 1 };
    } else if (plantsPerSquareFoot === 2) {
      return { rows: 1, cols: 2, totalPlants: 2 };
    } else if (plantsPerSquareFoot === 4) {
      return { rows: 2, cols: 2, totalPlants: 4 };
    } else if (plantsPerSquareFoot === 9) {
      return { rows: 3, cols: 3, totalPlants: 9 };
    } else if (plantsPerSquareFoot === 16) {
      return { rows: 4, cols: 4, totalPlants: 16 };
    } else {
      // For any other value, round to nearest whole number and make a square grid
      const totalPlants = Math.round(plantsPerSquareFoot);
      const gridDimension = Math.ceil(Math.sqrt(totalPlants));
      return { rows: gridDimension, cols: gridDimension, totalPlants };
    }
  };

  // Get a short name for the plant (first word or first 4 chars)
  const getShortPlantName = (): string => {
    if (!plantName) return "P";
    const firstWord = plantName.split(' ')[0];
    return firstWord.length <= 4 ? firstWord : firstWord.substring(0, 4);
  };

  // Special display for plants that take more than one square foot
  const renderLargePlantDisplay = () => {
    const squareFeetNeeded = Math.round(1 / plantsPerSquareFoot);
    const gridDimension = Math.ceil(Math.sqrt(squareFeetNeeded));
    
    return (
      <div className="large-plant-display">
        <div className="large-plant-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridDimension}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimension}, 1fr)`,
          width: '100%',
          height: '100%',
          border: '2px solid #4CAF50',
          backgroundColor: '#f1f8e9'
        }}>
          {Array.from({ length: gridDimension * gridDimension }).map((_, index) => (
            <div key={index} style={{
              border: '1px dashed #81C784',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px',
              fontSize: index === 0 ? '16px' : '10px',
              color: index === 0 ? '#2E7D32' : '#A5D6A7'
            }}>
              {index === 0 ? getShortPlantName() : ''}
            </div>
          ))}
        </div>
        <div className="large-plant-legend" style={{
          marginTop: '8px',
          fontSize: '12px',
          textAlign: 'center',
          color: '#2E7D32'
        }}>
          1 plant per {squareFeetNeeded} square feet
        </div>
      </div>
    );
  };

  // Render the normal grid display
  const renderGridDisplay = () => {
    const { rows, cols, totalPlants } = getGridConfig();
    
    return (
      <div className="plant-density-grid">
        <div className="grid-container" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '4px',
          width: '100%',
          height: '100%',
          border: '2px solid #4CAF50',
          padding: '4px',
          backgroundColor: '#f1f8e9'
        }}>
          {Array.from({ length: rows * cols }).map((_, index) => (
            <div 
              key={index} 
              className={index < totalPlants ? 'plant-cell' : 'empty-cell'}
              style={{
                backgroundColor: index < totalPlants ? '#81C784' : 'transparent',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
                color: index < totalPlants ? '#fff' : 'transparent',
                aspectRatio: '1',
                boxSizing: 'border-box'
              }}
            >
              {index < totalPlants ? getShortPlantName().charAt(0) : ''}
            </div>
          ))}
        </div>
        <div className="grid-legend" style={{
          marginTop: '8px',
          fontSize: '12px',
          textAlign: 'center',
          color: '#2E7D32'
        }}>
          {plantsPerSquareFoot} plants per square foot
        </div>
      </div>
    );
  };

  // Render vertical growing plant display
  const renderVerticalDisplay = () => {
    return (
      <div className="vertical-plant-display" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
        <div className="vertical-container" style={{
          border: '2px solid #4CAF50',
          backgroundColor: '#f1f8e9',
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Trellis representation */}
          <div className="trellis" style={{
            position: 'absolute',
            top: '5px',
            left: '10%',
            right: '10%',
            height: '80%',
            borderLeft: '1px dashed #4CAF50',
            borderRight: '1px dashed #4CAF50',
            borderTop: '1px dashed #4CAF50',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{
                width: '1px',
                height: '100%',
                backgroundColor: '#81C784',
                margin: '0 5px'
              }} />
            ))}
          </div>
          
          {/* Plant representation */}
          <div className="vertical-plant" style={{
            fontSize: '16px',
            color: '#2E7D32',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span>{getShortPlantName()}</span>
            <span style={{ fontSize: '18px' }}>🌱</span>
          </div>
        </div>
        <div className="vertical-legend" style={{
          marginTop: '8px',
          fontSize: '12px',
          textAlign: 'center',
          color: '#2E7D32'
        }}>
          {growthType === PlantGrowthType.VERTICAL_BEAN_PEA ? 
            '9 plants per square foot (vertical growing bean/pea)' : 
            '1 plant per square foot (vertical growing)'}
        </div>
      </div>
    );
  };

  return (
    <div className="planting-density-visualization" style={{
      width: '100%',
      maxWidth: '200px',
      margin: '0 auto'
    }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 8px 0', fontSize: '14px' }}>
        Square Foot Planting Guide
      </h3>
      
      {growthType !== PlantGrowthType.NORMAL ? 
        renderVerticalDisplay() : 
        plantsPerSquareFoot < 1 ? 
          renderLargePlantDisplay() : 
          renderGridDisplay()
      }
      
      {spacing && (
        <div className="spacing-info" style={{
          marginTop: '8px',
          fontSize: '12px',
          textAlign: 'center',
          color: '#555'
        }}>
          Plant spacing: {spacing} inches
        </div>
      )}
    </div>
  );
};

export default PlantingDensityGrid; 