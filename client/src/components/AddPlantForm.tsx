import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PLANT_MUTATION } from '../graphQL/mutations';
import { PlantGrowthType, calculatePlantsPerSquareFoot, suggestGrowthType, formatPlantDensity } from '../utils/plantUtils';
import PlantingDensityGrid from './PlantingDensityGrid';

interface AddPlantFormProps {
  onClose: () => void;
  onPlantAdded: (newPlant: any) => void;
}

// Predefined spacing options for the dropdown
const SPACING_OPTIONS = [
  { value: 3, label: '3" - 16 plants per sq ft' },
  { value: 4, label: '4" - 9 plants per sq ft' },
  { value: 6, label: '6" - 4 plants per sq ft' },
  { value: 8, label: '8" - 2 plants per sq ft' },
  { value: 12, label: '12" - 1 plant per sq ft' },
  { value: 18, label: '18" - 1 plant per 2 sq ft' },
  { value: 24, label: '24" - 1 plant per 3 sq ft' },
  { value: 36, label: '36" - 1 plant per 4 sq ft' },
];

const PLANT_TYPE_OPTIONS = [
  { value: 'Vegetable', label: 'Vegetable' },
  { value: 'Root Vegetable', label: 'Root Vegetable' },
  { value: 'Herb', label: 'Herb' },
  { value: 'Fruit', label: 'Fruit' },
  { value: 'Flower', label: 'Flower' }
];

// Growth type options for the dropdown
const GROWTH_TYPE_OPTIONS = [
  { value: PlantGrowthType.NORMAL, label: 'Standard Growth' },
  { value: PlantGrowthType.VERTICAL, label: 'Vertical Growth (1 per sq ft)' },
  { value: PlantGrowthType.VERTICAL_BEAN_PEA, label: 'Vertical Bean/Pea (9 per sq ft)' },
];

const AddPlantForm: React.FC<AddPlantFormProps> = ({ onClose, onPlantAdded }) => {
  // Form state
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [plantVariety, setPlantVariety] = useState('');
  const [spacing, setSpacing] = useState<number>(12);
  const [sunlight, setSunlight] = useState('Full Sun');
  const [water, setWater] = useState('');
  const [growthType, setGrowthType] = useState<PlantGrowthType>(PlantGrowthType.NORMAL);
  const [calculatedDensity, setCalculatedDensity] = useState<number>(1);
  const [suggestedGrowthType, setSuggestedGrowthType] = useState<PlantGrowthType | null>(null);
  const [error, setError] = useState('');
  
  // Add plant mutation
  const [addPlant, { loading }] = useMutation(ADD_PLANT_MUTATION, {
    onCompleted: (data) => {
      onPlantAdded(data.addPlant);
      onClose();
    },
    onError: (error) => {
      setError(`Error adding plant: ${error.message}`);
    }
  });
  
  // Suggest growth type when plant name or type changes
  useEffect(() => {
    if (plantName && plantName.length > 2) {
      const suggestion = suggestGrowthType(plantName, plantType);
      setSuggestedGrowthType(suggestion);
    } else {
      setSuggestedGrowthType(null);
    }
  }, [plantName, plantType]);
  
  // Calculate plants per square foot whenever spacing or growth type changes
  useEffect(() => {
    const density = calculatePlantsPerSquareFoot(spacing, growthType);
    setCalculatedDensity(density);
  }, [spacing, growthType]);
  
  // Apply suggested growth type
  const handleApplySuggestion = () => {
    if (suggestedGrowthType) {
      setGrowthType(suggestedGrowthType);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plantName.trim()) {
      setError('Plant name is required');
      return;
    }
    
    if (!plantType.trim()) {
      setError('Plant type is required');
      return;
    }
    
    addPlant({
      variables: {
        plantName,
        plantType,
        plantVariety: plantVariety || undefined,
        spacing,
        plantLight: sunlight,
        plantWatering: water,
        growthType,
        isVerticalGrower: growthType !== PlantGrowthType.NORMAL,
        // plantsPerSquareFoot is calculated on the server in the pre-save hook
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="add-plant-form" style={{
        maxWidth: '600px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <div className="form-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0 }}>Add New Plant</h2>
          <button 
            onClick={onClose} 
            className="close-button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        {error && <div className="error-message" style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-layout" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div className="form-left">
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="plantName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Plant Name *
                </label>
                <input
                  id="plantName"
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="plantType" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Plant Type *
                </label>
                <select
                  id="plantType"
                  value={plantType}
                  onChange={(e) => setPlantType(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                   }}
                >
                  <option value="" disabled>Select a plant type</option>
                      {PLANT_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                      {option.label}
                  </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="plantVariety" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Variety (Optional)
                </label>
                <input
                  id="plantVariety"
                  type="text"
                  value={plantVariety}
                  onChange={(e) => setPlantVariety(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Growth Type Suggestion */}
              {suggestedGrowthType && suggestedGrowthType !== growthType && (
                <div className="suggestion-box" style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    <strong>Suggestion:</strong> This plant might be a 
                    {suggestedGrowthType === PlantGrowthType.VERTICAL_BEAN_PEA 
                      ? ' vertical bean/pea (9 per sq ft)' 
                      : suggestedGrowthType === PlantGrowthType.VERTICAL 
                        ? ' vertical grower (1 per sq ft)' 
                        : ' standard plant'}
                  </span>
                  <button 
                    type="button" 
                    className="btn-apply-suggestion"
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                    onClick={handleApplySuggestion}
                  >
                    Apply
                  </button>
                </div>
              )}
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="growthType" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Growth Type
                </label>
                <select
                  id="growthType"
                  value={growthType}
                  onChange={(e) => setGrowthType(e.target.value as PlantGrowthType)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  {GROWTH_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <small className="form-text" style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  This determines how the plant grows and affects planting density
                </small>
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="spacing" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Spacing (from seed packet)
                </label>
                <select
                  id="spacing"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  {SPACING_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <small className="form-text" style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Standard spacing between plants in inches (from seed packet)
                </small>
              </div>
            </div>
            
            <div className="form-right">
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="sunlight" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Sunlight Requirements
                </label>
                <select
                  id="sunlight"
                  value={sunlight}
                  onChange={(e) => setSunlight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="Full Sun">Full Sun</option>
                  <option value="Partial Sun">Partial Sun</option>
                  <option value="Partial Shade">Partial Shade</option>
                  <option value="Full Shade">Full Shade</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label htmlFor="water" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Watering Requirements
                </label>
                <input
                  id="water"
                  type="text"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  placeholder="e.g., 1-2 inches per week"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Plants Per Square Foot Preview */}
              <div className="density-preview" style={{
                marginTop: '20px',
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
                  Planting Density Preview
                </h3>
                <div style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {formatPlantDensity(calculatedDensity)}
                </div>
                <div style={{ maxWidth: '200px', margin: '0 auto' }}>
                  <PlantingDensityGrid
                    plantsPerSquareFoot={calculatedDensity}
                    growthType={growthType}
                    spacing={spacing}
                    plantName={plantName || "Plant"}
                  />
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                  Based on {spacing}" spacing and {growthType === PlantGrowthType.NORMAL ? 'standard' : 'vertical'} growth
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions" style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            borderTop: '1px solid #eee',
            paddingTop: '15px'
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-cancel"
              disabled={loading}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Adding...' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantForm;