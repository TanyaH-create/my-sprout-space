import React from 'react';
import { PlotSize } from '../types/garden';

interface PlotSizeSelectorProps {
  plotSizes: PlotSize[];
  selectedPlotSize: PlotSize;
  handlePlotSizeChange: (plotSizeId: string) => void;
}

export const PlotSizeSelector: React.FC<PlotSizeSelectorProps> = ({
  plotSizes,
  selectedPlotSize,
  handlePlotSizeChange
}) => {
  return (
    <div className="plot-size-selector">
      <label htmlFor="plotSize">Plot Size:</label>
      <select
        id="plotSize"
        value={selectedPlotSize.id}
        onChange={(e) => handlePlotSizeChange(e.target.value)}
        className="plot-size-select"
      >
        {plotSizes.map(size => (
          <option key={size.id} value={size.id}>
            {size.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PlotSizeSelector;