import React from 'react';
import { Plant, PlotSize } from '../types/garden';

interface GardenGridProps {
  garden: (Plant | null)[][];
  selectedPlotSize: PlotSize;
  gardenName: string;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
  handleRemovePlant: (rowIndex: number, colIndex: number) => void;
}

export const GardenGrid: React.FC<GardenGridProps> = ({
  garden,
  selectedPlotSize,
  gardenName,
  handleCellClick,
  handleRemovePlant
}) => {
  return (
    <div className="garden-area">
      <div className="garden-title-print">
        <h3>{gardenName || "Square Foot Garden Plan"}</h3>
        <p>Grid size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet</p>
      </div>
      <div className="garden-grid-container">
        <div
          className="garden-grid"
          data-cols={selectedPlotSize.cols}
          style={{
            gridTemplateColumns: `repeat(${selectedPlotSize.cols}, 1fr)`, 
            gridTemplateRows: `repeat(${selectedPlotSize.rows}, 1fr)`
          }}
        >
          {garden.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleRemovePlant(rowIndex, colIndex);
                }}
              >
                {cell && (
                  <div
                    className="plant-in-grid"
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      textAlign: 'center'
                    }}
                  >
                    <div className="plant-image-container" style={{ position: 'relative' }}>
                      <img
                        src={cell.image}
                        alt={cell.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: 'black',
                        color: 'white',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {cell.plantsPerSquareFoot < 1 ? '1' : cell.plantsPerSquareFoot}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>
                      {cell.name}
                    </div>
                  </div>
                )}
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="grid-info">
        <p>Left click to place a plant. Right click to remove.</p>
        <p>Grid size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet (Each square = 1 sq ft)</p>
      </div>
    </div>
  );
};

export default GardenGrid;




// import React from 'react';
// import { GardenGrid as GardenGridType } from '../types';

// interface GardenGridProps {
//   garden: GardenGridType;
//   rows: number;
//   cols: number;
//   onCellClick: (rowIndex: number, colIndex: number) => void;
//   onCellRightClick: (rowIndex: number, colIndex: number) => void;
// }

// const GardenGrid: React.FC<GardenGridProps> = ({ 
//   garden, 
//   cols, 
//   onCellClick, 
//   onCellRightClick 
// }) => {
//   return (
//     <div className="bg-green-100 border-2 border-green-200 rounded overflow-hidden">
//       <div 
//         className="grid gap-px bg-green-300" 
//         style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
//       >
//         {garden.map((row, rowIndex) => (
//           row.map((cell, colIndex) => (
//             <div
//               key={`${rowIndex}-${colIndex}`}
//               className="aspect-square bg-green-100 relative cursor-pointer hover:bg-green-50 transition-colors"
//               onClick={() => onCellClick(rowIndex, colIndex)}
//               onContextMenu={(e: React.MouseEvent) => {
//                 e.preventDefault();
//                 onCellRightClick(rowIndex, colIndex);
//               }}
//             >
//               {cell && (
//                 <div
//                   className="absolute inset-1 rounded flex items-center justify-center"
//                   style={{ backgroundColor: cell.color }}
//                 >
//                   <span className="text-white text-xs font-bold">{cell.name[0]}</span>
//                 </div>
//               )}
//             </div>
//           ))
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GardenGrid;