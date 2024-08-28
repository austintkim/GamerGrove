import './dashboard.css';
import {useState, useEffect} from 'react';
import BoardCard from '../Cards/boardCard.jsx';
import GameCard from '../Cards/gameCard.jsx';
import WishlistCard from '../Cards/wishlistCard.jsx';
import SideMenu from '../Home/Menu';
import Nav from '../Home/Nav';
import CombinedCards from '../Cards/combinedCards';
import Settings from '../Accounts/Settings.jsx';

const fetchUserData = async () => {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

  const fetchConfig = {
    credentials: 'include',
  };

  const response = await fetch(tokenUrl, fetchConfig);

  if (response.ok) {
    const data = await response.json();
    if (data !== null) {
    return data.account;
    }
  }
};

function Dashboard() {
  const[savedUserData, setSavedUserData] = useState('');
  const[savedUserGameIDs, setSavedUserGameIDs] = useState([]);
  const[savedGameDetails, setSavedGameDetails] = useState([]);

  const fetchUserGames = async(userId) => {
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
      setSavedUserGameIDs(libraryData.map((item) => item.game_id));

      const gameDetailsPromises = libraryData.map((item) =>
        fetch(`${import.meta.env.VITE_API_HOST}/api/games/${item.game_id}`).then((response) =>
          response.json()
        )
      );
      const gameDetails = await Promise.all(gameDetailsPromises);
      setSavedGameDetails(gameDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      setSavedUserData(userData);
    };
  fetchData();
  fetchUserGames(savedUserData.id);
  }, []);

  return (
    <div>
      <SideMenu />
      <Nav />
      <main>
        <h1 style={{color:'white'}} >{savedUserData.username}&apos;s Dashboard 🎛️ 🖥️ 📟</h1>

        <input id="radio1" type="radio" name="css-tabs" defaultChecked />
        <input id="radio2" type="radio" name="css-tabs" />
        <input id="radio3" type="radio" name="css-tabs" />
        <input id="radio4" type="radio" name="css-tabs" />
        <input id="radio5" type="radio" name="css-tabs" />
        <div id="tabs">
          <label style={{color:'white'}} htmlFor="radio1" id="tab1">Boards</label>
          <label style={{color:'white'}} htmlFor="radio2" id="tab2">Reviews</label>
          <label style={{color:'white'}} htmlFor="radio3" id="tab3">Games</label>
          <label style={{color:'white'}} htmlFor="radio4" id="tab4">Wishlist</label>
          <label style={{color:'white'}} htmlFor="radio5" id="tab5">Settings</label>
        </div>
        <div id="content">
          <section id="content1">
            <div>
            <BoardCard />




            </div>
          </section>
          <section id="content2">

            <CombinedCards />
            <br />



          </section>
          <section id="content3">
             <div className='gcard-container'>
             <GameCard games = {savedGameDetails} />

            </div>
          </section>
          <section id="content4">
            <div>
            <WishlistCard />

            </div>
          </section>
          <section style={{ marginLeft: '100px'}} id="content5">
            <Settings />
          </section>
          </div>

      </main>
    </div>
  );
}

export default Dashboard;
