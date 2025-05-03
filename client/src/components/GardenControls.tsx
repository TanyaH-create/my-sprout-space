 // components/garden/GardenControls.tsx
import React from 'react';
import PlotSizeSelector from './PlotSizeSelector';
import { GardenControlsProps } from '../types/garden-components';

const GardenControls: React.FC<GardenControlsProps> = ({
  selectedPlotSize,
  handlePlotSizeChange,
  gardenName,
  handleGardenNameChange,
  handleClearGarden,
  handleOpenSaveDialog,
  handlePrintGarden,
  saveLoading
}) => {
  return (
    <div className="garden-controls">
      <div className="controls-section">
        <div className="garden-main-container" style={{ display: 'flex', gap: '20px' }}>
          <div className="garden-left-controls" style={{ width: '270px', flexShrink: 0, overflow: 'hidden' }}>
            <div className="garden-setup-container">
              <div className="garden-setup-section" style={{ 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  padding: '15px',
                  maxWidth: '100%',
                  width: '100%',
                  boxSizing: 'border-box'
              }}>
                {/* Plot Size Selector */}
                <div className="setup-item" style={{ 
                    marginBottom: '15px', 
                    maxWidth: '100%',
                    width: '100%'
                }}>
                  <PlotSizeSelector 
                    selectedPlotSize={selectedPlotSize}
                    handlePlotSizeChange={handlePlotSizeChange}
                  />
                </div>
            
                {/* Garden name input */}
                <div className="garden-name-input" style={{ 
                  marginBottom: '15px',
                  maxWidth: '100%',
                  width: '100%'
                }}>
                  <h3 className="section-title">Name Your Garden</h3>
                  <input
                    type="text"
                    placeholder="Garden Name"
                    value={gardenName}
                    onChange={handleGardenNameChange}
                    className="garden-name-field"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
            
                {/* Action Buttons */}
                <div className="garden-planner-actions" style={{ 
                  flexDirection: 'column', 
                  gap: '10px',
                  marginTop: '10px',
                  maxWidth: '100%',
                  width: '100%'
                }}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenControls;