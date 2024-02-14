import { useState, useEffect } from 'react';

const Icon = () => {
  const [iconUrl, setIconUrl] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
      const fetchConfig = {
        credentials: 'include',
      };

      try {
        const response = await fetch(tokenUrl, fetchConfig);

        const userData = await response.json();
        if (userData !== null) {
          const { account } = userData;
          const { icon_id } = account;

          const iconResponse = await fetch(`${import.meta.env.VITE_API_HOST}/api/icons/${icon_id}`);

          const iconData = await iconResponse.json();

          setIconUrl(iconData.icon_url);
      }
     } catch (error) {
        //empty
      }

    }
        fetchUserData();
      }, []);

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
