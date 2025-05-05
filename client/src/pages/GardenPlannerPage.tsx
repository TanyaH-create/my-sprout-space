// pages/GardenPlannerPage.tsx - Updated version with all errors fixed

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { SAVE_GARDEN_MUTATION } from '../graphQL/mutations';
import { GET_GARDEN_BY_ID, GET_ALL_PLANTS } from '../graphQL/queries';

import '../styles/Gardenplanner.css';
import { Plant, PlotSize } from '../types/garden';
import { convertDbPlantToLocalPlant, PlantGrowthType } from '../utils/plantUtils';
import { useGardenState } from '../hooks/useGardenState';
import { usePlantSearch } from '../hooks/usePlantSearch';

// Import new components
import GardenControls from '../components/GardenControls';
import GardenMainContent from '../components/GardenMainContent';
import PlantLibrarySection from '../components/PlantLibrarySection';
import SaveGardenDialog from '../components/SaveGardenDialog';
import AddPlantForm from '../components/AddPlantForm';

const GardenPlannerPage: React.FC = () => {
  // Core state
  const [selectedPlotSize, setSelectedPlotSize] = useState<PlotSize>({
    rows: 2,
    cols: 6,
    id: 'custom',
    name: 'Custom Size'
  });
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantTypes, setPlantTypes] = useState<Plant[]>([]);
  const [gardenName, setGardenName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddPlantForm, setShowAddPlantForm] = useState(false);
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const [gardensLoaded, setGardensLoaded] = useState(false);

  
  // Use a ref to prevent infinite update loops
  const queryAttemptedRef = useRef(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gardenId = queryParams.get('gardenId');
  
  // Custom hooks
  const {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    handleSearchChange,
    handleSearchSubmit
  } = usePlantSearch();
  
  const {
    garden,
    setGarden, // This is used in useEffect and handleSaveGarden
    handleCellClick,
    handleRemovePlant,
    handleClearGarden
  } = useGardenState({
    selectedPlotSize,
    isLoadingGarden,
    gardensLoaded
  });

  // Query to get all plants
  const { loading: plantsLoading, error: plantsError, data: plantsData, refetch: refetchPlants } = useQuery(GET_ALL_PLANTS, {
    onError: (error) => {
      console.error('Error loading plants:', error);
    }
  });
  
  // Process plants data
  useEffect(() => {
    if (plantsData && plantsData.plants) {
      const convertedPlants = plantsData.plants.map(convertDbPlantToLocalPlant);
      setPlantTypes(convertedPlants);
    }
  }, [plantsData]);
  
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

        // Create plot size object from garden data
        const loadedPlotSize: PlotSize = {
          rows: gardenData.garden.rows,
          cols: gardenData.garden.cols,
          id: 'custom',
          name: `Custom (${gardenData.garden.rows}x${gardenData.garden.cols})`
        };

        // We use setSelectedPlotSize here - this was missing in the refactored code
        setSelectedPlotSize(loadedPlotSize);

        // Create new empty garden grid with the correct dimensions
        const newGarden = Array(gardenData.garden.rows)
          .fill(null)
          .map(() => Array(gardenData.garden.cols).fill(null));

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
                width: 1,
                height: 1,
                spacing: parseInt(plant.spacing, 10) || 12,
                growthType: plant.growthType ? plant.growthType as PlantGrowthType : PlantGrowthType.NORMAL,
                isVerticalGrower: plant.isVerticalGrower || false,
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

        // Set the garden grid with the populated plants - using setGarden here
        setGarden(newGarden);

        // Add plants from garden to plantTypes palette if not already there
        const existingPlantIds = new Set(plantTypes.map(p => p.id));
        const newPlants: Plant[] = [];

        gardenData.garden.plants.forEach((plant: any) => {
          if (plant.plantId && !existingPlantIds.has(plant.plantId)) {
            newPlants.push({
              id: plant.plantId,
              name: plant.plantName || "Unknown Plant",
              width: 1,
              height: 1,
              spacing: parseInt(plant.spacing, 10) || 12,
              growthType: plant.growthType ? plant.growthType as PlantGrowthType : PlantGrowthType.NORMAL,
              isVerticalGrower: plant.isVerticalGrower || false,
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
      console.error("Garden not found after query completed");
      setIsLoadingGarden(false);
      setGardensLoaded(false);
    }
  }, [gardenData, gardenLoading, gardenId, plantTypes, gardensLoaded, setGarden]);
  
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
  
  // Add a plant from search results to the palette
  const addPlantToPalette = (plant: Plant) => {
    // Check if plant is already in the palette
    if (!plantTypes.some(p => p.id === plant.id)) {
      setPlantTypes([...plantTypes, plant]);
    }

    // Select the plant
    setSelectedPlant(plant);

    // Clear search results
    // setSearchResults([]);  // This would be handled in the custom hook
  };

  const handleAddPlantClick = () => {
    setShowAddPlantForm(true);
  };
  
  const handlePlantAdded = (newPlant) => {
    // Add the newly created plant to the plantTypes state
    const convertedPlant = convertDbPlantToLocalPlant(newPlant);
    setPlantTypes(prevPlants => [...prevPlants, convertedPlant]);
  };

  // Handle selecting a plant
  const handlePlantSelect = (plant: Plant): void => {
    setSelectedPlant(plant);
  };
  
  // Handle garden name change
  const handleGardenNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGardenName(e.target.value);
  };
  
  // Handle plot size change - IMPLEMENTED this function to fix the unused parameter error
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
  
  // Open save dialog
  const handleOpenSaveDialog = (): void => {
    setSaveError('');
    setShowSaveDialog(true);
  };
  
  // Handle garden save - IMPLEMENTED to use the saveGarden mutation
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
          spacing: plant.spacing,
          growthType: plant.growthType || PlantGrowthType.NORMAL,
          isVerticalGrower: plant.isVerticalGrower || false,
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
  
  // Filter plants based on local filtering
  const filteredPlants = plantTypes.filter(plant =>
    !searchTerm || plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="garden-planner">
      <h2>Plan Your Garden!</h2>
      <p className="intro-text">Start by defining your plot size and naming your garden plot. Select plants from the plant library below. Each card in the library shows how many of that type of plant can be planted in each square.</p>
      
      {/* Loading and error messages */}
      {plantsLoading && <div className="loading-message">Loading plants...</div>}
      {plantsError && <div className="error-message">Error loading plants: {plantsError.message}</div>}
      {saveSuccess && <div className="save-success">{saveSuccess}</div>}
      
      <div className="garden-layout">
        <GardenControls 
          selectedPlotSize={selectedPlotSize}
          handlePlotSizeChange={handlePlotSizeChange}
          gardenName={gardenName}
          handleGardenNameChange={handleGardenNameChange}
          handleClearGarden={handleClearGarden}
          handleOpenSaveDialog={handleOpenSaveDialog}
          handlePrintGarden={handlePrintGarden}
          saveLoading={saveLoading}
        />
        
        <GardenMainContent
          garden={garden}
          selectedPlotSize={selectedPlotSize}
          gardenName={gardenName}
          handleCellClick={(rowIndex, colIndex) => 
            handleCellClick(rowIndex, colIndex, selectedPlant)}
          handleRemovePlant={handleRemovePlant}
          selectedPlant={selectedPlant}
        />
      </div>
      
      <PlantLibrarySection
        searchTerm={searchTerm}
        isSearching={isSearching}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        searchResults={searchResults}
        searchError={searchError}
        addPlantToPalette={addPlantToPalette}
        handleAddPlantClick={handleAddPlantClick}
        filteredPlants={filteredPlants}
        selectedPlant={selectedPlant}
        handlePlantSelect={handlePlantSelect}
      />
      
      {/* Dialogs */}
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
      
      {showAddPlantForm && (
        <AddPlantForm 
          onClose={() => setShowAddPlantForm(false)}
          onPlantAdded={handlePlantAdded}
        />
      )}
      
      {/* Print Styles */}
      <style>
        {`/* ... your existing print styles ... */`}
      </style>
    </div>
  );
};

export default GardenPlannerPage;