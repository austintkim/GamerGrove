import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

// const fetchUserName = async () => {
//   const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

//   const fetchConfig = {
//     credentials: 'include',
//   };

//   const response = await fetch(tokenUrl, fetchConfig);

//   if (response.ok) {
//     const data = await response.json();
//     if (data !== null) {
//       return data.account.username;
//     }
//   }
// }

function Settings( {iconData, userData, onSettingsUpdate} ) {
  const navigate = useNavigate();

  // const [icons, setIcons] = useState([]);
  // const [username, setUsername] = useState('');
  const [accountData, setAccountData] = useState('');
  const [incorrectLogin, setIncorrectLogin] = useState(false);

  // const fetchAccount = async (user) => {
  //   if (user !== undefined) {
  //     const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${user}`;
  //     const response = await fetch(accountUrl);
  //     if (response.ok) {
  //       const data = await response.json();
  //       return data;
  //     }
  //   }
  // };

  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    icon_id: ''
  });

  useEffect(() => {
    if (userData) {
        setAccountFormData({
          username: userData.username || '',
          password: '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          icon_id: userData.icon_id || ''
        });
      }
    }, [userData]);

  const [updatedAccount, setUpdatedAccount] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // const fetchData = async () => {
  //   const url = `${import.meta.env.VITE_API_HOST}/api/icons`;
  //   const response = await fetch(url);

  //   if (response.ok) {
  //     const data = await response.json();
  //     setIcons(data);
  //   } else {
  //     throw new Error('Failed to retrieve icons data');
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleFormChange = (e) => {
    setAccountFormData({
      ...accountFormData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordConfirm === accountFormData.password) {
      const loginUrl = `${import.meta.env.VITE_API_HOST}/token`;
      const form = new FormData();
      form.append("username", userData.username);
      form.append("password", accountFormData.password);
      const loginConfig = {
        method: 'post',
        body: form
      }

      const loginResponse = await fetch(loginUrl, loginConfig);
      if (!loginResponse.ok) {
        setIncorrectLogin(true);
        throw new Error('Incorrect password')
      }

      const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${userData.id}/${userData.username}`;

      const updateFetchConfig = {
        method: 'put',
        body: JSON.stringify(accountFormData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const updateResponse = await fetch(updateUrl, updateFetchConfig);
      if (updateResponse.ok) {
        accountFormData.password = '';
        setAccountFormData(accountFormData);
        setPasswordConfirm('');
        setUpdatedAccount(true);
        onSettingsUpdate();
        document.getElementById('password-confirm').value = '';
      } else {
        throw new Error('Failed to update account settings');
      }
    } else {
      setPasswordMismatch(true);
      throw new Error('Passwords did not match up');
    }
  };

  const handleDismissIncorrectLogin = () => {
    const loginAlert = document.getElementById('failure-message');
    if (loginAlert) {
      loginAlert.style.opacity = '0';
    }
    setTimeout(() => {
      setIncorrectLogin(false);
    }, 300);
  };

  const handleDismissWarning = () => {
    const alertElement = document.getElementById('warning-message');
    alertElement.style.opacity = '0';
    setTimeout(() => setPasswordMismatch(false), 300);
  };

  const handleDismissSuccess = () => {
    const successElement = document.getElementById('success-message');
    successElement.style.opacity = '0';
    setTimeout(() => setUpdatedAccount(false), 300);
  }

  const alertStyle = {
    display: passwordMismatch ? 'inline-block' : 'none',
    maxWidth: '250px',
    margin: '0 auto',
    padding: '10px',
    color: 'black',
    border: '1px solid #ffeeba',
    borderRadius: '4px',
    position: 'relative',
    whiteSpace: 'nowrap',
    opacity: passwordMismatch ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

const failureStyle = {
  display: incorrectLogin ? 'flex' : 'none',
  maxWidth: '175px',
  margin: '0 auto',
  padding: '10px',
  color: 'black',
  border: '1px solid #ffeeba',
  borderRadius: '4px',
  position: 'relative',
  whiteSpace: 'nowrap',
  opacity: incorrectLogin ? '1' : '0',
  transition: 'opacity 0.3s ease',
};

  const successStyle = {
    display: updatedAccount ? 'block' : 'none',
    maxWidth: '280px',
    margin: '0 auto',
    padding: '10px',
    opacity: updatedAccount ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

  let messageClasses = 'alert alert-success d-none mb-0';
  if (updatedAccount) {
    messageClasses = 'alert alert-success mb-0';
  }

  let warningClasses = 'alert alert-warning d-none mb-0';
  if (passwordMismatch) {
    warningClasses = 'alert alert-warning mb-0 d-flex justify-content-between align-items-center';
  }

  return (
    <div>
      <div style={{ alignItems: 'center' }}>
        <div className="settingscard">
          <div className="settingscard">
            <div
              className="row"
              style={{
                backgroundColor: 'transparent',
                paddingLeft: '11%',
                marginLeft: '0%',
                marginRight: '7%',
              }}
            >
              <div className="settingscard">
                <h4 className="card-header" style = {{textAlign:'center'}}>Account Settings</h4>
                <form onSubmit={handleSubmit} id="create-profile">
                  <div className="settingscard">
                    <label htmlFor="username">Username</label>
                    <input
                      onChange={handleFormChange}
                      required
                      type="text"
                      name="username"
                      id="username"
                      className="form-control"
                      value={accountFormData.username}
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <label htmlFor="first_name">First name</label>
                    <input
                      onChange={handleFormChange}
                      required
                      type="text"
                      name="first_name"
                      id="first_name"
                      className="form-control"
                      value={accountFormData.first_name}
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <label htmlFor="last_name">Last name</label>
                    <input
                      onChange={handleFormChange}
                      required
                      type="text"
                      name="last_name"
                      id="last_name"
                      className="form-control"
                      value={accountFormData.last_name}
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={handleFormChange}
                      required
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      value={accountFormData.email}
                      style={{ marginBottom: '15px' }}
                    />
                  </div>
                  <div className="text-center">
                    <label htmlFor="icon">Icon</label>
                    <div className="col-12 mb-3">
                      <select
                        onChange={handleFormChange}
                        required
                        name="icon_id"
                        id="icon_id"
                        className="form-select"
                        value={accountFormData.icon_id}
                      >
                        <option value=""></option>
                        {iconData.map((icon) => (
                          <option
                            key={icon.id}
                            value={icon.id}
                            style={{ textAlign: 'center' }}
                          >
                            {icon.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      className="row justify-content-center"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                        {iconData.map((icon, index) => (
                          <div
                            key={icon.id}
                            className="text-center"
                            style={{ marginRight: '30px' }}
                          >
                            <p>{String.fromCharCode(65 + index)}</p>
                            <img
                              src={icon.icon_url}
                              alt={icon.name}
                              width="50"
                              height="50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      onChange={handleFormChange}
                      required
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="new-password"
                      className="form-control"
                      value={accountFormData.password}
                      style={{ marginBottom: '15px' }}
                    />
                    <small className="form-text text-muted">
                      Enter password to either change it or confirm other account changes
                    </small>
                  </div>
                  <div className="form-floating mb-3">
                    <label htmlFor="password">Password Confirmation</label>
                    <input
                      onChange={passwordConfirmChange}
                      required
                      type="password"
                      name="password-confirm"
                      id="password-confirm"
                      className="form-control"
                      style={{ marginBottom: '15px' }}
                    />
                  </div>
                  <div
                    className={warningClasses}
                    id="warning-message"
                    style={alertStyle}
                  >
                    Your passwords do not match!
                    <button
                      onClick={handleDismissWarning}
                      type="button"
                      className="close"
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '5px',
                        fontSize: '16px',
                      }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="alert alert-danger mb-0" id="failure-message" style={failureStyle}>
                    Incorrect password...
                    <button onClick={handleDismissIncorrectLogin}
                      type="button"
                      className="close"
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '5px',
                        fontSize: '16px',
                      }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="mb-3">
                    <button style={{ marginTop: '16px' }}>Update</button>
                  </div>
                  <div className="mb-3">
                    <button
                      style={{ backgroundColor: 'red' }}
                      type="button"
                      onClick={() => {
                        navigate(`/settings/delete/${userData.id}/${userData.username}`)
                      }}
                    >
                      Delete Account
                    </button>
                  </div>
                </form>
              </div>
              <div className={messageClasses} id="success-message"
              style={successStyle}
              >
                Your settings have been updated!
                <button onClick = {handleDismissSuccess}
                  type="button"
                  className="close"
                  style = {{
                    position: 'absolute',
                    top: '0',
                    right: '5px',
                    fontSize: '16px',
                    }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
