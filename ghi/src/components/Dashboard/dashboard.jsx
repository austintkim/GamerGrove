import './dashboard.css';
import {useAuthContext} from "@galvanize-inc/jwtdown-for-react";
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from '../Cards/boardCard.jsx';
import GameCard from '../Cards/gameCard.jsx';
import WishlistCard from '../Cards/wishlistCard.jsx';
import SideMenu from '../Home/Menu';
import Nav from '../Home/Nav';
import CombinedCards from '../Cards/combinedCards';
import Settings from '../Accounts/Settings.jsx';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function Dashboard() {
  const[icons, setIcons] = useState([]);
  const[userToken, setUserToken] = useState(null);
  const[userDataDetails, setUserDataDetails] = useState('');
  const[userLibraryEntries, setUserLibraryEntries] = useState([]);
  const[libraryGameDetails, setLibraryGameDetails] = useState([]);
  const[savedGameDetails, setSavedGameDetails] = useState([]);
  const[wishListGameDetails, setWishListGameDetails] = useState([]);

  const { token } = useAuthContext();
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate("/login");
  };

  const fetchIcons = async () => {
    const url = `${import.meta.env.VITE_API_HOST}/api/icons`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      setIcons(data);
    } else {
      throw new Error('Failed to retrieve icons data');
    }
  };

  const fetchUserData = async () => {
    const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

    const fetchConfig = {
      credentials: 'include',
    };

    const response = await fetch(tokenUrl, fetchConfig);
    const data = await response.json();
    if (data) {
      setUserToken(data.access_token);
      setUserDataDetails(data.account);
      return data.account;
    } else {
      throw new Error ('No active token')
    }
  };

  const fetchUserGames = async(userId) => {
    const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${userId}`;
    const libraryConfig = {
        credentials: 'include',
      };

    try {
      const response = await fetch(libraryUrl, libraryConfig);
      const libraryData = await response.json();

      if (libraryData.detail) {
        setSavedGameDetails([]);
        setWishListGameDetails([]);
        return;
      } else {
        setUserLibraryEntries(libraryData);
      }

      const gameDetails = await Promise.all(
        libraryData.map(async (item) => {
          const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games/${item.game_id}`);
          const gamesData = await response.json();
          gamesData['wishlist'] = item.wishlist;
          return gamesData;
      })
      );

      setLibraryGameDetails(gameDetails);

      const seenIds = new Set();
      const uniqueGameDetails = gameDetails.filter(item => {
        if (seenIds.has(item.id)) {
          return false;
        }
        seenIds.add(item.id);
          return true
      });


      setSavedGameDetails(uniqueGameDetails);

    } catch (error) {
      console.error('Error fetching data:', error);
    }

};

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData?.id) {
        await fetchUserGames(userData.id);
      }
    };
  fetchIcons();
  fetchData();
  }, []);

  useEffect(() => {
    const wishListGames = libraryGameDetails.filter((item) => item.wishlist === true);
    setWishListGameDetails(wishListGames);
  }, [libraryGameDetails]);


  const dashboardLogOut = () => {
    setUserToken(null);
    setUserDataDetails('');
  }

  const handleGameRemoved = () => {
    fetchUserGames(userDataDetails.id);
  };

  const handleSettingsUpdate = () => {
    fetchUserData();
  }

  if (token) {
    return (
      <div>
        <SideMenu />
        <Nav
          userCookie = {userToken}
          userData = {userDataDetails}
          userLogOut = {dashboardLogOut}
        />
        <main>
          <h1 style={{color:'white'}} >{userDataDetails.username}&apos;s Dashboard 🎛️ 🖥️ 📟</h1>

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
              <WishlistCard
              onGameRemoved={handleGameRemoved}
              libraryEntries = {userLibraryEntries}
              userData = {userDataDetails}
              wishListGames = {wishListGameDetails}
              />

              </div>
            </section>
            <section style={{ marginLeft: '100px'}} id="content5">
              <Settings
              iconData = {icons}
              userData = {userDataDetails}
              onSettingsUpdate = {handleSettingsUpdate}
              />
            </section>
            </div>

        </main>
      </div>
    );
  } else {
    return (
      <div style={containerStyle}>
      <div className="card text-bg-light mb-3">
        <div className="card-body">
          <div>
            You have been logged out due to inactivity...😅 Please log back in!
          </div>
          <button onClick={handleBackToLogin}> Log In </button>
        </div>
      </div>
    </div>
    );
  }
}

export default Dashboard;
