import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';


function Settings( {iconData, userData, onSettingsUpdate} ) {
  const navigate = useNavigate();
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    new_password: '',
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
          new_password: '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          icon_id: userData.icon_id || ''
        });
      }
    }, [userData]);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordMismatch, setNewPasswordMismatch] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [updatedAccount, setUpdatedAccount] = useState(false);


  const handleFormChange = (e) => {
    setAccountFormData({
      ...accountFormData,
      [e.target.name]: e.target.value,
    });
  };

  const newPasswordConfirmChange = (e) => {
    setNewPasswordConfirm(e.target.value);
  };

  const passwordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordConfirm !== accountFormData.password && newPasswordConfirm !== accountFormData.new_password) {
    setPasswordMismatch(true);
    setNewPasswordMismatch(true);
    throw new Error('Both old and new passwords do not match!')
}

const loginUrl = `${import.meta.env.VITE_API_HOST}/token`;
const form = new FormData();
form.append("username", userData.username);
form.append("password", accountFormData.password);
const loginConfig = {
    method: 'post',
    body: form
}

const loginResponse = await fetch(loginUrl, loginConfig);

if (!loginResponse.ok && newPasswordConfirm !== accountFormData.new_password) {
    setIncorrectLogin(true);
    setNewPasswordMismatch(true);
    throw new Error('New passwords do not match and old password invalid!')
}

if (passwordConfirm !== accountFormData.password) {
    setPasswordMismatch(true);
    throw new Error('Passwords do not match!')
}

if (!loginResponse.ok) {
    setIncorrectLogin(true);
    throw new Error('Invalid password!')
}


if (newPasswordConfirm !== accountFormData.new_password) {
    setNewPasswordMismatch(true);
    throw new Error('New passwords do not match!')
}

if (accountFormData.new_password && newPasswordConfirm) {
    const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${userData.id}/${userData.username}`;

    accountFormData.password = accountFormData.new_password
    delete accountFormData.new_password

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
        setPasswordConfirm('');
        setNewPasswordConfirm('');

        accountFormData.password = '';
        accountFormData.new_password = '';
        setAccountFormData(accountFormData);

        setShowPasswordFields(false);
        setUpdatedAccount(true);
        onSettingsUpdate();
    } else {
        throw new Error('Failed to update account settings');
    }
} else {
    const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${userData.id}/${userData.username}`;

    delete accountFormData.new_password;

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
        accountFormData.new_password = '';
        setAccountFormData(accountFormData);
        setPasswordConfirm('');
        setNewPasswordConfirm('');
        setUpdatedAccount(true);
        onSettingsUpdate();
    } else {
        throw new Error('Failed to update account settings');
    }
}
  }


  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
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

  const handleDismissPassWarning = () => {
    const alertElement = document.getElementById('warning-message-pass');
    alertElement.style.opacity = '0';
    setTimeout(() => setPasswordMismatch(false), 300);
  };

  const handleDismissNewPassWarning = () => {
    const alertElement = document.getElementById('warning-message-newpass');
    alertElement.style.opacity = '0';
    setTimeout(() => setNewPasswordMismatch(false), 300);
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

  const newAlertStyle = {
    display: newPasswordMismatch ? 'inline-block' : 'none',
    maxWidth: '250px',
    margin: '0 auto',
    padding: '10px',
    color: 'black',
    border: '1px solid #ffeeba',
    borderRadius: '4px',
    position: 'relative',
    whiteSpace: 'nowrap',
    opacity: newPasswordMismatch ? '1' : '0',
    transition: 'opacity 0.3s ease',
  }

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

  let warningNewClasses = 'alert alert-warning d-none mb-0';
  if (newPasswordMismatch) {
    warningNewClasses = 'alert alert-warning mb-0 d-flex justify-content-between align-items-center';
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
                  <div className="form-group">
                    <div className="d-flex justify-content-center">
                      <button type="button" onClick={togglePasswordFields}>
                        {showPasswordFields ? 'Never mind!' : 'I want to change my password!'}
                      </button>
                    </div>
                    {showPasswordFields && (
                      <>
                        <div className="form-floating mb-3">
                          <label htmlFor="new-password">New Password</label>
                          <input
                            onChange={handleFormChange}
                            required
                            type="password"
                            name="new_password"
                            id="new-password"
                            className="form-control"
                            value={accountFormData.new_password}
                          />
                        </div>
                        <div className="form-floating mb-3">
                          <label htmlFor="new-password-confirm">New Password Confirmation</label>
                          <input
                            onChange={newPasswordConfirmChange}
                            required
                            type="password"
                            name="newPasswordConfirm"
                            id="new-password-confirm"
                            className="form-control"
                            value={newPasswordConfirm}
                          />
                        </div>
                  <div
                    className={warningNewClasses}
                    id="warning-message-newpass"
                    style={newAlertStyle}
                  >
                    Your passwords do not match!
                    <button
                      onClick={handleDismissNewPassWarning}
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

                      </>
                    )}
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
                      className="form-control"
                      value={accountFormData.password}
                      style={{ marginBottom: '15px' }}
                    />
                    <small className="form-text text-muted">
                      Enter original password to either change it or confirm other profile settings updates
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
                      value = {passwordConfirm}
                      style={{ marginBottom: '15px' }}
                    />
                  </div>
                  <div
                    className={warningClasses}
                    id="warning-message-pass"
                    style={alertStyle}
                  >
                    Your passwords do not match!
                    <button
                      onClick={handleDismissPassWarning}
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
