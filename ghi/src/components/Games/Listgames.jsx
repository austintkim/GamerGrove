import React, { useState, useEffect } from 'react';
import Nav from '../../Nav.jsx';
import AllGameCard from '../Cards/allGameCard.jsx';
import './Listgames.css';
import SideMenu from '../Home/Menu.jsx';
import { useLocation } from 'react-router-dom';


const Listgames = () => {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState('');

  const location = useLocation();
  const data = location.state;

  const platforms = ['xbox', 'playstation', 'pc', 'nintendo'];

  if(platforms.includes(data.state) === false ) {
    const genre = data?.state || '';

    const fetchGames = async () => {
      try {
        const url = 'http://localhost:8000/api/games';
        const response = await fetch(url);

        if (response.ok) {
          const fetchedGames = await response.json();
          const filteredGames = genre.length > 2
          ? fetchedGames.filter((game) => game.genre === genre)
          : fetchedGames;
          setTitle(genre);
          setGames(filteredGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };


    useEffect(() => {
      fetchGames();
    }, [genre]);
  } else if (platforms.includes(data.state)){
    const platform = data.state
    const fetchGames = async () => {
      try {
        const url = 'http://localhost:8000/api/games';
        const response = await fetch(url);

        if (response.ok) {
          const fetchedGames = await response.json();
          const filteredGames = platform.length > 2
            ? fetchedGames.filter((game) => game[`${platform}`] === true)
            : fetchedGames;
          setTitle(platform);
          setGames(filteredGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };


    useEffect(() => {
      fetchGames();
    }, [platform]);
  }

  return (
    <div>
      <Nav />
     <h1 className='titlegames'>Games/{title ? title : 'All Games'}</h1>

      <body className='allgamesbody'>

        <SideMenu />

        {games.length > 0 && <AllGameCard games={games} />}

        {/* <h1>{genre}</h1>
        {games.map((g) => (
          <h3 key={g.id}>{g.name}</h3>
        ))} */}
      </body>
    </div>
  );
};

export default Listgames;
