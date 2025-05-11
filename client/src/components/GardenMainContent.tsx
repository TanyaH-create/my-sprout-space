// components/garden/GardenMainContent.tsx
import React from 'react';
import GardenGrid from './GardenGrid';
import { GardenMainContentProps } from '../types/garden-components';

const GardenMainContent: React.FC<GardenMainContentProps> = ({
  garden,
  selectedPlotSize,
  gardenName,
  handleCellClick,
  handleRemovePlant,
  selectedPlant
}) => {
  return (
    <div className="garden-right-content" style={{ flex: 1 }}>
      {/* Garden Grid */}
      <GardenGrid 
        garden={garden}
        selectedPlotSize={selectedPlotSize}
        gardenName={gardenName}
        handleCellClick={handleCellClick}
        handleRemovePlant={handleRemovePlant}
      />

      {/* Plant Selection */}
      <div className="plant-selection-bottom">
        {/* Selected Plant Info */}
        {selectedPlant && (
          <div className="selected-plant-info">
            <div className="selected-plant-header">
              <div className="selected-plant-image">
                <img src={selectedPlant.image} alt={selectedPlant.name} />
              </div>
              <h3>Selected: {selectedPlant.name}</h3>
            </div>
            <div className="plant-quick-info">
              <span>Spacing: {selectedPlant.spacing} inches</span> |
              <span>Plants per square foot: {selectedPlant.plantsPerSquareFoot}</span> |
              <span>Sunlight: {selectedPlant.sunlight}</span> |
              <span>Water: {selectedPlant.water}</span> |
              <span>{(selectedPlant.isVerticalGrower) ? 'This plant grows vertically and should be provided with a trellis or other support' : '' }</span> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenMainContent;