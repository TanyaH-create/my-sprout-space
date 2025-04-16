import {GardenType, PlantInfo } from '../types/garden';

interface GardenPreviewProps {
    garden: GardenType;
}
  
const GardenPreview = ({ garden }: GardenPreviewProps) => {
    const { rows, cols, plants } = garden;
    
    // Create a grid with null cells
    const grid: (PlantInfo | null)[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));
    
    // Place plants in the grid
    if (plants && plants.length > 0) {
      plants.forEach((plant) => {
        if (plant.row < rows && plant.col < cols) {
          grid[plant.row][plant.col] = { 
            id: plant.plantId,
            plantName: plant.plantName,
            color: plant.color || '#4CAF50', // Default green if no color provided
            image: plant.image
          };
        }
      });
    }
    
    return (
      <div 
        className="garden-preview-grid"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '1px',
          backgroundColor: '#e0e0e0',
          width: '100%',
          height: '100%'
        }}
      >
        {grid.map((row, rowIndex) => 
          row.map((plant, colIndex) => {
            // Determine if we have a valid image URL to display
            const hasValidImage = plant?.image && plant.image.trim() !== '';
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`preview-cell ${hasValidImage ? 'with-image' : ''}`}
                style={{
                  backgroundColor: hasValidImage ? 'transparent' : (plant ? plant.color : '#f9f9f9'),
                  backgroundImage: hasValidImage ? `url(${plant.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  aspectRatio: '1/1',
                  position: 'relative'
                }}
                title={plant ? plant.plantName || 'Plant' : 'Empty space'}
              >
                {/* Optional: Add plant name overlay on hover */}
                {plant && plant.plantName && (
                  <div className="plant-name-overlay">
                    {plant.plantName}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

export default GardenPreview;