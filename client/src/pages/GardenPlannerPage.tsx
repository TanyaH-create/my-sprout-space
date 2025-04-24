//GardenPlannerPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { SAVE_GARDEN_MUTATION } from '../graphQL/mutations';
import { SEARCH_PLANTS_QUERY, GET_GARDEN_BY_ID, GET_ALL_PLANTS } from '../graphQL/queries';

import '../styles/Gardenplanner.css';
import GardenToolkit from '../components/gardentoolkit';
import PlantSearch from '../components/PlantSearch';
import PlantPalette from '../components/PlantPalette';
import GardenGrid from '../components/GardenGrid';
import PlantCarePanel from '../components/PlantCarePanel';
import SaveGardenDialog from '../components/SaveGardenDialog';
import PlotSizeSelector from '../components/PlotSizeSelector';
import { Plant, DBPlant, PlotSize } from '../types/garden';
import { resolveImagePath } from '../utils/imageUtils';


// Calculate plants per square foot based on spacing
const calculatePlantsPerSquareFoot = (spacing: number): number => {
  if (spacing >= 18) return 0.25; // 1 plant per 4 squares
  if (spacing >= 12) return 1;
  if (spacing >= 6) return 4;
  if (spacing >= 4) return 9;
  return 16; // 3 inches or less spacing
};

// Convert database plant to local plant format
const convertDbPlantToLocalPlant = (dbPlant: DBPlant): Plant => {
  return {
    id: dbPlant._id,
    name: dbPlant.plantName,
    color: dbPlant.color,
    width: 1,
    height: 1,
    spacing: dbPlant.spacing,
    sunlight: dbPlant.plantLight,
    water: dbPlant.plantWatering,
    plantsPerSquareFoot: dbPlant.plantsPerSquareFoot,
    // image: dbPlant.plantImage
    image: resolveImagePath(dbPlant.plantImage)
  };
};

const GardenPlannerPage: React.FC = () => {

  // State
  const [selectedPlotSize, setSelectedPlotSize] = useState<PlotSize>({
    rows: 2,
    cols: 6,
    id: 'custom',
    name: 'Custom Size'
  }); 
  const [garden, setGarden] = useState<(Plant | null)[][]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantTypes, setPlantTypes] = useState<Plant[]>([]);
  const [searchResults, setSearchResults] = useState<Plant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [executeSearch, setExecuteSearch] = useState(false);
  const [gardenName, setGardenName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const [gardensLoaded, setGardensLoaded] = useState(false);
  
  // Use a ref instead of state for queryAttempted to prevent infinite update loops
  const queryAttemptedRef = useRef(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gardenId = queryParams.get('gardenId');

  // Query to get all plants from the database
  const { loading: plantsLoading, error: plantsError, data: plantsData } = useQuery(GET_ALL_PLANTS, {
    onError: (error) => {
        console.error('Error loading plants:', error);
    }
  });

  useEffect(() => {
    if (plantsData && plantsData.plants) {
      const convertedPlants = plantsData.plants.map(convertDbPlantToLocalPlant);
      setPlantTypes(convertedPlants);
    }
  }, [plantsData]);

  // Initialize garden grid when plot size changes
  useEffect(() => {
    // Only initialize an empty grid if we're not currently loading a garden
    // and no garden has been loaded yet
    if (!isLoadingGarden && !gardensLoaded) {
      setGarden(
        Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
      );
    }
  }, [selectedPlotSize, isLoadingGarden, gardensLoaded]);



  // GraphQL query for searching plants
  const { error, refetch, data: searchData } = useQuery(SEARCH_PLANTS_QUERY, {
    variables: { searchTerm, limit: 8 },
    skip: !executeSearch || !searchTerm.trim(),
  });
 
  useEffect(() => {
    if (searchData) {
      setExecuteSearch(false);
      setIsSearching(false);
      if (searchData && searchData.searchPlants && searchData.searchPlants.length > 0) {
        // Convert GraphQL plants to our plant format
        const graphqlPlants: Plant[] = searchData.searchPlants.map((plant: any) => {
          // Generate a color based on plant id
          const colors = ['#ff6b6b', '#ff9f43', '#1dd1a1', '#10ac84', '#2e86de', '#f9ca24', '#6ab04c', '#eb4d4b'];
          const plantId = parseInt(plant.id);
          const color = colors[plantId % colors.length];

          // Default spacing (can be adjusted)
          const spacing = 12;

          return {
            id: `gql-${plant.id}`,
            name: plant.commonName,
            color: color,
            width: 1,
            height: 1,
            spacing: spacing,
            plantsPerSquareFoot: calculatePlantsPerSquareFoot(spacing),
            sunlight: Array.isArray(plant.sunlight) && plant.sunlight.length > 0
              ? plant.sunlight.join(', ')
              : 'Unknown',
            water: plant.watering || 'Unknown',
            image: plant.defaultImage?.thumbnail || 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
          };
        });

        setSearchResults(graphqlPlants);
      } else {
        setSearchError('No plants found matching your search.');
        setSearchResults([]);
      }
    }
  }, [searchData]);

  // Load garden by ID if provided
  const { data: gardenData, loading: gardenLoading } = useQuery(
    GET_GARDEN_BY_ID,
    {
      variables: { id: gardenId },
      skip: !gardenId,
      onCompleted: () => {
        queryAttemptedRef.current = true;
      },
      onError: () => {
        queryAttemptedRef.current = true;
      }
    }
  );

  // Reset state when gardenId changes
  useEffect(() => {
    if (gardenId) {
      queryAttemptedRef.current = false;
      setIsLoadingGarden(true);
      setGardensLoaded(false);
    }
  }, [gardenId]);

  // Process garden data
  useEffect(() => {
    if (gardenData && gardenData.garden) {
      // Only proceed if we're not already loaded to prevent infinite updates
      if (!gardensLoaded) {
        console.log("Garden data loaded:", gardenData.garden);

        // Set garden name
        setGardenName(gardenData.garden.name);

        // // Find the matching plot size or use default
        // const plotSize = plotSizes.find(
        //   size => size.rows === gardenData.garden.rows && size.cols === gardenData.garden.cols
        // ) || plotSizes[1];

        // UPDATED: Create plot size object from garden data
        const loadedPlotSize: PlotSize = {
          rows: gardenData.garden.rows,
          cols: gardenData.garden.cols,
          id: 'custom',
          name: `Custom (${gardenData.garden.rows}x${gardenData.garden.cols})`
        };

        // setSelectedPlotSize(plotSize);
        setSelectedPlotSize(loadedPlotSize)

        // Create new empty garden grid with the correct dimensions
        const newGarden = Array(gardenData.garden.rows)
          .fill(null)
          .map(() => Array(gardenData.garden.cols).fill(null));

        // Log plants for debugging
        console.log("Plants to place:", gardenData.garden.plants);

        // Populate plants with explicit parsing of indices
        if (gardenData.garden.plants && gardenData.garden.plants.length > 0) {
          gardenData.garden.plants.forEach((plant: any) => {
            const rowIndex = parseInt(plant.row, 10);
            const colIndex = parseInt(plant.col, 10);

            // Validate indices
            if (
              !isNaN(rowIndex) &&
              !isNaN(colIndex) &&
              rowIndex >= 0 &&
              rowIndex < gardenData.garden.rows &&
              colIndex >= 0 &&
              colIndex < gardenData.garden.cols
            ) {
              // Create plant object with all required properties
              newGarden[rowIndex][colIndex] = {
                id: plant.plantId || "",
                name: plant.plantName || "Unknown Plant",
                color: plant.color || "#4CAF50",
                width: 1,
                height: 1,
                spacing: parseInt(plant.spacing, 10) || 12,
                plantsPerSquareFoot: parseFloat(plant.plantsPerSquareFoot) || 1,
                sunlight: plant.sunlight || "Unknown",
                water: plant.water || "Unknown",
                image: plant.image || 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
              };
            } else {
              console.error(`Invalid plant placement: row=${rowIndex}, col=${colIndex}`);
            }
          });
        }

        // Set the garden grid with the populated plants
        setGarden(newGarden);

        // Add plants from garden to plantTypes palette if not already there
        const existingPlantIds = new Set(plantTypes.map(p => p.id));
        const newPlants: Plant[] = [];

        gardenData.garden.plants.forEach((plant: any) => {
          if (plant.plantId && !existingPlantIds.has(plant.plantId)) {
            newPlants.push({
              id: plant.plantId,
              name: plant.plantName || "Unknown Plant",
              color: plant.color || "#4CAF50",
              width: 1,
              height: 1,
              spacing: parseInt(plant.spacing, 10) || 12,
              plantsPerSquareFoot: parseFloat(plant.plantsPerSquareFoot) || 1,
              sunlight: plant.sunlight || "Unknown",
              water: plant.water || "Unknown",
              image: plant.image || 'https://cdn-icons-png.flaticon.com/128/628/628324.png'
            });
            existingPlantIds.add(plant.plantId);
          }
        });

        if (newPlants.length > 0) {
          setPlantTypes(prevPlants => [...prevPlants, ...newPlants]);
        }

        // Mark garden as loaded AFTER all state is updated
        queryAttemptedRef.current = true;
        
        // Delay setting these states to prevent infinite renders
        setTimeout(() => {
          setGardensLoaded(true);
          setIsLoadingGarden(false);
        }, 0);
      }
    } else if (queryAttemptedRef.current && !gardenLoading && gardenId) {
      // Only show error if:
      // - We've attempted the query (not just initial undefined state)
      // - The query is not still loading
      // - We have a gardenId (so we expected to find something)
      console.error("Garden not found after query completed");
      setIsLoadingGarden(false);
      setGardensLoaded(false);
    }
  }, [gardenData, gardenLoading, gardenId, plantTypes, gardensLoaded]);

  // GraphQL mutation for saving gardens
  const [saveGarden, { loading: saveLoading }] = useMutation(SAVE_GARDEN_MUTATION, {
    onCompleted: (data) => {
      setSaveSuccess(`Garden "${data.saveGarden.name}" saved successfully!`);
      setShowSaveDialog(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    },
    onError: (err) => {
      setSaveError(`Error saving garden: ${err.message}`);
    }
  });

  // Handle GraphQL errors
  useEffect(() => {
    if (error) {
      console.error('GraphQL error:', error);
      setSearchError(`Error searching plants: ${error.message}. Please try again.`);
      setIsSearching(false);
    }
  }, [error]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    // If search term is empty, clear results
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setExecuteSearch(true);

    // Trigger the GraphQL query
    refetch({ searchTerm, limit: 8 });
  };

  // Add a plant from search results to the palette
  const addPlantToPalette = (plant: Plant) => {
    // Check if plant is already in the palette
    if (!plantTypes.some(p => p.id === plant.id)) {
      setPlantTypes([...plantTypes, plant]);
    }

    // Select the plant
    setSelectedPlant(plant);

    // Clear search results
    setSearchResults([]);
    setSearchTerm('');
  };

  // Handle selecting a plant
  const handlePlantSelect = (plant: Plant): void => {
    setSelectedPlant(plant);
  };

  // Handle placing a plant in the garden
  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    if (!selectedPlant) return;

    // Check if space is available
    if (garden[rowIndex][colIndex]) return;

    // Create a new garden grid with the selected plant placed
    const newGarden = [...garden];
    newGarden[rowIndex][colIndex] = {
      ...selectedPlant,
      image: selectedPlant.image || '' // Ensure image is a string
    };
    setGarden(newGarden);
  };

  // Handle removing a plant
  const handleRemovePlant = (rowIndex: number, colIndex: number): void => {
    if (!garden[rowIndex][colIndex]) return;

    const newGarden = [...garden];
    newGarden[rowIndex][colIndex] = null;
    setGarden(newGarden);
  };

  // Clear the entire garden
  const handleClearGarden = (): void => {
    setGarden(
      Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
    );
    setGardenName('');
  };

  // Change plot size
  // UPDATED: Handle plot size change
  const handlePlotSizeChange = (newSize: {rows: number, cols: number}): void => {
    // Check if garden has plants before resizing
    const hasPlants = garden.some(row => row.some(cell => cell !== null));
    
    if (hasPlants && gardensLoaded) {
      if (window.confirm("Changing the garden size will clear your current layout. Continue?")) {
        // User confirmed, proceed with resize
        const updatedPlotSize = {
          rows: newSize.rows,
          cols: newSize.cols,
          id: 'custom',
          name: `Custom (${newSize.rows}x${newSize.cols})`
        };
        
        setSelectedPlotSize(updatedPlotSize);
        
        // Reset garden with new dimensions
        setGarden(
          Array(newSize.rows).fill(null).map(() => Array(newSize.cols).fill(null))
        );
      }
      // If user cancels, do nothing and keep current size
    } else {
      // No plants or garden not yet loaded, safe to resize
      const updatedPlotSize = {
        rows: newSize.rows,
        cols: newSize.cols,
        id: 'custom',
        name: `Custom (${newSize.rows}x${newSize.cols})`
      };
      
      setSelectedPlotSize(updatedPlotSize);
      
      if (!isLoadingGarden) {
        // Only reset garden if we're not in the process of loading one
        setGarden(
          Array(newSize.rows).fill(null).map(() => Array(newSize.cols).fill(null))
        );
      }
    }
  };

  // Handle garden name change
  const handleGardenNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGardenName(e.target.value);
  };

  // Open save dialog
  const handleOpenSaveDialog = (): void => {
    setSaveError('');
    setShowSaveDialog(true);
  };

  // Handle garden save
  const handleSaveGarden = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!gardenName.trim()) {
      setSaveError('Please enter a name for your garden.');
      return;
    }

    // Format plants for the mutation, including additional details
    const plants = garden.flatMap((row, rowIndex) =>
      row.flatMap((plant, colIndex) =>
        plant ? [{
          plantId: plant.id,
          row: rowIndex,
          col: colIndex,
          // Include additional plant details for database
          plantName: plant.name,
          color: plant.color,
          spacing: plant.spacing,
          plantsPerSquareFoot: plant.plantsPerSquareFoot,
          sunlight: plant.sunlight,
          water: plant.water,
          // Store image path instead of the binary image
          image: plant.image
        }] : []
      )
    );
    
    // Execute the mutation
    saveGarden({
      variables: {
        name: gardenName,
        rows: selectedPlotSize.rows,
        cols: selectedPlotSize.cols,
        plants: plants
      }
    });
  };

  // Enhanced Print Garden function
  const handlePrintGarden = () => {
    // Add a temporary class to the body for print styling
    document.body.classList.add('printing-garden');
    
    // Create a temporary style element to help with print
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        .garden-grid {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .garden-grid[data-cols="${selectedPlotSize.cols}"] {
          grid-template-columns: repeat(${selectedPlotSize.cols}, 1fr) !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    
    // Focus on the garden area
    const gardenArea = document.querySelector('.garden-area');
    if (gardenArea) {
      gardenArea.scrollIntoView();
    }
    
    // Slight delay to ensure styles are applied
    setTimeout(() => {
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        document.body.classList.remove('printing-garden');
        document.head.removeChild(printStyle);
      }, 1000);
    }, 300);
  };

  // Filter plants based on local filtering (not GraphQL search)
  const filteredPlants = plantTypes.filter(plant =>
    !searchTerm || plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="garden-planner">
      <h1>My Garden Planner</h1>
      <p className="intro-text">Start by defining your plot size and naming your garden plot. Select plants from the plant library below. Each card in the library shows how many of that type of plant can be planted in each square.</p>
    
      
      {/* Garden Toolkit */}
      <div className="garden-layout">
        <GardenToolkit />
        <div className="garden-controls"></div>
      </div>
      
      {/* Loading and error messages */}
      {plantsLoading && <div className="loading-message">Loading plants...</div>}
      {plantsError && <div className="error-message">Error loading plants: {plantsError.message}</div>}
      {saveSuccess && <div className="save-success">{saveSuccess}</div>}

      <div className="garden-layout">
        <div className="garden-controls">

          {/* Controls Row */}
          <div className="controls-section">
            {/* Garden setup section - side by side and centered */}
            <div className="garden-setup-container">
              <div className="garden-setup-section">
                  {/* Plot Size Selector */}
                  <div className="setup-item">
                    <PlotSizeSelector 
                        selectedPlotSize={selectedPlotSize}
                        handlePlotSizeChange={handlePlotSizeChange}
                    />
                  </div>
        
                  {/* Garden name input */}
                  <div className="garden-name-input">
                    <h3 className="section-title">Name Your Garden</h3>
                    <input
                      type="text"
                      placeholder="Garden Name"
                      value={gardenName}
                      onChange={handleGardenNameChange}
                      className="garden-name-field"
                    />
                  </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="garden-planner-actions">
            
              <button className="clear-button" onClick={handleClearGarden}>
                Clear Garden
              </button>

              <button className="save-button" onClick={handleOpenSaveDialog} disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save Garden"}
              </button>
            
              <button className="print-button" onClick={handlePrintGarden}>
                Print Garden Plan
              </button>

            </div>
          </div>



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
                <span>Water: {selectedPlant.water}</span>
              </div>
            </div>
            )}
          </div>
          <div className='plant-library-section'>
             {/* Plant Search component - positioned at the top */}
            <h2>Plant Library</h2>
            <PlantSearch 
              searchTerm={searchTerm}
              isSearching={isSearching}
              handleSearchChange={handleSearchChange}
              handleSearchSubmit={handleSearchSubmit}
              searchResults={searchResults}
              searchError={searchError}
              addPlantToPalette={addPlantToPalette}
            />
            {/* Plant Palette */}
            <PlantPalette 
              plants={filteredPlants}
              selectedPlant={selectedPlant}
              onPlantSelect={handlePlantSelect}
            />

            {/* Plant Legend */}
             <div className="legend">
              {/* <h3>Legend</h3> */}
              {/* <PlantLegend 
                garden={garden}
                plantTypes={plantTypes}
              /> */}
            
             <div className="plantcare-container">
                <PlantCarePanel plantName={selectedPlant?.name || ''} />
             </div>
            </div> {/*legend*/}
          </div> {/*plant=library-sections*/}
        </div> {/*garden-controls */}
      </div> {/*garden-layouts*/}

      {/* Save Garden Dialog */}
      {showSaveDialog && (
        <SaveGardenDialog 
          gardenName={gardenName}
          selectedPlotSize={selectedPlotSize}
          garden={garden}
          saveError={saveError}
          saveLoading={saveLoading}
          onClose={() => setShowSaveDialog(false)}
          onSave={handleSaveGarden}
          onNameChange={handleGardenNameChange}
        />
      )}

      {/* Print Styles */}
      <style>
        {`
        @media print {
           /* Reset visibility for all elements */
          body * {
            visibility: hidden;
          }

         /* Only show the garden grid and its children */
          .garden-planner,
          .garden-planner *,
          .garden-area, 
          .garden-area * {
            visibility: visible;
          }
          
          /* Hide specific elements even in print view */
          .garden-controls, 
          .search-container, 
          .plant-selection-bottom,
          .clear-button, 
          .print-button,
          .add-row-button,
          .add-column-button,
          .garden-size-controls,
          .plant-list-container,
          .plantcare-container,
          .legend,
          .legend * {
            display: none !important;
            visibility: hidden !important;
          } 

          /* Container for the entire garden planner */
          .garden-planner {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0.5cm;
            position: relative;
            background-color: white !important;
          }
          
          /* Garden area should take up available space */
          .garden-area {
            width: 100%;
            margin: 0 auto;
            position: relative;
            padding: 0;
          }
                  
          .garden-title-print {
            display: block !important;
            text-align: center;
            margin-bottom: 20px;
          }
          
          /* Garden grid container */
          .garden-grid-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 0 auto;
          }
          
          /* Garden grid adjustments */
          .garden-grid {
            border: 2px solid black !important;
            page-break-inside: avoid;
            width: 100% !important;
            max-width: none !important;
            margin: 0 auto;
            display: grid;
            gap: 0px;
            background-color: #f0f0f0 !important;
            padding: 4px;
          }
          
          /* Grid cell sizing */
          .grid-cell {
            border: 1px solid black !important;
            box-shadow: none !important;
            min-width: 0 !important;
            min-height: 0 !important;
            width: auto !important;
            height: auto !important;
            aspect-ratio: 1 !important;
          }
          
          /* Ensure consistent grid sizing - override previous column settings */
          .garden-grid[data-cols="1"], 
          .garden-grid[data-cols="2"], 
          .garden-grid[data-cols="3"],
          .garden-grid[data-cols="4"], 
          .garden-grid[data-cols="6"], 
          .garden-grid[data-cols="10"], 
          .garden-grid[data-cols="12"] {
            max-width: 100% !important;
          }
          
          /* Grid information text */
          .grid-info {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
          }
                  
          @page {
            size: landscape;
            margin: 1cm;
          }
        }
        
        /* Styles for save dialog */
        .save-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .save-dialog {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
        }
        
        .save-error {
          color: #dc3545;
          margin-bottom: 15px;
          padding: 8px;
          background-color: #f8d7da;
          border-radius: 4px;
        }
        
        .save-success {
          color: #28a745;
          margin-bottom: 15px;
          padding: 8px;
          background-color: #d4edda;
          border-radius: 4px;
        }
        
        .dialog-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        `}
      </style>
    </div>
  );
};

export default GardenPlannerPage;