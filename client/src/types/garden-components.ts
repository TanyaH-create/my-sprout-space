// types/garden-components.ts
import { Plant, PlotSize } from '../types/garden';

export interface GardenControlsProps {
  selectedPlotSize: PlotSize;
  handlePlotSizeChange: (newSize: {rows: number, cols: number}) => void;
  gardenName: string;
  handleGardenNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearGarden: () => void;
  handleOpenSaveDialog: () => void;
  handlePrintGarden: () => void;
  saveLoading: boolean;
}

export interface GardenMainContentProps {
  garden: (Plant | null)[][];
  selectedPlotSize: PlotSize;
  gardenName: string;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
  handleRemovePlant: (rowIndex: number, colIndex: number) => void;
  selectedPlant: Plant | null;
}

export interface PlantLibrarySectionProps {
  searchTerm: string;
  isSearching: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  searchResults: Plant[];
  searchError: string;
  addPlantToPalette: (plant: Plant) => void;
  handleAddPlantClick: () => void;
  filteredPlants: Plant[];
  selectedPlant: Plant | null;
  handlePlantSelect: (plant: Plant) => void;
}
