import { useQuery } from '@apollo/client';
import { QUERY_ME, GET_USER_GARDENS } from '../graphQL/queries';
import '../styles/Profile.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import GardenCard from '../components/GardenCard';
import { GardenType } from '../types/garden';

const ProfilePage = () => {
  // provides access to the current URL location object
  const location = useLocation();
  
  
  const { loading: profileLoading, error: profileError, data: profileData } = useQuery(QUERY_ME);
  //this query will trigger useEffect for gardensData
  const { loading: gardensLoading, error: gardensError, data: gardensData, refetch: refetchGardens } = useQuery(GET_USER_GARDENS, {
    onError: (error) => {
      console.error("Error fetching gardens:", error);
    }
  });

  
  const [gardens, setGardens] = useState<GardenType[]>([]);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  //triggers when gardensData is updated
  useEffect(() => {
    if (gardensData && gardensData.userGardens) {
      setGardens(gardensData.userGardens);
    }
  }, [gardensData]);

  //
  useEffect(() => {
    // Refetch both queries when the url location changes
    refetchGardens();
  }, [location.key, refetchGardens]);


  if (profileLoading) return <p>Loading your profile...</p>;
  if (profileError) return <p>Error loading profile: {profileError.message}</p>;

  // Destructure profile data
  const { firstname } = profileData.me;
  const hasGardens = gardens.length > 0;

  return (
    <div className="profilePage-container">
      <div className="profile-container">
        <div className="profile-header">
          <h1>{firstname}'s Garden Plans</h1>
          <p>"The glory of gardening: hands in the dirt, head in the sun, heart with nature." - Alfred Austin </p>
        </div>
        <div className="savedPlot-container">
          {gardensLoading ? (
            <p>Loading your garden plans...</p>
          ) : gardensError ? (
            <div className="error-container">
              <p>Unable to load your garden plans.</p>
              <Link to="/planner" className="create-garden-btn">Create A New Garden</Link>
            </div>
          ) : hasGardens ? (
            <div className="garden-grid">
              {gardens.map(garden => (
                <GardenCard 
                  key={garden.id} 
                  garden={garden} 
                  deleteInProgress={deleteInProgress}
                  setDeleteInProgress={setDeleteInProgress}
                  refetchGardens={refetchGardens}
                />
              ))}
            </div>
          ) : (
            <div className="no-gardens">
              <p>You have no garden plots saved</p>
              <Link to="/garden-planner" className="create-garden-btn">Create Your First Garden</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default ProfilePage;