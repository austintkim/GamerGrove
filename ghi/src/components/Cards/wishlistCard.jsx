import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './wishlistCard.css';
async function fetchUserName() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
  const fetchConfig = {
    credentials: 'include',
  };
  const response = await fetch(tokenUrl, fetchConfig);
  if (response.ok) {
    const data = await response.json();
    return data.account.id;
  }
}
  const handleClick = async (platform, rawg_pk) => {
    const storeUrl = await fetchStoreUrl(platform, rawg_pk);
    if (storeUrl) {
      window.location.href = storeUrl;
    }
  };
  const fetchStoreUrl = async (platform, rawg_pk) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/stores/${rawg_pk}`);
      const data = await response.json();
      for (const link of data) {
        if (link.platform === platform) {
          return link.url
        }
      }
    } catch (error) {
      console.error('Cant find the store you are looking for', error);
      return null;
    }
  };
function WishlistCard() {
  const [wishlistGames, setWishlistGames] = useState([]);
  const [lastGameRemoved, setLastGameRemoved] = useState(false);
  const [userLibrary, setUserLibrary] = useState([]);
  const [userWishlistGames, setUserWishlistGames] = useState([]);
  const fetchData = async (userId) => {
    try {
      const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${userId}`;
      const libraryConfig = {
        credentials: 'include',
      };
      const response = await fetch(libraryUrl, libraryConfig);
      if (response.ok) {
      const libraryData = await response.json();
      setUserLibrary(libraryData);
      const wishlistGameIds = libraryData
        .filter((item) => item.wishlist === true)
        .map((item) => item.game_id);
      const uniqueGameIds = Array.from(new Set(wishlistGameIds));
      const gameDetailsPromises = uniqueGameIds.map((gameId) =>
        fetch(`${import.meta.env.VITE_API_HOST}/api/games/${gameId}`).then((response) =>
          response.json()
        )
      );
      const wishlistGames = await Promise.all(gameDetailsPromises);
      setWishlistGames(wishlistGames);
      setUserWishlistGames(libraryData.map((entry) => entry.id));
      } else {
          setLastGameRemoved(true);
    }
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await fetchUserName();
      await fetchData(userId);
    };
    fetchUserData();
  }, []);
  if(lastGameRemoved === true){
    return (
      <p style={{color:'white'}}> No games saved to your wishlist yet. </p>
    )
  }
  const filteredUserLibrary = userLibrary.filter((libraryData) =>
    userWishlistGames.includes(libraryData.id) && libraryData.wishlist === true
  );
  if (filteredUserLibrary.length === 0) {
    return (
      <p style={{color:'white'}}> No games saved to your wishlist yet. </p>
    )
  }
  const handleRemove = async (gameId) => {
     try {
    const userId = await fetchUserName();
    const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${userId}`;
    const libraryConfig = {
      credentials: 'include',
    };
    const libraryResponse = await fetch(libraryUrl, libraryConfig);
    const libraryData = await libraryResponse.json();
    const filteredLibraryData = libraryData.filter((libraryEntry) =>
      libraryEntry.game_id === gameId && libraryEntry.wishlist === true
    );
    const url = `${import.meta.env.VITE_API_HOST}/api/libraries/${filteredLibraryData[0].id}/${userId}`;
    const fetchConfig = {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {

      fetchData(userId);
    } else {
      throw new Error('Failed to remove game from wishlist');
    }
  } catch (error) {
    console.error('Error removing game from wishlist:', error);
  }
};

return (
    <div>
      {wishlistGames.map((game, index) => (
        <div key={`${game.id}-${index}`} className="wishlistcard">
          <div  className="wcard-content">
            <div className="wcard-details">

                <div className='wcontent-capsules'>
                  <img
                      className='icon2'
                      src="https://i.postimg.cc/nrDT7szB/image-5.png"
                      width="5px"
                      height="5px"
                      alt="Icon 1"
                      style={{ opacity: '0'}}
                    />
                  {game.xbox && (
                    <img
                      className='GDIcon'
                      src="https://i.postimg.cc/nrDT7szB/image-5.png"
                      width="25px"
                      height="25px"
                      alt="Icon 1"
                      type="button"
                      onClick={() => handleClick('Xbox', game.rawg_pk)}
                    />
                    )}
                  {game.playstation && (
                    <img
                      className='GDIcon'
                      src="https://cdn.icon-icons.com/icons2/2429/PNG/512/playstation_logo_icon_147249.png"
                      width="25px"
                      height="25px"
                      alt="Icon 2"
                      type="button"
                      onClick={() => handleClick('PlayStation', game.rawg_pk)}
                    />
                    )}
                  {game.nintendo && (
                    <img
                      className='GDIcon'
                      src="https://i.postimg.cc/R0qXLppc/image-3.png"
                      width="25px"
                      height="25px"
                      alt="Icon 3"
                      type="button"
                      onClick={() => handleClick('Nintendo', game.rawg_pk)}
                    />
                    )}
                  {game.pc && (
                    <img
                      className='GDIcon'
                      src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
                      width="25px"
                      height="25px"
                      alt="Icon 4"
                      type="button"
                      onClick={() => handleClick('PC', game.rawg_pk)}
                    />
                    )}
                </div>
                  <p style={{color:'white'}} className='gamename'>{game.name}</p>
                <Link to={`/games/${game.id}`}>
                  <div className="wcard-photo" style={{ position: 'relative' }}>
                    <img src={game.background_img} alt={game.name} />
                  </div>
                </Link>
                  <div
                    className="remove-button-wrapper"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      margin: '10px',
                    }}
                  >
                      <button onClick={() => handleRemove(game.id, fetchUserName())}>
                        Remove
                      </button>
                  </div>
                </div>
              </div>
            </div>

      ))}
    </div>
  );
}
export default WishlistCard;
