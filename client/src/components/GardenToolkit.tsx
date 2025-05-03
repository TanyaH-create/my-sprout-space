import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PLANTS } from '../graphQL/queries'; // Adjust path as needed
import PlantCard from './PlantCard';
import { Plant, PlantData } from '../types/plantTypes';
import { formatSpacing, formatWater } from '../utils/plantUtils';
import '../styles/gardentoolkit.css';

/**
 * Main Garden Toolkit component
 */
const GardenToolkit: React.FC = (): React.ReactElement => {
  // State for the collapsible panel
  const [isOpen, setIsOpen] = useState<boolean>(false); // Default to closed to save space
  
  // State for the selected plant
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State for processed plants
  const [plants, setPlants] = useState<Plant[]>([]);
  
  // Query to fetch plants from database
  const { loading, error, data } = useQuery(GET_ALL_PLANTS);
  
  // Process plants data when it's loaded
  useEffect(() => {
    if (data && data.plants) {
      const processedPlants = data.plants.map((plant: PlantData) => ({
        id: plant._id,
        name: plant.plantName,
        density: plant.plantsPerSquareFoot,
        category: plant.plantType,
        spacing: formatSpacing(plant.spacing),
        water: formatWater(plant.plantWatering),
        waterDetails: plant.plantWatering,
        sunlight: plant.plantLight,
        image: plant.plantImage
      }));
      setPlants(processedPlants);
    }
  }, [data]);
  
  // Filter plants based on category and search term
  const filteredPlants = plants.filter(plant => {
    const matchesCategory = categoryFilter === 'All' || plant.category === categoryFilter;
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort plants by name
  const sortedPlants = [...filteredPlants].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Get unique categories from plants
  const categories = ['All', ...new Set(plants.map(plant => plant.category))];
  
  // Toggle the open/closed state
  const toggleOpen = (): void => {
    setIsOpen(!isOpen);
  };
  
  // Handle plant selection
  const handleSelect = (plant: Plant): void => {
    setSelectedPlant(
      selectedPlant?.id === plant.id ? null : plant
    );
  };
  
  return (
    <div className="garden-toolkit-container">
      <button 
        onClick={toggleOpen}
        className="toolkit-toggle-button"
      >
        <span>Planting Guide</span>
        <span>{isOpen ? '▼' : '►'}</span>
      </button>
      
      {isOpen && (
        <div className="toolkit-content">
          {/* Loading and error states */}
          {loading && <p className="loading-message">Loading plants...</p>}
          {error && <p className="error-message">Error loading plants: {error.message}</p>}
          
          {/* Search input */}
          <div className="toolkit-search-container">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="toolkit-search-input"
            />
          </div>
          
          {/* Category filter buttons */}
          <div className="filter-buttons">
            <span className="filter-label">Filter:</span>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`filter-button ${categoryFilter === category ? 'filter-button-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Plants heading with count */}
          <h3 className="plants-heading">Plants ({sortedPlants.length})</h3>
          <p className="plants-instructions">Click for details</p>
          
          {/* Density legend */}
          <div className="density-legend">
            <h4 className="legend-title">Planting Density</h4>
            <div className="density-indicators">
              <span className="density-indicator density-very-low">Very Low (0-0.25)</span>
              <span className="density-indicator density-low">Low (0.26-0.5)</span>
              <span className="density-indicator density-medium">Medium (0.51-1)</span>
              <span className="density-indicator density-high">High (1.1-4)</span>
              <span className="density-indicator density-very-high">Very High (4.1-9)</span>
              <span className="density-indicator density-ultra-high">Ultra High (9.1-16)</span>
            </div>
          </div>
          
          {sortedPlants.length === 0 && !loading ? (
            <p className="no-results">No plants match your search or filter</p>
          ) : (
            <div className="plant-grid">
              {/* Plant cards */}
              {sortedPlants.map((plant: Plant): React.ReactElement => (
                <PlantCard 
                  key={plant.id}
                  plant={plant}
                  isSelected={selectedPlant?.id === plant.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
          
          {/* Watering information */}
          <div className="watering-info">
            <h4 className="watering-info-title">Watering Guide</h4>
            <p><strong>1 inch of water</strong> = 0.62 gallons per square foot</p>
            <p><strong>Measuring:</strong> Use rain gauge or can when watering</p>
            <p><strong>Converting to gallons:</strong></p>
            <ul className="watering-info-list">
              <li>12" container: 1" water = 0.6 gal</li>
              <li>16" container: 1" water = 0.9 gal</li>
              <li>24" container: 1" water = 1.9 gal</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenToolkit;