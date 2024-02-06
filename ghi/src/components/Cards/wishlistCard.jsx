import { React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './wishlistCard.css';

async function fetchUserName() {
  const tokenUrl = `http://localhost:8000/token`;

  const fetchConfig = {
    credentials: 'include',
  };

  const response = await fetch(tokenUrl, fetchConfig);

  if (response.ok) {
    const data = await response.json();
    return data.account.id;
  }
}


function WishlistCard() {
  const [wishlistGames, setWishlistGames] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]);
  const [userWishlistGames, setUserWishlistGames] = useState([]);

  const fetchData = async (userId) => {
    try {
      const libraryUrl = `http://localhost:8000/api/users/libraries/${userId}`;
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
        fetch(`http://localhost:8000/api/games/${gameId}`).then((response) =>
          response.json()
        )
      );


      const wishlistGames = await Promise.all(gameDetailsPromises);

      setWishlistGames(wishlistGames);

      setUserWishlistGames(libraryData.map((entry) => entry.id));

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

  const filteredUserLibrary = userLibrary.filter((libraryData) =>
    userWishlistGames.includes(libraryData.id) && libraryData.wishlist === true
  );

  if (filteredUserLibrary.length === 0) {
    return (
      <p style={{color:'white'}}> No games saved to your wishlist yet. </p>
    )
  }


  const handleRemove = async (libraryId, userId) => {

    const url = `http://localhost:8000/api/libraries/${libraryId}/${userId}`

    const fetchConfig = {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      console.log('Game removed from wishlist!');
      setUserLibrary(prevUserLibrary => prevUserLibrary.filter(item => item.id !== libraryId));

      setWishlistGames(prevWishlistGames => prevWishlistGames.filter(game => game.id !== libraryId));

      setUserWishlistGames(prevUserWishlistGames => prevUserWishlistGames.filter(entryId => entryId !== libraryId));
    } else {
      throw new Error('Failed to remove game from wishlist')
    }
}

console.log(filteredUserLibrary);

return (
    <div>
      {wishlistGames.map((game, index) => (
        <div key={`${game.id}-${index}`} className="wishlistcard">
          <div className="wcard-content">
            <div className="wcard-details">
              <div className="wcard-item">
                <Link to={`/games/${game.id}`} className="wcard-item">
                  <p className='gamename'>{game.name}</p>
                </Link>
                <div className="wcard-photo" style={{ position: 'relative' }}>
                  <img src={game.background_img} alt={game.name} />
                  <div
                    className="remove-button-wrapper"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      margin: '10px',
                    }}
                  >
                  {filteredUserLibrary.map(entry => (
                    <div key={`wishlist-entry-${entry.id}`}>
                      <button onClick={() => handleRemove(entry.id, entry.account_id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WishlistCard;
