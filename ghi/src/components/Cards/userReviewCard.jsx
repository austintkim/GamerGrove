import { useState, useEffect } from 'react';
import './userReviewCard.css';
import StarRating from '../GameDetails/StarRating';
import {useNavigate} from 'react-router-dom';

async function fetchAccountId() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

  const fetchConfig = {
    credentials: 'include',
  };

  try {
    const response = await fetch(tokenUrl, fetchConfig);

    if (response.ok) {
      const data = await response.json();
      return data.account.id;
    } else {
      console.error('Error fetching account ID:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching account ID:', error);
    return null;
  }
}

function UserReviewCard() {
  const navigate = useNavigate();

  const [userReviews, setUserReviews] = useState([]);

  const fetchUserReviews = async (accountId) => {
    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/users/${accountId}`;

    try {
      const response = await fetch(reviewsUrl, { credentials: 'include' });

      if (response.ok) {
        const reviewsData = await response.json();
        setUserReviews(reviewsData);
      } else {
        setUserReviews([]);
      }
    } catch (error) {
      setUserReviews([]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const accountId = await fetchAccountId();
      if (accountId) {
        fetchUserReviews(accountId);
      } else {
        console.error('Error fetching account ID');
        setUserReviews([]);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {userReviews.length === 0 ? (
        <p style={{color:'white'}}>No user reviews available.</p>
      ) : (
        userReviews.map((review) => (
          <div key={review.id} className="urcard">
            <div className="urcard-contenet">
            <div className="urcard-title">{review.title}</div>


            </div>
            <div className="urline"></div>
            <div className="urcard-content">

              <div className="urcard-details" style={{ color: 'black', flex: '2', textAlign: 'right' }}>
                <p>{review.body}</p>
                {review.rating && (
                  <div className="rating-container">
                    <div className="star-rating">
                      <StarRating rating={review.rating} />

                    </div>
                    <div>
                    <button className="urcard-edit-delete" style={{ color: 'black' }} onClick={() => {
                      navigate(`/reviews/update/${review.id}/${review.game_id}`)
                    }}>Edit</button> |
                    <button className="urcard-edit-delete" style={{ color: 'black' }} onClick={() => {
                            navigate(`/reviews/delete/${review.id}`)
                    }}>Delete</button>
                  </div>
                  </div>

                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserReviewCard;
