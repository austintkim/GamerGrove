import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../GameDetails/StarRating';
import Review from './Review';

import './Review.css'

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const centerVertically = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

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

const fetchReviews = async (id) => {
  const reviewUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/${id}`;
  const reviewConfig = {
    credentials: 'include',
  };

  const response = await fetch(reviewUrl, reviewConfig);

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

function UpdateReviewForm() {
  const navigate = useNavigate();
  const { review_id, game_id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    game_id: `${game_id}`,
    rating: '',
  });

  const fetchAccount = async (username) => {
  if (username !== undefined) {
    const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/username/${username}`;
    const response = await fetch(accountUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }
};

  const [accountData, setAccountData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = await fetchUserName();
        const account = await fetchAccount(username);

        setAccountData(account);

        const reviewData = await fetchReviews(review_id);

        if (reviewData) {
          setFormData({
            title: reviewData.title || '',
            body: reviewData.body || '',
            game_id: reviewData.game_id,
            rating: reviewData.rating || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [review_id]);

  const handleStarClick = (selectedRating) => {
    setFormData({
      ...formData,
      rating: selectedRating,
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reviewsUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/${review_id}/${accountData.id}`;

    const fetchConfig = {
      method: 'put',
      body: JSON.stringify(formData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(reviewsUrl, fetchConfig);

    if (response.ok) {
      navigate(`/dashboard`);
    } else {
      console.error('Failed to update review');
    }
  };

  return (
    <div>
      <Review />
      <div style={{ position: 'relative', ...containerStyle }}>
        <div style ={{ ...centerVertically, width: '100%'}}>
          <div className="card text-bg-light mb-3">
            <div className="container">
              <div className="row"style={{ backgroundColor: 'transparent', paddingLeft: '0%', marginLeft: '0%', marginRight: '0%' }}>
                <div className="offset-1 col-10">
                  <h2 className="card-header" style={{ textAlign: 'center'}}>Update Review</h2>
                    <div style={{ width: '100%'}}>
                      <form onSubmit={handleSubmit} id="update-review">
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="title">Title</label>
                          <input onChange={handleFormChange} required type="text" name="title" id="title" className="form-control" value={formData.title} />
                        </div>
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="description">Description</label>
                          <textarea onChange={handleFormChange} name="body" id="body" className="form-control" value={formData.body} rows="3"></textarea>
                        </div>
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="rating"style={{ marginBottom: '0rem' }}>Rating out of 5:</label>
                          <div className='rating-container d-flex justify-content-center'>
                          <div className='star-rating'>
                            <StarRating rating={formData.rating} onStarClick={handleStarClick} />
                            </div>
                        </div>
                        </div>
                      </form>
                      <div className="d-flex justify-content-between">
                        <button className="mb-3" style={{ textAlign: 'left'}} onClick={() => navigate(-1)}>Back</button>
                        <button form="update-review" className="mb-3" style={{ textAlign: 'right'}}>Update</button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateReviewForm;
