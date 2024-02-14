import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './largeUserReviewCard.css';
import StarRating from '../GameDetails/StarRating';


function LargeNonUserReviewCard({ gameId }) {
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);


  const fetchReviewsForGame = async (gameId) => {
    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/games/${gameId}`;

    try {
      const response = await fetch(reviewsUrl);

      if (response.status === 404) {
        setUserReviews([]);
      } else {
        const reviewsData = await response.json();
        setUserReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  useEffect(() => {
    fetchReviewsForGame(gameId);
  }, [gameId]);


  return (
    <div>
      {Array.isArray(userReviews) && userReviews.length > 0 ? (
        userReviews.map((review) => (
          <div key={review.id} className="largercard">
            <div className="lurcard-title">{review.title}</div>

            <div className="lurline"></div>
            <div style={{color: 'white'}} className="urcard-content">
              <div className="lurcontainer">
                <p>{review.body}</p>
              </div>
              <div className="lurcontainer">
                  <div className="rating-container">
                    <div className="star-rating" style={{marginTop: '15px'}}>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
              </div>
            </div>
            <div className='divthumbsnouser'>
              <button onClick = {() => {
                navigate(`/games/${gameId}/nonuser`)
              }}
              style = {{ backgroundColor: 'transparent'}}
              >
              <img
                className="thumb-up"
                src="https://i.postimg.cc/dV4GtWb9/Thumbs-Up-White.png"
                alt="Thumbs Up"
              />
              <p className="urp" style={{ color: 'white', margin: '0', fontWeight: 'bold', textAlign: 'center' }}>{review.upvote_count}</p>
              </button>
              <button onClick = {() => {
                navigate(`/games/${gameId}/nonuser`)
              }}
              style = {{ backgroundColor: 'transparent'}}
              >
              <img
                className="thumbs-down"
                src="https://i.postimg.cc/fyNVvm4L/Thumbsdown-White.png"
                alt="Thumbs Down"
              />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', marginRight: '250px' }}>
          No reviews available for this game.
        </p>
      )}
    </div>
  );
}

export default LargeNonUserReviewCard;
