import './userReviewCard.css';
import StarRating from '../GameDetails/StarRating';
import {useNavigate} from 'react-router-dom';

function UserReviewCard({ userReviews }) {
  const navigate = useNavigate();
  return (
    <div>
      {userReviews.length === 0 ? (
        <p style={{color:'white'}}>No reviews created yet.</p>
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
