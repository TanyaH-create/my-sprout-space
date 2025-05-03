 // hooks/useGardenState.ts
import { useState, useEffect } from 'react';
import { Plant, PlotSize } from '../types/garden';

interface UseGardenStateProps {
  selectedPlotSize: PlotSize;
  isLoadingGarden: boolean;
  gardensLoaded: boolean;
}

interface UseGardenStateReturn {
  garden: (Plant | null)[][];
  setGarden: React.Dispatch<React.SetStateAction<(Plant | null)[][]>>;
  handleCellClick: (rowIndex: number, colIndex: number, selectedPlant: Plant | null) => void;
  handleRemovePlant: (rowIndex: number, colIndex: number) => void;
  handleClearGarden: () => void;
}

export function useGardenState({
  selectedPlotSize,
  isLoadingGarden,
  gardensLoaded
}: UseGardenStateProps): UseGardenStateReturn {
  const [garden, setGarden] = useState<(Plant | null)[][]>([]);
  
  // Initialize garden grid when plot size changes
  useEffect(() => {
    if (!isLoadingGarden && !gardensLoaded) {
      setGarden(
        Array(selectedPlotSize.rows).fill(null).map(() => Array(selectedPlotSize.cols).fill(null))
      );
    }
  }, [selectedPlotSize, isLoadingGarden, gardensLoaded]);
  
  // Handle placing a plant in the garden
  const handleCellClick = (rowIndex: number, colIndex: number, selectedPlant: Plant | null): void => {
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
  };
  
  return {
    garden,
    setGarden,
    handleCellClick,
    handleRemovePlant,
    handleClearGarden
  };
}