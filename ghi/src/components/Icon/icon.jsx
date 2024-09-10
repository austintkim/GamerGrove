import { useState, useEffect } from 'react';

const Icon = ({ homeUserData, dashboardUserData, allGamesUserData, gamesDetailsUserData, boardDetailsUserData }) => {
  const [iconUrl, setIconUrl] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserIcon = async (iconID) => {
    try {
      const iconResponse = await fetch(`${import.meta.env.VITE_API_HOST}/api/icons/${iconID}`);
      const iconData = await iconResponse.json();
      setIconUrl(iconData.icon_url);
    } catch (error) {
      console.error('Error fetching icon:', error);
    }
  };

  useEffect(() => {
      setUserData(homeUserData || dashboardUserData || allGamesUserData || gamesDetailsUserData || boardDetailsUserData);
    }, [homeUserData, dashboardUserData, allGamesUserData, gamesDetailsUserData, boardDetailsUserData]);

  useEffect(() => {
    if (userData && userData.icon_id) {
      fetchUserIcon(userData.icon_id);
    } else {
      setIconUrl(null);
    }
  }, [userData]);

  return (
    <div>
      {iconUrl ? (
        <img src={iconUrl} alt="User Icon" style={{ width: '60px', height: '60px' }} />
      ) : (
        <img src="https://i.postimg.cc/SQCfRFsN/image-9.png" alt="Hardcoded Icon" style={{ width: '50px', height: '50px' }} />
      )}
    </div>
  );
};

export default Icon;
