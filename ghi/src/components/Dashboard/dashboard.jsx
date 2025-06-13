import './dashboard.css';
import {useAuthContext} from "@galvanize-inc/jwtdown-for-react";
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from '../Cards/boardCard.jsx';
import GameCard from '../Cards/gameCard.jsx';
import WishlistCard from '../Cards/wishlistCard.jsx';
import SideMenu from '../Home/sideMenu';
import Nav from '../Home/Nav';
import UserReviewCard from '../Cards/userReviewCard';
import UserLikeCard from '../Cards/userLikeCard';
import Settings from '../Accounts/Settings.jsx';
import bmdashboard from '../../assets/bmdashboard.gif'

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
  const[tokenFetchAttempted, setTokenFetchAttempted] = useState(false);
  const[loading, setLoading] = useState(true);

  const[userBoardDetails, setUserBoardDetails] = useState([]);
  const[mappedUserBoardDetails, setMappedUserBoardDetails] = useState([]);
  const[boardGameDetails, setBoardGameDetails] = useState([]);

  const[userReviewDetails, setUserReviewDetails] = useState([]);
  const[reviewGameDetails, setReviewGameDetails] = useState([]);

  const[userLikedReviewDetails, setUserLikedReviewDetails] = useState([]);
  const[likeGameDetails, setLikeGameDetails] = useState([]);

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
    const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`

    const fetchConfig = {
        credentials: 'include',
    }

    try {
        const response = await fetch(tokenUrl, fetchConfig)
        const data = await response.json()
        if (data) {
            setUserToken(data.access_token)
            setUserDataDetails(data.account)
            return data.account
        }
        console.warn('No active token found');
        return null;
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setTokenFetchAttempted(true);
      }
    }


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
          gamesData['board_id'] = item.board_id;
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
      console.error('Error fetching user saved games:', error);
    }

  };

  const fetchUserBoards = async(userId) => {
    const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/users/${userId}`;
    const boardConfig = {
      credentials: 'include',
    };

    try {
      const response = await fetch(boardUrl, boardConfig);
      const boardData = await response.json();

      if (boardData.detail) {
        setUserBoardDetails([]);
        return;
      } else {
        setUserBoardDetails(boardData);
      }
    } catch (error) {
      console.error('Error fetching boards', error)
    }

  }

  const mapGamestoBoards = async(boards, games) => {
    const boardGamesMap = {};
    games.forEach(game => {
      if (!(game.board_id in boardGamesMap)) {
        boardGamesMap[game.board_id] = [game];
      } else {
        boardGamesMap[game.board_id].push(game);
      }
    });

    boards.forEach(board => {
      board.games = boardGamesMap[board.id] || [];
    });

    setMappedUserBoardDetails(boards);
  }

  const fetchUserReviews = async(accountId) => {
    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/users/${accountId}`;

    try {
      const response = await fetch(reviewsUrl, { credentials: 'include' });
      const reviewData = await response.json();

      if (reviewData.detail) {
        setUserReviewDetails([]);
        return;
      } else {
        const sortedReviews = reviewData.sort((a, b) => new Date(b.last_update) - new Date(a.last_update));
        setUserReviewDetails(sortedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  }

  const fetchUserReviewGames = async(reviews) => {
    const gameDetails = await Promise.all(
      reviews.map(async (item) => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games/${item.game_id}`);
        const gamesData = await response.json();
        return gamesData;
      })
    );
    const seenIds = new Set();
    const uniqueGameDetails = gameDetails.filter((game) => {
      if (seenIds.has(game.id)) {
        return false;
      }
      seenIds.add(game.id);
      return true;
    });

    setReviewGameDetails(uniqueGameDetails);

  }

  const fetchUserLikedReviews = async(accountId) => {
    const votesUrl = `${
        import.meta.env.VITE_API_HOST
    }/api/votes/users/${accountId}`

    try {
      const response = await fetch(votesUrl, { credentials: 'include' });
      const voteData = await response.json();

      if (voteData.detail) {
        setUserLikedReviewDetails([]);
        return;
      } else {
        const sortedLikes = voteData.filter(i => i.upvote).sort((a, b) => new Date(b.last_update) - new Date(a.last_update));

        const reviewResponses = await Promise.all(
          sortedLikes.map((like) =>
            fetch(
              `${import.meta.env.VITE_API_HOST}/api/reviews/${
                like.review_id
                }`
              )
            )
          )

          const reviewData = await Promise.all(
            reviewResponses.map((res) => res.json())
          )
          setUserLikedReviewDetails(reviewData)
        }
    } catch (error) {
      console.error('Error fetching likes', error)
    }
  }

  const fetchLikeReviewGames = async (reviewData) => {
      try {
          // Fetch games using game_id from each review
          const gameResponses = await Promise.all(
              reviewData.map((review) =>
                  fetch(
                      `${import.meta.env.VITE_API_HOST}/api/games/${
                          review.game_id
                      }`
                  )
              )
          )
          const gameData = await Promise.all(
              gameResponses.map((res) => res.json())
          )

          // Optional: Remove duplicates
          const seenIds = new Set()
          const uniqueGameData = gameData.filter((game) => {
              if (seenIds.has(game.id)) return false
              seenIds.add(game.id)
              return true
          })

          setLikeGameDetails(uniqueGameData);
      } catch (error) {
          console.error('Error fetching liked review games:', error)
      }
  }


  useEffect(() => {
    const fetchData = async () => {
        const userData = await fetchUserData();
        if (userData?.id) {
          await Promise.all([
            fetchUserBoards(userData.id),
            fetchUserReviews(userData.id),
            fetchUserGames(userData.id),
            fetchUserLikedReviews(userData.id)
          ]);
          setLoading(false);
        }
    };

  fetchIcons();
  fetchData();
  }, [token]);

  useEffect(() => {
    if (userBoardDetails.length && boardGameDetails.length) {
      mapGamestoBoards(userBoardDetails, boardGameDetails);
    }
  }, [userBoardDetails, boardGameDetails])


  useEffect(() => {
    const wishListGames = libraryGameDetails.filter((item) => item.wishlist === true);
    setWishListGameDetails(wishListGames);
    const boardGames = libraryGameDetails.filter((item) => item.board_id !== null);
    setBoardGameDetails(boardGames);
  }, [libraryGameDetails]);

  useEffect(() => {
    if (userReviewDetails.length) {
      fetchUserReviewGames(userReviewDetails)
    }
  }, [userReviewDetails])

  useEffect(() => {
      if (userLikedReviewDetails.length) {
          fetchLikeReviewGames(userLikedReviewDetails)
      }
  }, [userLikedReviewDetails])

  const handleGameRemoved = () => {
    fetchUserGames(userDataDetails.id);
  };

  const handleSettingsUpdate = () => {
    fetchUserData();
  }

  if (!tokenFetchAttempted || loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (!token) {
    return (
        <div style={containerStyle}>
            <div className="card text-bg-light mb-3">
                <div className="card-body">
                    <div>
                        You have been logged out due to inactivity...😅 Please
                        log back in!
                    </div>
                    <button onClick={handleBackToLogin}> Log In </button>
                </div>
            </div>
        </div>
    )
  }
  return (
      <div>
          <SideMenu />
          <Nav userCookie={userToken} userData={userDataDetails} />
          <main>
              <h1
                  style={{
                      color: 'white',
                      textAlign: 'left',
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginBottom: '0px',
                  }}
              >
                  {userDataDetails.username}&apos;s Dashboard 🎛️ 🖥️ 📟
                  <img
                      src={bmdashboard}
                      alt=""
                      style={{
                          width: '70px',
                          objectFit: 'contain',
                          cursor: 'pointer',
                          padding: '4px',
                          position: 'relative',
                      }}
                  />
              </h1>

              <input id="radio1" type="radio" name="css-tabs" defaultChecked />
              <input id="radio2" type="radio" name="css-tabs" />
              <input id="radio3" type="radio" name="css-tabs" />
              <input id="radio4" type="radio" name="css-tabs" />
              <input id="radio5" type="radio" name="css-tabs" />
              <input id="radio6" type="radio" name="css-tabs" />
              <div id="tabs">
                  <label style={{ color: 'white' }} htmlFor="radio1">
                      Boards
                  </label>
                  <label style={{ color: 'white' }} htmlFor="radio2">
                      Reviews
                  </label>
                  <label style={{ color: 'white' }} htmlFor="radio3">
                      Likes
                  </label>
                  <label style={{ color: 'white' }} htmlFor="radio4">
                      Games
                  </label>
                  <label style={{ color: 'white' }} htmlFor="radio5">
                      Wishlist
                  </label>
                  <label style={{ color: 'white' }} htmlFor="radio6">
                      Settings
                  </label>
              </div>
              <div id="content">
                  <section id="content1">
                      <div>
                          <BoardCard
                              boards={userBoardDetails}
                              boardsWithGames={mappedUserBoardDetails}
                          />
                      </div>
                  </section>
                  <section
                      id="content2"
                      style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '100%',
                          maxWidth: '935px',
                      }}
                  >
                      <UserReviewCard
                          reviews={userReviewDetails}
                          reviewGames={reviewGameDetails}
                      />
                      <br />
                  </section>
                  <section
                      id="content3"
                      style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '100%',
                          maxWidth: '935px',
                      }}
                  >
                    <UserLikeCard
                      likedReviews={userLikedReviewDetails}
                      likedReviewGames={likeGameDetails}
                    />
                      <br />
                  </section>
                  <section id="content4">
                      <div className="gcard-container">
                          <GameCard games={savedGameDetails} />
                      </div>
                  </section>
                  <section id="content5">
                      <div>
                          <WishlistCard
                              onGameRemoved={handleGameRemoved}
                              libraryEntries={userLibraryEntries}
                              userData={userDataDetails}
                              wishListGames={wishListGameDetails}
                          />
                      </div>
                  </section>
                  <section style={{ marginLeft: '100px' }} id="content6">
                      <Settings
                          iconData={icons}
                          userData={userDataDetails}
                          onSettingsUpdate={handleSettingsUpdate}
                      />
                  </section>
              </div>
          </main>
      </div>
  )
}



export default Dashboard;
