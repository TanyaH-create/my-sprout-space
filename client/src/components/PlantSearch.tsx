import React from 'react';
import { Plant } from '../types/garden';

export interface PlantSearchProps {
  searchTerm: string;
  isSearching: boolean;
  searchResults: Plant[];
  searchError: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  addPlantToPalette: (plant: Plant) => void;
  renderAddPlantButton?: React.ReactNode; 
}

const PlantSearch: React.FC<PlantSearchProps> = ({
  searchTerm,
  // isSearching,
  searchResults,
  searchError,
  handleSearchChange,
  handleSearchSubmit,
  addPlantToPalette,
  renderAddPlantButton
}) => {
   // Add a clear search function that clears the search input
   const handleClearSearch = () => {
    // Create a synthetic event to pass to handleSearchChange
    const event = {
      target: { value: '' },
      preventDefault: () => {}
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleSearchChange(event);
  };
  return (
    <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search plants..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* <button
          type="submit"
          className="search-button"
          disabled={isSearching}
        >
          {isSearching ? "..." : "Search"}
        </button> */}
        <button
            type="button"
            className="clear-search-button"
            onClick={handleClearSearch}
          >
            Clear
          </button>
          {renderAddPlantButton}
      
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results:</h4>
          {searchResults.map(plant => (
            <div
              key={plant.id}
              className="search-result-item"
              onClick={() => addPlantToPalette({ ...plant, image: plant.image || '' })}
            >
              <div className="result-image-container">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="result-image"
                />
              </div>
              <div className="result-details">
                <div className="result-name">{plant.name}</div>
                <div className="result-info">
                  Plants per sq ft: {plant.plantsPerSquareFoot}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchError && (
        <div className="search-error">{searchError}</div>
      )}
    </div>
  );
};

export default PlantSearch;