
import { useMutation } from '@apollo/client';
import { DELETE_GARDEN_MUTATION } from '../graphQL/mutations';
import { Link } from 'react-router-dom';
import { GardenType } from '../types/garden';
import GardenPreview from './GardenPreview';


// Updated Garden card component with delete functionality
interface GardenCardProps {
    garden: GardenType;
    deleteInProgress: string | null;
    setDeleteInProgress: (id: string | null) => void;
    refetchGardens: () => void;
  }
  
  const GardenCard = ({ garden, deleteInProgress, setDeleteInProgress, refetchGardens}:GardenCardProps) => {
    const plantCount = garden.plants ? garden.plants.length : 0;
    const isDeleting = deleteInProgress === garden.id;

    //delete garden
    const [deleteGarden] = useMutation(DELETE_GARDEN_MUTATION, {
        onCompleted: () => {
          setDeleteInProgress(null);
          refetchGardens(); // Refresh the garden list after deletion
        },
        onError: (error) => {
          console.error("Error deleting garden:", error);
          setDeleteInProgress(null);
        }
      });

      // Handle garden deletion
    const handleDeleteGarden = (gardenId: string) => {
      // Show confirmation before deleting
      if (window.confirm("Are you sure you want to delete this garden plan? This action cannot be undone.")) {
        setDeleteInProgress(gardenId);
        deleteGarden({ 
          variables: { id: gardenId }
        });
      }
    };
    
    return (
      <div className="garden-card">
        <div className="garden-preview">
          <GardenPreview garden={garden} />
        </div>
        <div className="garden-info">
          <h3>{garden.name}</h3>
          <div className="garden-details">
            <span>{garden.rows} × {garden.cols} ft</span>
            <span>{plantCount} plants</span>
          </div>
          <div className="garden-actions">
            <Link to={`/garden-planner?gardenId=${garden.id}`} className="edit-garden-btn">
              Edit Garden
            </Link>
            <button 
              className="delete-garden-btn"
              onClick={() => handleDeleteGarden(garden.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Garden'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
 
export default GardenCard;