import React from 'react';


interface PlotSizeSelectorProps {
  selectedPlotSize: { 
    rows: number;
    cols: number;
  }
  handlePlotSizeChange: (newSize: {rows: number, cols: number}) => void;
}

export const PlotSizeSelector: React.FC<PlotSizeSelectorProps> = ({
  selectedPlotSize,
  handlePlotSizeChange
}) => {
  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rows = parseInt(e.target.value) || 1;
    handlePlotSizeChange({
      ...selectedPlotSize,
      rows: Math.max(1, rows) // Ensure at least 1 row
    });
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cols = parseInt(e.target.value) || 1;
    handlePlotSizeChange({
      ...selectedPlotSize,
      cols: Math.max(1, cols) // Ensure at least 1 column
    });
  };

  return (
    <div className="plot-size-selector">
      <h3 className="section-title">Define Your Plot Size</h3>
      <div className="plot-size-inputs-row">
        <div className="input-group">
          <label htmlFor="plotRows">Rows:</label>
          <input
             id="plotRows"
             type="number"
             min="1"
             value={selectedPlotSize.rows}
             onChange={handleRowsChange}
             className="plot-size-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="plotCols">Columns:</label>
          <input
             id="plotCols"
             type="number"
             min="1"
             value={selectedPlotSize.cols}
             onChange={handleColsChange}
             className="plot-size-input"
          />
        </div>
      </div>
      {/* <p className="size-info">
        Total area: {selectedPlotSize.rows * selectedPlotSize.cols} sq ft
      </p> */}
    </div>
  );
};

export default PlotSizeSelector;