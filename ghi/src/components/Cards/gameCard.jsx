import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import './gameCard.css';

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

function GameCard() {
  const [gameDataList, setGameDataList] = useState([]);
  const [userSavedGames, setUserSavedGames] = useState([]);

  const fetchData = async (userId) => {
    const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${userId}`;
    const libraryConfig = {
      credentials: 'include',
    };

    try {
      const response = await fetch(libraryUrl, libraryConfig);
      const libraryData = await response.json();

      if (libraryData.detail) {
        return [];
      }
      setUserSavedGames(libraryData.map((item) => item.game_id));

      const gameDetailsPromises = libraryData.map((item) =>
        fetch(`${import.meta.env.VITE_API_HOST}/api/games/${item.game_id}`).then((response) =>
          response.json()
        )
      );

      const gameDetails = await Promise.all(gameDetailsPromises);
      setGameDataList(gameDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await fetchUserName();
      fetchData(userId);
    };

    fetchUserData();
  }, []);

  const filteredGameDataList = gameDataList.filter((gameData) =>
    userSavedGames.includes(gameData.id)
  );


  const gamesList = []
  const gameIDList = []
  for (const game of filteredGameDataList) {
    if (gameIDList.includes(game.id)) {
      continue
    } else {
      gameIDList.push(game.id)
      gamesList.push(game)
    }
  }


  if (filteredGameDataList.length === 0) {
    return (
      <>
      <p style={{color:'white'}}>No games added to a board or your wishlist.</p>
      </>
    )
  }

  return (
    <div className='gcard-container'>
      {gamesList.map((gameData) => (
        <div key={gameData.id} className='gcard'>
          <Link to={`/games/${gameData.id}`}>
          <img
            src={gameData.background_img}
            className='gcard-img'
            alt={`Card for ${gameData.name}`}
          />
          <div className='gcontent-head'>
            <h2>
                {gameData.name.length > 17
                  ? `${gameData.name.slice(0, 17)}..`
                  : gameData.name
                }
              </h2>
          </div>
          </Link>
          <br/>
          <div className='gcontent-body'>
            {gameData.description.length > 200 && (
            <div>{parse(`${gameData.description.slice(0, 200)}..`)}</div>
          )}
          </div>
          <div className='gbutton'>

          </div>
        </div>
      ))}
    </div>
  );
}

export default GameCard;
