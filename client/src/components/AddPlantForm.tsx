// components/AddPlantForm.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PLANT_MUTATION } from '../graphQL/mutations';
import { GET_ALL_PLANTS } from '../graphQL/queries';

interface AddPlantFormProps {
  onClose: () => void;
  onPlantAdded: () => void;
}

const AddPlantForm: React.FC<AddPlantFormProps> = ({ onClose, onPlantAdded }) => {
  const [formData, setFormData] = useState({
    plantName: '',
    plantType: '',
    plantVariety: '',
    plantWatering: '',
    plantLight: '',
    plantSoil: '',
    plantFertilizer: '',
    plantHumidity: '',
    plantTemperature: '',
    plantToxicity: '',
    plantPests: '',
    plantDiseases: '',
    spacing: 12,
    plantsPerSquareFoot: 1,
    color: '#4CAF50'
  });
  
  const [error, setError] = useState('');
  
  const [addPlant, { loading }] = useMutation(ADD_PLANT_MUTATION, {
    refetchQueries: [{ query: GET_ALL_PLANTS }],
    onCompleted: () => {
      onPlantAdded();
      onClose();
    },
    onError: (err) => {
      setError(`Error adding plant: ${err.message}`);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric values
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.plantName.trim()) {
      setError('Plant name is required');
      return;
    }
    
    if (!formData.plantType.trim()) {
      setError('Plant type is required');
      return;
    }
    
    // Submit to server
    addPlant({ variables: formData });
  };
  
  return (
    <div className="add-plant-dialog-overlay">
      <div className="add-plant-dialog">
        <h2>Add New Plant</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="plantName">Plant Name*</label>
                <input
                  type="text"
                  id="plantName"
                  name="plantName"
                  value={formData.plantName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plantType">Plant Type*</label>
                <select
                  id="plantType"
                  name="plantType"
                  value={formData.plantType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Herb">Herb</option>
                  <option value="Flower">Flower</option>
                  <option value="Root vegetable">Root vegetable</option>
                  <option value="Leafy green">Leafy green</option>
                  <option value="Grain">Grain</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="plantVariety">Variety (optional)</label>
                <input
                  type="text"
                  id="plantVariety"
                  name="plantVariety"
                  value={formData.plantVariety}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plantWatering">Watering Needs*</label>
                <select
                  id="plantWatering"
                  name="plantWatering"
                  value={formData.plantWatering}
                  onChange={handleChange}
                >
                  <option value="">Select watering needs</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Regular">Regular</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="plantLight">Light Requirements*</label>
                <select
                  id="plantLight"
                  name="plantLight"
                  value={formData.plantLight}
                  onChange={handleChange}
                >
                  <option value="">Select light requirements</option>
                  <option value="Full sun">Full sun</option>
                  <option value="Partial sun">Partial sun</option>
                  <option value="Partial shade">Partial shade</option>
                  <option value="Full shade">Full shade</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="spacing">Spacing (inches)*</label>
                <input
                  type="number"
                  id="spacing"
                  name="spacing"
                  min="1"
                  max="36"
                  value={formData.spacing}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="plantSoil">Soil Requirements*</label>
                <input
                  type="text"
                  id="plantSoil"
                  name="plantSoil"
                  value={formData.plantSoil}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plantFertilizer">Fertilizer Needs*</label>
                <input
                  type="text"
                  id="plantFertilizer"
                  name="plantFertilizer"
                  value={formData.plantFertilizer}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plantHumidity">Humidity Preference*</label>
                <select
                  id="plantHumidity"
                  name="plantHumidity"
                  value={formData.plantHumidity}
                  onChange={handleChange}
                >
                  <option value="">Select humidity</option>
                  <option value="Low">Low</option>
                  <option value="Low to moderate">Low to moderate</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Moderate to high">Moderate to high</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="plantTemperature">Temperature Range*</label>
                <input
                  type="text"
                  id="plantTemperature"
                  name="plantTemperature"
                  placeholder="e.g. 65-85°F (18-29°C)"
                  value={formData.plantTemperature}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="plantToxicity">Toxicity*</label>
                <input
                  type="text"
                  id="plantToxicity"
                  name="plantToxicity"
                  placeholder="e.g. Non-toxic or Toxic to pets"
                  value={formData.plantToxicity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="full-width-inputs">
            <div className="form-group">
              <label htmlFor="plantPests">Common Pests*</label>
              <input
                type="text"
                id="plantPests"
                name="plantPests"
                placeholder="e.g. Aphids, spider mites"
                value={formData.plantPests}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="plantDiseases">Common Diseases*</label>
              <input
                type="text"
                id="plantDiseases"
                name="plantDiseases"
                placeholder="e.g. Powdery mildew, root rot"
                value={formData.plantDiseases}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="dialog-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Adding..." : "Add Plant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantForm;