import React from 'react';
import { Plant, PlotSize } from '../types/garden';

interface SaveGardenDialogProps {
  gardenName: string;
  selectedPlotSize: PlotSize;
  garden: (Plant | null)[][];
  saveError: string;
  saveLoading: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SaveGardenDialog: React.FC<SaveGardenDialogProps> = ({
  gardenName,
  selectedPlotSize,
  garden,
  saveError,
  saveLoading,
  onClose,
  onSave,
  onNameChange
}) => {
  // Count plants in the garden
  const plantCount = garden.flat().filter(Boolean).length;

  return (
    <div className="save-dialog-overlay">
      <div className="save-dialog">
        <h3>Save Your Garden</h3>
        {saveError && <div className="save-error">{saveError}</div>}

        <form onSubmit={onSave}>
          <div className="form-group">
            <label htmlFor="gardenName">Garden Name:</label>
            <input
              type="text"
              id="gardenName"
              value={gardenName}
              onChange={onNameChange}
              placeholder="Enter a name for your garden"
              required
            />
          </div>

          <div className="form-group">
            <p>
              Size: {selectedPlotSize.rows} × {selectedPlotSize.cols} feet<br />
              Plants: {plantCount}
            </p>
          </div>

          <div className="dialog-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-confirm-button"
              disabled={saveLoading}
            >
              {saveLoading ? "Saving..." : "Save Garden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveGardenDialog;