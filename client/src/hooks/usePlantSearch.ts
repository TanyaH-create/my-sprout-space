// hooks/usePlantSearch.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_PLANTS_QUERY } from '../graphQL/queries';
import { Plant } from '../types/garden';
import { calculatePlantsPerSquareFoot } from '../utils/plantUtils';

interface UsePlantSearchReturn {
  searchTerm: string;
  searchResults: Plant[];
  isSearching: boolean;
  searchError: string;
  executeSearch: boolean;
  setExecuteSearch: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

export function usePlantSearch(): UsePlantSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Plant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [executeSearch, setExecuteSearch] = useState(false);
  
  // GraphQL query for searching plants
  const { error, refetch, data: searchData } = useQuery(SEARCH_PLANTS_QUERY, {
    variables: { searchTerm, limit: 8 },
    skip: !executeSearch || !searchTerm.trim(),
  });
  
  // Effect for handling search results
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
  
  // Effect for handling errors
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
  
  return {
    searchTerm,
    searchResults,
    isSearching,
    searchError,
    executeSearch,
    setExecuteSearch,
    handleSearchChange,
    handleSearchSubmit
  };
} 