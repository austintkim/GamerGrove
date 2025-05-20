import { useState, useEffect } from 'react';
import Nav from '../Home/Nav.jsx';
import AllGameCard from '../Cards/allGameCard.jsx';
import './Listgames.css';
import SideMenu from '../Home/sideMenu.jsx';
import { useLocation } from 'react-router-dom';


const Listgames = () => {
  const [userToken1, setUserToken1] = useState(null);
  const [userDataDetails1, setUserDataDetails1] = useState('');
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState('');

  const fetchUserData = async () => {
    const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

    const fetchConfig = {
      credentials: 'include',
    };

    const response = await fetch(tokenUrl, fetchConfig);
    const data = await response.json();
    if (data) {
        setUserToken1(data.access_token);
        setUserDataDetails1(data.account);
        return data.account;
    } else {
        throw new Error ('No active token')
    }
  };

    useEffect(() => {
        fetchUserData();
    }, []);

  const location = useLocation();
  const data = location.state;

  const platforms = ['xbox', 'playstation', 'pc', 'nintendo'];

  if (platforms.includes(data.state) === false && data.state) {
    const genre = data.state;
    const formattedGenre = genre.charAt(0).toUpperCase() + genre.slice(1);

    const fetchGames = async () => {
      try {
        const url = `${import.meta.env.VITE_API_HOST}/api/games`;
        const response = await fetch(url);

        if (response.ok) {
          const fetchedGames = await response.json();
          const filteredGames = fetchedGames.games.filter((game) => game.genre === genre);
          setTitle(formattedGenre);
          setGames(filteredGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };


    useEffect(() => {
      fetchGames();
    }, [genre]);
  } else if (platforms.includes(data.state)) {
    const platform = data.state;
    let formattedPlatform = '';

    if (platform === 'playstation') {
      formattedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1, 4) + platform.charAt(4).toUpperCase() + platform.slice(5);
    } else if (platform === 'pc') {
      formattedPlatform = platform.toUpperCase();
    } else {
      formattedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
    }
    const fetchGames = async () => {
      try {
        const url = `${import.meta.env.VITE_API_HOST}/api/games`;
        const response = await fetch(url);

        if (response.ok) {
          const fetchedGames = await response.json();
          const filteredGames = fetchedGames.games.filter((game) => game[`${platform}`] === true)
          setTitle(formattedPlatform);
          setGames(filteredGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };


    useEffect(() => {
      fetchGames();
    }, [platform]);
  } else {
    const fetchGames = async () => {
      try {
        const url = `${import.meta.env.VITE_API_HOST}/api/games`;
        const response = await fetch(url);
        if (response.ok) {
          const fetchedGames = await response.json();
          setGames(fetchedGames.games);
          setTitle('All Games')
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    useEffect(() => {
      fetchGames();
    },[data]);

  }

  const listGamesLogOut = () => {
    setUserToken1(null);
    setUserDataDetails1('');
  }

  return (
    <div>
      <Nav
        userCookie1={userToken1}
        userData1={userDataDetails1}
        userLogOut1={listGamesLogOut}
      />
      <h1 className="titlegames" style={{ textDecoration: 'underline', textDecorationThickness: '1px' }}>{title}</h1>

      <div className='allgamesbody'>

        <SideMenu />

        {games.length > 0 &&
        <AllGameCard
          userCookie1={userToken1}
          userData1={userDataDetails1}
          games={games}
        />}

      </div>
      <br />
      <h5 style={{textAlign: 'center', fontFamily: 'K2D', marginLeft: '100px'}}>End of Results</h5>
      <br />
    </div>
  );
};

export default Listgames;
