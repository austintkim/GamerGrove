import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './largeUserReviewCard.css';
import StarRating from '../GameDetails/StarRating';


function LargeUserReviewCard({ gameId, accountId }) {
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);

    const fetchReviewsForGame = async (gameId) => {
    const votes = await fetchVotesForUser();
    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/games/${gameId}`;

    try {
      const response = await fetch(reviewsUrl);

      if (response.status === 404) {
        setUserReviews([]);
      } else {
        const reviewsData = await response.json();
        if (votes.length > 0) {
          for (const r of reviewsData) {
          let change = 0

          for (const v of votes) {
            if (r.id == v.review_id) {
              change++
              if (v.upvote) {
                r.upvote = true
                r.downvote = false
              } else {
                r.upvote = false
                r.downvote = true
              }
            }
          }
         if (change === 0) {
            r.upvote = undefined
            r.downvote = undefined
          } else {
            change = 0
          }

        }

    }
        setUserReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchVotesForUser = async () => {
    const user = await fetchUserName();
    const votesUrl = `${import.meta.env.VITE_API_HOST}/api/votes/users/${user}`;

    const votesConfig = {
      credentials: 'include'
    };


      const response = await fetch(votesUrl, votesConfig);
      if (response.ok) {
        const votesData = await response.json();

        const votes = []
        for (const v of votesData) {
          votes.push(v)

        }
        return votes

      } else {
        return 0
      }


  };

  useEffect(() => {
    fetchReviewsForGame(gameId);
    fetchVotesForUser();
  }, []);

  async function fetchUserName() {
  const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
  const fetchConfig = {
    credentials: 'include',
    redirect: 'follow',
  };

  const response = await fetch(tokenUrl, fetchConfig);

  if (response.ok) {
    const data = await response.json();
    return data.account.id;
  }
  }


  const handleUpVoteClick = async (reviewId, gameId) => {
    const user = await fetchUserName();


    if (user) {
      const voteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/users/${user}`
      const response = await fetch(voteUrl, { credentials: 'include' });
      if (response.ok) {
        const votes = await response.json()



        for (const v of votes) {
          if (v.account_id == user && v.review_id == reviewId ) {
            if (v.upvote == true) {

              return

            } else {
              fetchReviewsForGame(gameId)
              return
            }


          }
        }
          fetchReviewsForGame(gameId)


      } else {
          fetchReviewsForGame(gameId)
      }
    }
  }


  const handleDownVoteClick = async (reviewId, gameId) => {
    const user = await fetchUserName();
    if (user) {
      const voteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/users/${user}`
      const response = await fetch(voteUrl, { credentials: 'include' });
      if (response.ok) {
        const votes = await response.json()



        for (const v of votes) {
          if (v.account_id == user && v.review_id == reviewId ) {
            if (v.downvote == true) {
              return
            } else {
              fetchReviewsForGame(gameId)
              return

            }

          }
        }
          fetchReviewsForGame(gameId)



      } else {
          fetchReviewsForGame(gameId)
      }
    }
  }

  return (
    <div>
      {Array.isArray(userReviews) && userReviews.length > 0 ? (
        userReviews.map((review) => (
          <div key={review.id} className="largercard">
            <div>
            <div className="lurcard-title">{review.title}</div>
            </div>
            <div>
              {review.account_id === accountId && (
                <>
                  <button
                    className="lurcard-edit-delete"
                    style={{ color: 'black' }}
                    onClick={() => {
                      navigate(`/reviews/update/${review.id}/${review.game_id}`)
                    }}
                  >
                    Edit
                  </button>{' '}
                  <button
                    className="lurcard-delete"
                    style={{ color: 'black', fontFamily: 'K2D', fontSize: '18px' }}
                    onClick={() => {
                      navigate(`/reviews/delete/${review.id}`)
                    }}
                  >
                    Delete
                  </button>{' '}
                </>
              )}
            </div>
            <div className="lurline"></div>
            <div style={{color: 'white'}} className="lurcard-content">

              <div className="lurcard-details">
                <p>{review.body}</p>
              </div>
              <div className="lurcard-date">
                  <p>Rating: {review.rating}</p>
                  <div className="rating-container">
                    <div className="star-rating" style={{ marginRight: '-30px', marginBottom: '-250px', position: 'relative'}}>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
              </div>

            </div>
            <div className='divthumbs'>
              <button onClick = {() => {
                handleUpVoteClick(review.id, review.game_id)
              }}
              style={{ backgroundColor: review.upvote === true ? 'green' : 'transparent' }}
              >
              <img
                className='thumb-up'
                src="https://i.postimg.cc/dV4GtWb9/Thumbs-Up-White.png"
                alt="Thumbs Up"
              />
              <p className="urp" style={{ color: 'white', margin: '0', fontWeight: 'bold', textAlign: 'center' }}>{review.upvote_count}</p>
              </button>
              <button className='down-btn' onClick = {() => {
                handleDownVoteClick(review.id, review.game_id)
              }}
              style={{ backgroundColor: review.downvote === true ? 'red' : 'transparent' }}
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

export default LargeUserReviewCard;