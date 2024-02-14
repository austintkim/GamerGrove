import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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



const fetchBoards = async (id) => {
  const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/${id}`;
  const boardConfig = {
    credentials: 'include'
  };

  const response = await fetch(boardUrl, boardConfig);

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

function UpdateBoardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    board_name: '',
    description: '',
    cover_photo: ''
  });

  const fetchAccount = async (user) => {
  if (user !== undefined) {
    const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${user}`;
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

        const boardData = await fetchBoards(id);

        if (boardData) {
          setFormData({
            board_name: boardData.board_name || '',
            description: boardData.description || '',
            cover_photo: boardData.cover_photo || ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/${id}/${accountData.id}`;

    const fetchConfig = {
      method: 'put',
      body: JSON.stringify(formData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(boardUrl, fetchConfig);

    if (response.ok) {
      navigate('/dashboard');
    } else {
      console.error('Failed to update board');
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="offset-3 col-6">
          <div className="shadow p-4 mt-4">
            <h1>Update a board</h1>
            <form onSubmit={handleSubmit} id="create-board">
              <div className="form-floating mb-3">
                <label htmlFor="board_name">Title</label>
                <input onChange={handleFormChange} required type="text" name="board_name" id="board_name" className="form-control" value={formData.board_name} />
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="description">Description</label>
                <textarea onChange={handleFormChange} required name="description" id="description" className="form-control" value={formData.description} rows="3"></textarea>
              </div>
              <div className="form-floating mb-3">
                <label htmlFor="cover_photo">Cover photo</label>
                <input onChange={handleFormChange} required type="url" name="cover_photo" id="cover_photo" className="form-control" value={formData.cover_photo} />
              </div>
              <button>Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBoardForm;
