import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
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
        const sortedReviews = reviewsData.sort((a, b) => new Date(b.last_update) - new Date(a.last_update));
        setUserReviews(sortedReviews);
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
              <div className="lurcard-details">
                <p>{review.body}</p>
              </div>
              <div className="lurcard-date">
                  <div className="rating-container">
                    <div className="star-rating" style={{marginTop: '75px'}}>
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
            <p style={{ color: 'white', marginRight: '10px', marginBottom: '10px', textAlign: 'right', margin: '0'}}> Posted {formatDistanceToNow(new Date(`${review.date_created}Z`), { addSuffix: true })} by {review.username}</p>
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
