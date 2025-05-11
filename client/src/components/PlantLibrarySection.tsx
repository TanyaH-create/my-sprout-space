// components/garden/PlantLibrarySection.tsx
import React from 'react';
import PlantSearch from './PlantSearch';
import PlantPalette from './PlantPalette';
import PlantCarePanel from './PlantCarePanel';
import PlantDensityInfo from './PlantingDensityInfo'
import { PlantLibrarySectionProps } from '../types/garden-components';


const PlantLibrarySection: React.FC<PlantLibrarySectionProps> = ({
  searchTerm,
  isSearching,
  handleSearchChange,
  handleSearchSubmit,
  searchResults,
  searchError,
  addPlantToPalette,
  handleAddPlantClick,
  filteredPlants,
  selectedPlant,
  handlePlantSelect
}) => {
  return (
    <div className="plant-library-section">
      <h2>Plant Library</h2>
      <div className="plant-library-search">
        <PlantSearch 
          searchTerm={searchTerm}
          isSearching={isSearching}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
          searchResults={searchResults}
          searchError={searchError}
          addPlantToPalette={addPlantToPalette}
          renderAddPlantButton={
            <button 
              className="add-plant-button" 
              onClick={handleAddPlantClick}
              type="button"
            >
              Add Plant
            </button>
          }
        />
      </div>
      
      {/* Plant Palette */}
      <PlantPalette 
        plants={filteredPlants}
        selectedPlant={selectedPlant}
        onPlantSelect={handlePlantSelect}
      />

      {/* Plant Legend */}
      <div className="legend">
        <div className="plantcare-container">
          <PlantCarePanel plantName={selectedPlant?.name || ''} />
          <PlantDensityInfo plant={selectedPlant} />
        </div>
      </div>
    </div>
  );
};

export default PlantLibrarySection;