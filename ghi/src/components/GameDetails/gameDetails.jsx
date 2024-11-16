import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import './gameDetails.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SideMenu from '../Home/Menu';
import Nav from '../Home/Nav';
import LargeUserReviewCard from '../Cards/largeUserReviewCard';
import LargeNonUserReviewCard from '../Cards/largeNonUserReviewCard';
import ScreenshotsCard from '../Cards/screenshotsCard';
import StarRating from './StarRating';
import parse from 'html-react-parser';
import { useLocation } from "react-router-dom";

const GameDetails = () => {
  const location = useLocation();
  const place = location.state;

  const lastHash = useRef('');
  useEffect(() => {
    if (place) {
      lastHash.current = place.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        lastHash.current = '';
      }, 100);
    }
  }, [place]);

  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [userToken2, setUserToken2] = useState(null);
  const [userDataDetails2, setUserDataDetails2] = useState('');
  const [gameData, setGameData] = useState(null);
  const [libraryData, setLibraryData] = useState(null);
  const [wishListText, setWishListText] = useState('Add to Wishlist');
  const [addToBoardText, setAddToBoardText] = useState('Add to Board');
  const [reviewFormData, setReviewFormData] = useState({
    title: "",
    body: "",
    game_id: id,
    rating: ""
  });
  const [submittedReview, setSubmittedReview] = useState(false);
  const [boards, setBoards] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [savedUsername, setSavedUsername] = useState('');

  const fetchUserData = async () => {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

  const fetchConfig = {
    credentials: 'include',
  };

  const response = await fetch(tokenUrl, fetchConfig);
  const data = await response.json();
  if (data) {
      setUserToken2(data.access_token);
      setUserDataDetails2(data.account);
      return data.account;
  } else {
      throw new Error ('No active token')
  }
};

  useEffect(() => {
      fetchUserData();
  }, []);

  const fetchScreenshots = async (rawg_pk) => {
    const rawgPk = rawg_pk
    const url = `${import.meta.env.VITE_API_HOST}/api/screenshots/${rawgPk}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      setScreenshots(data)
    }
  }

  const fetchUserName = async () => {
    const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
    const fetchConfig = {
      credentials: 'include',
    };
    const response = await fetch(tokenUrl, fetchConfig);

    if (response.ok) {
      const data = await response.json();
      if (data !== null) {
        return data.account.username;
      }
    }
  };

  const fetchAccount = async (savedUsername) => {
    if (savedUsername !== undefined) {
      const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${savedUsername}`;
      const response = await fetch(accountUrl);

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    }
  };

  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games/${id}`);
        const data = await response.json();
        fetchScreenshots(data.rawg_pk)
        setGameData(data);
      } catch (error) {
        console.error('Error fetching games data:', error);
      }
    };

    const fetchLibraryData = async () => {
      try {
        const username = await fetchUserName();
        const account = await fetchAccount(username);

        if (!account || !account.id) {
          console.error('Account data is undefined or missing ID.');
          return;
        }

        const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/users/libraries/${account.id}`;
        const fetchConfig = {
          credentials: 'include'
        };

        const response = await fetch(libraryUrl, fetchConfig);

        if (response.ok) {
          const data = await response.json();
          setLibraryData(data);
          for (const entry of data) {
            if (entry["account_id"] === account.id && entry["game_id"] == id && entry["wishlist"] === true) {
              setWishListText('Added to Wishlist!');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching library data', error);
      }
    };

  const fetchBoards = async () => {
    try {
      const username = await fetchUserName();
      const account = await fetchAccount(username);
      setAccountData(account)

      if (!account || !account.id) {

        return;
      }

      const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/users/${account.id}`;
      const fetchConfig = {
        credentials: 'include'
      };

      const boardResponse = await fetch(boardUrl, fetchConfig);

      let excludedBoardIds = [];

      if (boardResponse.ok) {
        const boardData = await boardResponse.json();
        if (libraryData) {
          for (const entry of libraryData) {
            if (entry["game_id"] === id && entry["board_id"]) {
              excludedBoardIds.push(entry["board_id"])
            }
          }
        }

        setBoards(boardData);
      }
    } catch (error) {
      console.log("Error fetching boards:", error);
    }
  };


    fetchGamesData();
    if (token) {
      fetchLibraryData();
    }
    fetchBoards();
  }, [id, token]);

  if (!gameData) {
    return null;
  }

  const getRecommendation = (rating) => {
    if (rating >= 4.3) {
      return "Highly Recommended 🔥🏆 ";
    } else if (rating >= 3.7) {
      return "Recommended 💣";
    } else if (rating >= 2.5) {
      return "Okay 🕯️";
    } else {
      return "Not Recommended 🛑";
    }
  };

  const handleFormChange = (e) => {
    setReviewFormData({
      ...reviewFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleStarClick = (selectedRating) => {
    setReviewFormData({
      ...reviewFormData,
      rating: selectedRating,
    });
  };

  const handleWishListClick = async () => {
    if (wishListText === 'Add to Wishlist') {
      const addEntryUrl = `${import.meta.env.VITE_API_HOST}/api/libraries`;

      const addEntryFetchConfig = {
        method: "post",
        body: JSON.stringify({ wishlist: true, game_id: id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        const addEntryResponse = await fetch(addEntryUrl, addEntryFetchConfig);
        if (addEntryResponse.ok) {
          setWishListText('Added to Wishlist!');
        } else {
          console.error('Failed to add to wishlist. Server response:', addEntryResponse);
          throw new Error('Failed to add to wishlist');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  const handleBoardClick = async (event) => {
    const data = {
      wishlist: false,
      game_id: id,
      board_id: event.target.value
    };

    const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/libraries`;
    const fetchConfig = {
      method: 'post',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        "Content-type": "application/json"
      }
    };

    try {
      const response = await fetch(libraryUrl, fetchConfig);
      if (response.ok) {
        let selectedBoard = boards.filter((board) => board.id === Number(data.board_id));
        setAddToBoardText(`Added to ${selectedBoard[0].board_name}!`);
      }
    } catch (error) {
      console.log("Error adding to board:", error);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const reviewUrl = `${import.meta.env.VITE_API_HOST}/api/reviews`;

    const fetchConfig = {
      method: "post",
      body: JSON.stringify(reviewFormData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(reviewUrl, fetchConfig);
      if (response.ok) {
        setReviewFormData({ ...reviewFormData, title: "", body: "", rating: "" });
        setSubmittedReview(true);
      } else {
        throw new Error('Failed to create review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };


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
          return link.url;
        }
      }
    } catch (error) {
      console.error('Error fetching store URL:', error);
      return null;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  const handleScreenshotClick = () => {
    document.getElementById("big-screenshots").style.opacity = "100";
    document.getElementById("big-screenshots").style.zIndex = "1";
  };

  const handleXbutton = () => {
    document.getElementById("big-screenshots").style.opacity = "0";
    document.getElementById("big-screenshots").style.zIndex = "-1";
  };

  const handleDismissSuccess = () => {
    const alertElement = document.getElementById('success-message');
    alertElement.style.opacity = '0';
    setTimeout(() => setSubmittedReview(true), 300);
  };

  const alertStyle = {
    display: submittedReview ? 'block' : 'none',
    maxWidth: '270px',
    margin: '0 auto',
    padding: '10px',
    opacity: submittedReview ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

  let messageReviewClasses = 'alert alert-success d-none mb-0';
  if (submittedReview) {
    messageReviewClasses = 'alert alert-success mb-0 d-flex justify-content-between align-items-center';
  }

  return (
    <div>
    {token ?


    <div>
      <SideMenu />
      <Nav
        userCookie2 = {userToken2}
        userData2 = {userDataDetails2}
        />

      <div className='gamescard-img2'>

        <img
          src={gameData.background_img}
          alt="Background"
          className="background-image"
        />
        <div>
          <br />
          <br />
          <br />
          <br />
          <h3 className='gamesh1'><Link to='/games'>Games</Link>/{gameData.name}</h3>

          <h5 className='gamesh2'>Buy Here</h5>
          <hr className='gamessolid' />
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} onClick={()=>{
            handleWishListClick();
          }}
          disabled = {wishListText === 'Added to Wishlist!' }
          >{wishListText}</button>
          <label >

            <select value = {addToBoardText} onChange={handleBoardClick} className='GDButton' style={{color:'black', width: 'fit-content'}}>
              <option value="">{addToBoardText}</option>
              {boards.map(board => {
                return(
                  <option key={board.id} value={board.id}>{board.board_name}</option>
                )

              })}
            </select>
          </label>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>{gameData.rating_count} ratings</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>Ovr. Rating: {"⭐".repeat(gameData.rating.toFixed(1))} {(gameData.rating.toFixed(1))}</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>Released: {gameData.dates}</button>

          <img
            className='GDIcon1'
            src="https://i.postimg.cc/nrDT7szB/image-5.png"
            width="35px"
            height="35px"
            alt="Icon 1"

          />
          {gameData.xbox && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/nrDT7szB/image-5.png"
            width="35px"
            height="35px"
            alt="Icon 1"
            type="button"
            onClick={() => handleClick('Xbox', gameData.rawg_pk)}
          />
          )}
          {gameData.playstation && (
          <img
            className='GDIcon'
            src="https://cdn.icon-icons.com/icons2/2429/PNG/512/playstation_logo_icon_147249.png"
            width="35px"
            height="35px"
            alt="Icon 2"
            type="button"
            onClick={() => handleClick('PlayStation', gameData.rawg_pk)}
          />
          )}
          {gameData.nintendo && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/R0qXLppc/image-3.png"
            width="35px"
            height="35px"
            alt="Icon 3"
            type="button"
            onClick={() => handleClick('Nintendo', gameData.rawg_pk)}
          />
          )}
          {gameData.pc && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
            width="35px"
            height="35px"
            alt="Icon 4"
            type="button"
            onClick={() => handleClick('PC', gameData.rawg_pk)}
          />
          )}

          <br />
          <div className="flex-container">
            <div className="flex-item">
              <br />
              <br />
              <p className='text-title'>About Game:</p>
              <div className='text'>{parse(gameData.description)}</div>
              <br />
              <p className='text-genres-dev'>Genres:</p>
              <p className='text-title1'>{gameData.genre}</p>
              <br />
              <p className='text-genres-dev'>Developers:</p>
              <p className='text-title1'>{gameData.developers}</p>

            </div>
            <div className="flex-item">


              <br />
            </div>
            <div className="flex-item">
              <h1 className="gameTitle">{gameData.name}</h1>

              <img
                className="divider"
                src="https://i.postimg.cc/6pP3GtxW/image-11.png"
                alt="Divider"
              />

              <div className='screenshotsHero' onClick={handleScreenshotClick}>
                <ScreenshotsCard rawgPk={gameData.rawg_pk} />
              </div>
              <div className="container">
                <p className="rec">Recommendation: {getRecommendation(gameData.rating)}</p>
              </div>
              <div id="big-screenshots">
                  <button onClick={handleXbutton} style={{backgroundColor: "darkgray"}}>❌</button>
                  <Slider {...settings}>
                    {screenshots.map((shot) => (
                        <div key={shot.id}>
                          <img
                            src={shot.image_url}
                            className="d-block"
                            style={{
                              maxHeight: '550px',
                              margin: 'auto',

                              borderRadius: '40px',
                            }}
                          />
                        </div>
                    ))}
                  </Slider>
              </div>
            </div>


          </div>
          <br/>
          <br/>
          <h1 className='gamesh1' style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>Write a Review</h1>
          <form onSubmit={handleReviewSubmit} id="create-review">
          <div className='rcontainer-title'>
            <input onChange={handleFormChange} placeholder='Review Title...' required type='text' name='title' id='title' className='form-control' value={reviewFormData.title} />
          </div>
          <div className='rcontainer'>
            <input onChange={handleFormChange} placeholder='Write a review...' required type='text' name='body' id='body' className='form-control' value={reviewFormData.body} />
          </div>
      <div className='rcontainer'>
        <div className='white-container'>
          <label htmlFor='rating' style={{marginBottom: '0rem'}} >Give a rating out of 5:</label>
          <div className='rating-container'>
            <div className='star-rating'>
              <StarRating rating={reviewFormData.rating} onStarClick={handleStarClick} />
            </div>
          </div>
        </div>
        <button style={{marginTop: '20px'}}>Submit</button>
      </div>
      </form>
          <br />
          <br />
          <br />
          <br />
      <div className='rcontainer' id='review' style={{marginTop: '10px'}}>
        <div
        className={messageReviewClasses} id="success-message"
        style={alertStyle}
        >
            Your review has been submitted!
            <button onClick = {handleDismissSuccess}
              type="button"
              className="close"
              style = {{
                position: 'absolute',
                top: '0',
                right: '5px',
                fontSize: '16px',
                }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
      </div>
          <h1 className='gamesh1' style={{ textAlign: 'center', textDecoration: 'underline', marginTop: '5px' }}>Reviews</h1>
          <div className='moveright' >
            <LargeUserReviewCard newReview = {submittedReview} gameId={gameData.id} accountId={accountData?.id} />
          </div>

        </div>
        <br />
      </div>
    </div>
    :

    <div>
      <SideMenu />
      <Nav />

      <div className='gamescard-img2'>

        <img
          src={gameData.background_img}
          alt="Background"
          className="background-image"
        />
        <div>
          <br />
          <br />
          <br />
          <br />
          <h3 className='gamesh1'>Games/{gameData.name}</h3>
          <h5 className='gamesh2'>Buy Here</h5>
          <hr className='gamessolid' />
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} onClick={()=>{
            navigate(`/games/${gameData.id}/nonuser`);
          }}>{wishListText}</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} onClick={()=>{
            navigate(`/games/${gameData.id}/nonuser`);
          }}>Add to Board</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>{gameData.rating_count} ratings</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>Ovr. Rating: {"⭐".repeat(gameData.rating.toFixed(1))} {(gameData.rating.toFixed(1))}</button>
          <button className='GDButton' style={{color:'black', width: 'fit-content'}} disabled>Released: {gameData.dates}</button>
          <img
            className='GDIcon1'
            src="https://i.postimg.cc/nrDT7szB/image-5.png"
            width="35px"
            height="35px"
            alt="Icon 1"
          />
          {gameData.xbox && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/nrDT7szB/image-5.png"
            width="35px"
            height="35px"
            alt="Icon 1"
            type='button'
            onClick={() => handleClick('Xbox', gameData.rawg_pk)}
          />
          )}
          {gameData.playstation && (
          <img
            className='GDIcon'
            src="https://cdn.icon-icons.com/icons2/2429/PNG/512/playstation_logo_icon_147249.png"
            width="35px"
            height="35px"
            alt="Icon 2"
            type='button'
            onClick={() => handleClick('PlayStation', gameData.rawg_pk)}
          />
          )}
          {gameData.nintendo && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/R0qXLppc/image-3.png"
            width="35px"
            height="35px"
            alt="Icon 3"
            type='button'
            onClick={() => handleClick('Nintendo', gameData.rawg_pk)}
          />
          )}
          {gameData.pc && (
          <img
            className='GDIcon'
            src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
            width="35px"
            height="35px"
            alt="Icon 4"
            type='button'
            onClick={() => handleClick('PC', gameData.rawg_pk)}
          />
          )}

          <br />
          <div className="flex-container">
            <div className="flex-item">
              <br />
              <br />
              <p className='text-title'>About Game:</p>
              <div className='text'>{parse(gameData.description)}</div>


              <br />
              <p className='text-genres-dev'>Genres:</p>
              <p className='text-title1'>{gameData.genre}</p>
              <br />
              <p className='text-genres-dev'>Developers:</p>
              <p className='text-title1'>{gameData.developers}</p>
            </div>
            <div className="flex-item">

            </div>
            <div className="flex-item">
              <h1 className="gameTitle">{gameData.name}</h1>
              <img
                className="divider"
                src="https://i.postimg.cc/6pP3GtxW/image-11.png"
                alt="Divider"
              />

              <div className='screenshotsHero' onClick={handleScreenshotClick}>
                <ScreenshotsCard  rawgPk={gameData.rawg_pk} />
              </div>
              <div id="big-screenshots">
                  <button onClick={handleXbutton} style={{backgroundColor: "darkgray"}}>❌</button>
                  <Slider {...settings}>
                    {screenshots.map((shot) => (
                        <div key={shot.id}>
                          <img
                            src={shot.image_url}
                            className="d-block w-100"
                            style={{
                              maxHeight: '550px',
                              margin: 'auto',

                              borderRadius: '40px',
                            }}
                          />
                        </div>
                    ))}
                  </Slider>
              </div>


              <div className="container">
                <p className="rec">Recommendation: {getRecommendation(gameData.rating)}</p>
              </div>
            </div>
          </div>
          <br/>
          <br/>
          <h1 className='gamesh1' style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px' }}>Write a Review</h1>
          <div className='rcontainer-title'>
            <input onClick={() => {
              navigate(`/games/${gameData.id}/nonuser`)
            }} placeholder='Review Title...' required type='text' name='title' id='title'/>
          </div>
          <div className='rcontainer'>
            <input onClick={() => {
              navigate(`/games/${gameData.id}/nonuser`)
            }} placeholder='Write a review...' required type='text' name='body' id='body'/>
          </div>
      <div className='rcontainer'>
        <div className='white-container'>
          <label htmlFor='rating' style={{marginBottom: '0rem'}} >Give a rating out of 5:</label>
          <div className='rating-container'>
            <div className='star-rating'>
              <StarRating onStarClick={() => {
                navigate(`/games/${gameData.id}/nonuser`)
              }} />
            </div>
          </div>
        </div>
        <button style={{marginTop: '20px'}} onClick = {() => {
          navigate(`/games/${gameData.id}/nonuser`)
        }}>Submit</button>
      </div>

          <br />
          <br />
          <br />
          <br />
      <div style={{marginTop: '10px'}}>
      </div>
          <h1 className='gamesh1' style={{ textAlign: 'center', textDecoration: 'underline', marginTop: '5px' }}>Reviews</h1>
          <div className='moveright' >
            <LargeNonUserReviewCard gameId={gameData.id} />
          </div>


        </div>
        <br />
      </div>


    </div>


  }
  </div>
  );
}

export default GameDetails;
