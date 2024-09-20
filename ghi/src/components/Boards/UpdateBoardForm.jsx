import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Hero from "../Accounts/Hero"

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
    <div>
      <Hero />
      <div style={{ position: 'relative', ...containerStyle }}>
        <div style ={{ ...centerVertically, width: '100%'}}>
          <div className="card text-bg-light mb-3">
            <div className="container">
              <div className="row"style={{ backgroundColor: 'transparent', paddingLeft: '0%', marginLeft: '0%', marginRight: '0%' }}>
                <div className="offset-1 col-10">
                  <h2 className="card-header" style={{ textAlign: 'center'}}>Update Board</h2>
                    <div style={{ width: '100%'}}>
                      <form onSubmit={handleSubmit} id="create-review">
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="board_name">Title</label>
                          <input onChange={handleFormChange} required type="text" name="board_name" id="board_name" className="form-control" value={formData.board_name} />
                        </div>
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="description">Description</label>
                          <textarea onChange={handleFormChange} name="description" id="description" className="form-control" value={formData.description} rows="3"></textarea>
                        </div>
                        <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                          <label htmlFor="cover_photo">Cover photo</label>
                          <input onChange={handleFormChange} required type="url" name="cover_photo" id="cover_photo" className="form-control" value={formData.cover_photo} />
                          <small className="form-text text" style={{color: "white"}}>Default cover photo provided above</small>
                        </div>
                      </form>
                      <div className="d-flex justify-content-between">
                        <button className="mb-3" style={{ textAlign: 'left'}} onClick={() => navigate(-1)}>Back</button>
                        <button form="create-review" className="mb-3" style={{ textAlign: 'right'}}>Update</button>
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

export default UpdateBoardForm;
