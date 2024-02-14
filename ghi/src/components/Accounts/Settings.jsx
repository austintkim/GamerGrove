import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

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
}
function Settings() {
  const navigate = useNavigate();

  const [icons, setIcons] = useState([]);
  const [username, setUsername] = useState('');
  const [accountData, setAccountData] = useState('')

  const fetchAccount = async (user) => {
  if (user!== undefined) {
    const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${user}`;
    const response = await fetch(accountUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
      }
  }
};

  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    icon_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const username = await fetchUserName();
      setUsername(username);
      const account = await fetchAccount(username);
      setAccountData(account);
      if (account) {
        setAccountFormData({
          username: account.username || '',
          password: '',
          first_name: account.first_name || '',
          last_name: account.last_name || '',
          email: account.email || '',
          icon_id: account.icon_id || ''
        });
      }
    };
    fetchData();

  }, []);




  const [updatedAccount, setUpdatedAccount] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const fetchData = async () => {
    const url = `${import.meta.env.VITE_API_HOST}/api/icons`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      setIcons(data);
    } else {
      throw new Error('Failed to retrieve icons data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    setAccountFormData({
      ...accountFormData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  let warningClasses = 'alert alert-warning d-none mb-0';
  if (passwordMismatch) {
    warningClasses = 'alert alert-warning mb-0';
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordConfirm === accountFormData.password) {
      const updateUrl = `${import.meta.env.VITE_API_HOST}/api/accounts/${accountData.id}/${username}`;

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

        document.getElementById('password-confirm').value = '';


      } else {
        throw new Error('Failed to update account settings');
      }
    } else {
      setPasswordMismatch(true);
      throw new Error('Passwords did not match up');
    }
  };

  let messageClasses = 'alert alert-success d-none mb-0';
  if (updatedAccount) {
    messageClasses = 'alert alert-success mb-0';
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
                <h4 className="card-header">Account Settings</h4>
                <div className={warningClasses} id="warning-message">
                  Your passwords do not match!
                </div>
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
                        {icons.map((icon) => (
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
                        {icons.map((icon, index) => (
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
                  <div className="mb-3">
                    <button>Update</button>
                  </div>
                  <div className="mb-3">
                    <button style={{ backgroundColor: 'red' }} type="button" onClick={() => {
                      navigate(`/settings/delete/${accountData.id}/${accountData.username}`)
                    }}>Delete Account</button>
                  </div>
                </form>
              </div>
              <div className={messageClasses} id="success-message">
                Your settings have been updated!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
