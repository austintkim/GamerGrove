import { useState, useEffect, useCallback } from 'react';
import './boardCard.css';
import { Link, useNavigate} from 'react-router-dom';

async function fetchUserName() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
  const fetchConfig = {
    credentials: 'include',
    redirect: 'follow',
  };

  const response = await fetch(tokenUrl, fetchConfig);

  if (response.ok) {
    const data = await response.json();
    return data.account.id;
  }
}

async function fetchGamesForBoard(boardId) {
  const gamesUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${boardId}`;
  const gamesConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(gamesUrl, gamesConfig);
    const gamesData = await response.json();

    if (gamesData.detail) {
      return [];
    }
    const filteredGames = gamesData.filter(game => game.board_id === boardId);
    return filteredGames;
  } catch (error) {
    console.error('Error fetching games data:', error);
    return [];
  }
}

async function fetchGameDetails(gameId) {
  const gameUrl = `${import.meta.env.VITE_API_HOST}/api/games/${gameId}`;
  const gameConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(gameUrl, gameConfig);

    if (response.ok) {
      const gameData = await response.json();
      return gameData;
    } else {
      console.error(`Error fetching game details for game ID ${gameId}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching game details for game ID ${gameId}:`, error);
    return null;
  }
}

function BoardCard() {
  const navigate = useNavigate();
  const [boardDataList, setBoardDataList] = useState([]);
  const [userSavedBoards, setUserSavedBoards] = useState([]);

  const fetchData = async (userId) => {
    const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/users/${userId}`;
    const boardConfig = {
      credentials: 'include',
    };

    try {
      const response = await fetch(boardUrl, boardConfig);
      const boardData = await response.json();

      if (boardData.detail) {
        return [];
      }

      setUserSavedBoards(boardData.map((item) => item.id));
      setBoardDataList(boardData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAndSetGamesData = async (boardId) => {
    const gamesData = await fetchGamesForBoard(boardId);

    const updatedBoardDataList = await Promise.all(
      gamesData.map(async (game) => {
        const gameDetails = await fetchGameDetails(game.game_id);
        return gameDetails
          ? {
              ...game,
              background_img: gameDetails.background_img,
            }
          : game;
      })
    );

    setBoardDataList((prevBoardDataList) =>
      prevBoardDataList.map((boardData) =>
        boardData.id === boardId
          ? { ...boardData, games: updatedBoardDataList }
          : boardData
      )
    );
  };


  const fetchBoardData = useCallback(async () => {
    for (const boardId of userSavedBoards) {
      await fetchAndSetGamesData(boardId);
    }
  }, [userSavedBoards]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await fetchUserName();
      fetchData(userId);
    };

    fetchUserData();
  }, []);


  useEffect(() => {

    fetchBoardData();
  }, [fetchBoardData]);

  const filteredBoardDataList = boardDataList.filter((boardData) =>
    userSavedBoards.includes(boardData.id)
  );

  if (filteredBoardDataList.length === 0) {
    return (
      <>
    <p style={{color:'white'}}>No boards created.</p>
    <div>
    <button onClick={()=>{
      navigate('/boards/create')
    }}> Create a board </button>
    </div>
      </>
    )
  }

  return (
  <>
  <div>
    <br />
    <button onClick={()=>{
      navigate('/boards/create')
    }} style={{ marginLeft: '840px'}}> Create a board </button>
  </div>
  <div className='bcard-container'>
    {filteredBoardDataList.map((boardData) => (
      <div key={boardData.id} className='card' style={{ width: '20rem' }}>
        <img src={boardData.cover_photo} className='card-img-top' alt={`Board Cover for ${boardData.board_name}`} style={{ borderRadius: '20px 20px 0 0 ' }} />
        <div className='card-body'>
          <Link to={`/boards/${boardData.id}`} className='board-link'>
            <h5 className='card-title1'>{boardData.board_name}</h5>
          </Link>
          <hr className='bsolid' />
          <p className='card-text1'>{`${boardData.game_count} Games`}</p>
          <div className={`flex-container ${boardData.alignment}`}>
            {[...Array(3)].map((_, index) => {
              const game = boardData.games && boardData.games[index];
              const key = `${game ? game.game_id : 'empty'}-${boardData.id}-${index}`;
              const backgroundImage = game ? game.background_img : 'https://i.postimg.cc/mkwt0Hbr/black-370118-1280.png';

              return (
                <div key={key} className={`flex-container ${index === 0 ? 'left' : index === 1 ? 'right' : 'center'}`}>
                  <div style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0px 10px 10px black', backgroundColor: game ? 'transparent' : 'black' }}>
                    <img src={backgroundImage} className='small-card-img-top' alt={`Game ${index + 2}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ))}
  </div>
</>
);

}

export default BoardCard;
