import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialData = {
  board_name: "",
  description: "",
  cover_photo: "https://assets-global.website-files.com/618d852d383de946ce0e3fa5/6495da7241185414c12ddc02_videoGamePlanet-p-800.png"
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
    <div className="container">
      <div className="row">
        <div className="offset-3 col-6">
          <div className="shadow p-4 mt-4">
            <h1>Create a Board</h1>
            <form onSubmit={handleSubmit} id="create-review">
              <div className="form-floating mb-3">
                <label htmlFor="board_name">Title</label>
                <input onChange={handleFormChange} placeholder="i.e. 2023 Favs" required type="text" name="board_name" id="board_name" className="form-control" value={formData.board_name} />
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="description">Description</label>
                <textarea onChange={handleFormChange} placeholder="i.e. My favorite games from 2023" name="description" id="description" className="form-control" value={formData.description} rows="3"></textarea>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="cover_photo">Cover photo</label>
                <input onChange={handleFormChange} placeholder="i.e. https://media.wired.com/photos/5932b1c5aef9a462de984519/master/pass/dqixart.jpg" required type="url" name="cover_photo" id="cover_photo" className="form-control" value={formData.cover_photo} />
                <small className="form-text text" style={{color: "white"}}>Default cover photo provided above</small>
              </div>
              <button>Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardForm;
