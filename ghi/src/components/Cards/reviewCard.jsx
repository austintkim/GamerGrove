import { useState, useEffect } from 'react';
import './reviewCard.css';
import { Link } from 'react-router-dom';

async function fetchAccountId() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

  const fetchConfig = {
    credentials: 'include',
  };

    const response = await fetch(tokenUrl, fetchConfig);
    const data = await response.json();
    if (data) {
      return data.account.id;
    } else {
      throw new Error ('No active token')
    }
}

function ReviewCard() {
  const [userReviews, setUserReviews] = useState([]);
  const [gameDetailsList, setGameDetailsList] = useState([]);

  const fetchUserReviews = async (accountId) => {
    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/users/${accountId}`;

    try {
      const response = await fetch(reviewsUrl, { credentials: 'include' });

      if (response.ok) {
        const reviewsData = await response.json();
        setUserReviews(reviewsData);
      } else {
        //empty
      }
    } catch (error) {
      //empty
    }
  };

  const fetchGameDetails = async (gameId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games/${gameId}`);

      if (response.ok) {
        const gameData = await response.json();
        return gameData;
      } else {
        console.error('Error fetching game details:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const accountId = await fetchAccountId();
      fetchUserReviews(accountId);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchGameDetailsForReviews = async () => {
      if (!Array.isArray(userReviews)) {
        console.error('Invalid userReviews data:', userReviews);
        return;
      }

      const gameDetailsPromises = userReviews.map(async (review) => {
        if (review.game_id) {
          return await fetchGameDetails(review.game_id);
        } else {
          return null;
        }
      });

      try {
        const fetchedGameDetailsList = await Promise.all(gameDetailsPromises);
        setGameDetailsList(fetchedGameDetailsList);
      } catch (error) {
        console.error('Error fetching game details for reviews:', error);
      }
    };

    if (userReviews.length > 0) {
      fetchGameDetailsForReviews();
    }
  }, [userReviews]);

  const handleLinkClick = (e) => {

    e.stopPropagation();
  };

  return (
    <div>
      {gameDetailsList.map((gameDetails) => (
        <div key={gameDetails.id} className="rcard">
          <div className="card-content">
            <div className="card-photo">
              <img src={gameDetails?.background_img} alt="Card Photo" />
            </div>
            <div className="card-details">
              <Link to={`/games/${gameDetails.id}`} onClick={handleLinkClick}>
                <div className="card-title">{gameDetails?.name}</div>
              </Link>
              <hr className="rsolid" />
              <div className="side-by-side">
                <div className="link-container">

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewCard;
