import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import './boardPage.css';
import '../Cards/boardGameCard.css'
import SideMenu from '../Home/Menu';
import Nav from '../Home/Nav';
import BoardGameCard from '../Cards/boardGameCard';

async function fetchBoardDetails(boardId) {
  const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/${boardId}`;
  const boardConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(boardUrl, boardConfig);
    const boardData = await response.json();
    return boardData;
  } catch (error) {
    console.error(`Error fetching board details for board ID ${boardId}:`, error);
    return null;
  }
}

async function fetchGamesForBoard(accountId) {
  const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${accountId}`;
  const libraryConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(libraryUrl, libraryConfig);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const libraryData = await response.json();
    // Accounting for when the last game is removed from the board
    // If a 404 status is returned from libraryData fetch (because there are no longer any games
    // added to the board), return an empty array which allows the page to be re-rendered and
    // show an empty board with no game cards
    return Array.isArray(libraryData) ? libraryData : [];
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
    const gameData = await response.json();
    return gameData;
  } catch (error) {
    console.error(`Error fetching game details for game ID ${gameId}:`, error);
    return null;
  }
}

async function fetchUserName() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
  const fetchConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(tokenUrl, fetchConfig);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.account.id;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

function BoardPage() {
  const navigate = useNavigate();
  const[loading, setLoading] = useState(true);
  const [userToken3, setUserToken3] = useState(null);
  const [userDataDetails3, setUserDataDetails3] = useState('');
  const { id: boardId } = useParams();
  const [boardData, setBoardData] = useState(null);
  const [gamesData, setGamesData] = useState([]);

  const fetchUserData = async () => {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

  const fetchConfig = {
    credentials: 'include',
  };

  const response = await fetch(tokenUrl, fetchConfig);
  const data = await response.json();
  if (data) {
      setUserToken3(data.access_token);
      setUserDataDetails3(data.account);
      return data.account;
  } else {
      throw new Error ('No active token')
  }
};

  useEffect(() => {
      fetchUserData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardDetails = await fetchBoardDetails(boardId);
        setBoardData(boardDetails);

        const accountId = await fetchUserName();

        const libraryData = await fetchGamesForBoard(accountId, boardId);

      // Accounting for when the last game is removed from the board
      // If a 404 status is returned from libraryData fetch (because there are no longer any games
      // added to the board), put an empty return which allows the page to be re-rendered and
      // show an empty board with no game cards
        if (!Array.isArray(libraryData)) {
          console.error('Invalid library data received:', libraryData);
          return;
        }
        const gamesForBoard = libraryData
          .filter((item) => item.board_id === parseInt(boardId, 10))
          .map((item) => item.game_id);
          const gameDetailsPromises = gamesForBoard.map((gameId) => fetchGameDetails(gameId));
        const gamesForBoardDetails = await Promise.all(gameDetailsPromises);
        for (const game of gamesForBoardDetails){
          for (const entry of libraryData){
            if (entry.game_id == game.id){
              game.library_id = entry.id
              game.account_id = entry.account_id
          }
        }
      }
        setGamesData(gamesForBoardDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

  }, []);

  const handleGameRemoval = async (id, account_id,) => {
    // sending DELETE request to libraries endpoint to remove the instance of game being
    // added to board in database
    try {
      const libUrl = `http://localhost:8000/api/libraries/${id}`
      const libResponse = await fetch(libUrl);
      const libData = await libResponse.json();
      const url = `http://localhost:8000/api/libraries/${id}/${account_id}`
      const fetchConfig = {

        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',

        }
        };
      const response = await fetch (url, fetchConfig)


      if (response.ok) {
        // Invoking fetchData so that once a game is successfully removed from the board
        //the page re-renders to only populate the screen with games still added to the board
        fetchData();
        }

    } catch (error) {
      console.error("Error deleting game:", error);
    }

  };

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (!boardData || !gamesData) {
    return null;
  }

  return (
    <div>
       <Nav
        userCookie3 = {userToken3}
        userData3 = {userDataDetails3}
       />
    <SideMenu />
  <div className="board-page-container">


    <div className="cover-photo-container">
      <img
        src={boardData.cover_photo}
        alt="Cover Photo"
        className="cover-photo"
      />
    </div>

    <div className="content-container">
      <br />
      <h1 className='BoardPageTitle'><span>{boardData.board_name}</span></h1>
      <hr className='boardpagehr' />
      <h1 className='BoardPageDescription'><span>{boardData.description}</span></h1>

      <div className='board-game-card-container'>
        {gamesData.map((gameData) => (
          // For each game saved to this particular board, all the details needed to created the game card showed on the board page
          // is passed into the child BoardGameCard component which does the actual card rendering
          <BoardGameCard
          key={gameData.id}
          gameData={gameData}
          // Here we instantiate and pass in the callback function onGameRemoval into the child component BoardGameCard
          // When triggered in BoardGameCard by a user clicking 'Remove Game', will call on handleGameRemoval
          // within this parent component BoardPage to actually remove the game from the board and re-render page
          onGameRemoval={(libraryId, accountId) =>
          handleGameRemoval(libraryId, accountId)
        }
          />
        ))}
      </div>
      <br />
      <Link to={`/boards/update/${boardId}`} className='updateboard'>
        <span>Update Board</span>
      </Link>
      <br />
      <br />
       <Link to={`/boards/delete/${boardId}`} className='deleteboard'>
          <span>Delete Board</span>
        </Link>
        <br />
      <br />
      <button className="mb-3" style={{ textAlign: 'left'}} onClick={() => navigate(-1)}>Back</button>
    </div>
  </div>
  </div>
);

}

export default BoardPage;
