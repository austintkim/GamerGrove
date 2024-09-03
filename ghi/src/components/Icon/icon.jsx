import { useState, useEffect } from 'react';

const Icon = ({ userData }) => {
  const [iconUrl, setIconUrl] = useState(null);

  useEffect(() => {
    if (userData) {
      const fetchUserIcon = async (iconID) => {
        const iconResponse = await fetch(`${import.meta.env.VITE_API_HOST}/api/icons/${iconID}`);
        const iconData = await iconResponse.json();
        setIconUrl(iconData.icon_url);
      };
      fetchUserIcon(userData.icon_id);
    }
  }, [userData]);

  return (
  <div>
    {iconUrl ? (
      <img src={iconUrl} alt="User Icon" style={{ width: '60px', height: '60px' }} />
    ) : (
      <>

        <img src="https://i.postimg.cc/SQCfRFsN/image-9.png" alt="Hardcoded Icon" style={{ width: '50px', height: '50px' }} />
      </>
    )}
  </div>
);

};

export default Icon;
