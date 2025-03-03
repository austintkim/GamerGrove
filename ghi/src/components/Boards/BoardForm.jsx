import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import board from '../../assets/board.gif';

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

const initialData = {
  board_name: "",
  description: "",
  cover_photo: "https://img.freepik.com/premium-photo/gaming-computer-table-video-game-room-with-purple-color-neon-lighting-against-window-background-3d-illustration_76964-5151.jpg"
}

function BoardForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialData);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards`



    const fetchConfig = {
      method: "post",
      body: JSON.stringify(formData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(boardUrl, fetchConfig);
    if (response.ok) {
      navigate("/dashboard");
      setFormData(initialData);
    } else {
      throw new Error('Failed to create review')
    }
  }

  return (
      <div>
          <img
              src={board}
              alt=""
              style={{
                  position: 'fixed',
                  bottom: '55%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '250px',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  padding: '16px',
                  zIndex: 3,
              }}
          />
          <div style={containerStyle}>
              <div style={{ ...centerVertically, width: '100%' }}>
                  <div className="card text-bg-light mb-3">
                      <div className="container">
                          <div
                              className="row"
                              style={{
                                  backgroundColor: 'transparent',
                                  paddingLeft: '0%',
                                  marginLeft: '0%',
                                  marginRight: '0%',
                              }}
                          >
                              <div className="offset-1 col-10">
                                  <h2
                                      className="card-header"
                                      style={{ textAlign: 'center' }}
                                  >
                                      Create a Board
                                  </h2>
                                  <div style={{ width: '100%' }}>
                                      <form
                                          onSubmit={handleSubmit}
                                          id="create-review"
                                      >
                                          <div
                                              className="form-floating mb-3"
                                              style={{ textAlign: 'center' }}
                                          >
                                              <label htmlFor="board_name">
                                                  Title
                                              </label>
                                              <input
                                                  onChange={handleFormChange}
                                                  placeholder="i.e. 2023 Favs"
                                                  required
                                                  type="text"
                                                  name="board_name"
                                                  id="board_name"
                                                  className="form-control"
                                                  value={formData.board_name}
                                              />
                                          </div>
                                          <div
                                              className="form-floating mb-3"
                                              style={{ textAlign: 'center' }}
                                          >
                                              <label htmlFor="description">
                                                  Description
                                              </label>
                                              <textarea
                                                  onChange={handleFormChange}
                                                  placeholder="i.e. My favorite games from 2023"
                                                  name="description"
                                                  id="description"
                                                  className="form-control"
                                                  value={formData.description}
                                                  rows="3"
                                              ></textarea>
                                          </div>
                                          <div
                                              className="form-floating mb-3"
                                              style={{ textAlign: 'center' }}
                                          >
                                              <label htmlFor="cover_photo">
                                                  Cover photo
                                              </label>
                                              <input
                                                  onChange={handleFormChange}
                                                  placeholder="i.e. https://media.wired.com/photos/5932b1c5aef9a462de984519/master/pass/dqixart.jpg"
                                                  required
                                                  type="url"
                                                  name="cover_photo"
                                                  id="cover_photo"
                                                  className="form-control"
                                                  value={formData.cover_photo}
                                              />
                                              <small
                                                  className="form-text text"
                                                  style={{ color: 'white' }}
                                              >
                                                  Default cover photo provided
                                                  above
                                              </small>
                                          </div>
                                      </form>
                                      <div className="d-flex justify-content-between">
                                          <button
                                              className="mb-3"
                                              style={{ textAlign: 'left' }}
                                              onClick={() => navigate(-1)}
                                          >
                                              Back
                                          </button>
                                          <button
                                              form="create-review"
                                              className="mb-3"
                                              style={{ textAlign: 'right' }}
                                          >
                                              Create
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default BoardForm;
