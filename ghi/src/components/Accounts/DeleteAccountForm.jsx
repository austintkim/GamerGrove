import { useParams, useNavigate } from 'react-router-dom';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const buttonStyle = {
  margin: '0 10px',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const greenButton = {
  ...buttonStyle,
  backgroundColor: 'green',
  color: 'white',
};

const redButton = {
  ...buttonStyle,
  backgroundColor: 'red',
  color: 'white',
};


const DeleteAccountForm = () => {
  const navigate = useNavigate();

  const { id, username } = useParams();

  const deleteCookie = (name, path = '/', domain = 'localhost') => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
  };

  const handleLogOut = async () => {
    const logOutUrl = `${import.meta.env.VITE_API_HOST}/token`;

    const fetchConfig = {
        method: "delete",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
      const response = await fetch(logOutUrl, fetchConfig);
      if(response.ok) {
        deleteCookie('fastapi_token', '/');
        return true;
      } else {
        throw new Error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault();

    const deleteUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${id}/${username}`;

    const deleteConfig = {
      method: "delete",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await fetch(deleteUrl, deleteConfig);
      if (response.ok) {
        const logOutSuccess = await handleLogOut();
        if (logOutSuccess) {
          navigate('/')
        } else {
          console.error('Failed to log out after account deletion');
        }
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="card text-bg-light mb-3">
        <div className="card-body">
          <div>
            Are you sure you want to delete this account?
          </div>
          <button style={greenButton} onClick={handleDelete}>Yes</button>
          <button style={redButton} onClick={() => navigate(-1)}>No</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountForm;
