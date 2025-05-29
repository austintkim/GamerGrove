import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import controller from '../../assets/controller.gif'
import liquidslime from '../../assets/liquidslime.gif'

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

const initialAccountData = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  icon_id: ""
}

function SignUpForm() {
  const navigate = useNavigate();

  const [icons, setIcons] = useState([]);
  const [accountFormData, setAccountFormData] = useState(initialAccountData);
  const [usernameTaken, setUserNameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordScore, setPasswordScore] = useState(null);
  const { login } = useToken();

  const fetchData = async () => {
    const url = `${import.meta.env.VITE_API_HOST}/api/icons`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      setIcons(data);
    } else {
      throw new Error('Failed to retrieve icons data')
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const checkPasswordStrength = (password) => {
      let score = 0

      if (password.length >= 8 && (/[A-Z]/.test(password))) score++
      if (password.length >= 8 && (/[a-z]/.test(password))) score++
      if (password.length >= 8 && /[0-9]/.test(password)) score++
      if (password.length >= 8 && /[^A-Za-z0-9]/.test(password)) score++

      setPasswordScore(score)
  }


  const handleFormChange = (e) => {
      const { name, value } = e.target

      setAccountFormData({
          ...accountFormData,
          [name]: value,
      })

      if (!accountFormData.password) {
        setShowPassword(false)
      }

      if (name === 'password') {
          checkPasswordStrength(value)
      }
  }


  const passwordConfirmChange = (e) => {
    setPasswordConfirm(
      e.target.value
    )
    if (!passwordConfirm) {
        setShowConfirmPassword(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordConfirm === accountFormData.password) {
      const accountUrl = `${import.meta.env.VITE_API_HOST}/api/accounts`

      const accountFetchConfig = {
        method: "post",
        body: JSON.stringify(accountFormData),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const account_response = await fetch(accountUrl, accountFetchConfig);
      if (account_response.ok) {
        login(accountFormData.username, accountFormData.password);
        setAccountFormData(initialAccountData);
        setPasswordConfirm('');

        document.getElementById('password-confirm').value = ''
        navigate("/signup/welcome");
      } else {
        const data = await account_response.json()
        if (data.detail.includes('username') && data.detail.includes('email')) {
          setUserNameTaken(true);
          setEmailTaken(true);
          throw new Error('Failed to create account - both username and email are taken');
        }
        else if (data.detail.includes('username')) {
          setUserNameTaken(true);
          throw new Error('Failed to create account - username is taken');
        }
        else if (data.detail.includes('email')) {
          setEmailTaken(true);
          throw new Error('Failed to create account - email is taken');
        }
      }
    } else {
      setPasswordMismatch(true);
      throw new Error('Passwords did not match up')
    }
  }

  const handleDismissUsername = () => {
    const alertElement = document.getElementById('warning-message-username');
    alertElement.style.opacity = '0';
    setTimeout(() => setUserNameTaken(false), 300);
  };

  const alertStyleUsername = {
    display: usernameTaken ? 'flex' : 'none',
    maxWidth: '280px',
    padding: '5px 15px',
    whiteSpace: 'nowrap',
    opacity: usernameTaken ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

  const handleDismissEmail = () => {
    const alertElement = document.getElementById('warning-message-email');
    alertElement.style.opacity = '0';
    setTimeout(() => setEmailTaken(false), 300);
  };

  const alertStyleEmail = {
    display: emailTaken ? 'flex' : 'none',
    maxWidth: '280px',
    padding: '5px 15px',
    whiteSpace: 'nowrap',
    opacity: emailTaken ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

  const handleDismissPassword = () => {
    const alertElement = document.getElementById('warning-message-password');
    alertElement.style.opacity = '0';
    setTimeout(() => setPasswordMismatch(false), 300);
  };

  const alertStylePassword = {
    display: passwordMismatch ? 'flex' : 'none',
    maxWidth: '280px',
    padding: '5px 15px',
    whiteSpace: 'nowrap',
    opacity: passwordMismatch ? '1' : '0',
    transition: 'opacity 0.3s ease',
  };

  return (
      <div style={{ position: 'relative', ...containerStyle }}>
          <button
              onClick={() => {
                  navigate('/')
              }}
              style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  margin: '10px',
              }}
          >
              Home Page!
          </button>
          <button
              onClick={() => {
                  navigate('/login')
              }}
              style={{
                  position: 'absolute',
                  top: '40px',
                  left: '0',
                  margin: '10px',
              }}
          >
              Login!
          </button>
          <div>
              <img
                  src={liquidslime}
                  alt=""
                  style={{
                      position: 'fixed',
                      bottom: '50%',
                      left: '25%',
                      transform: 'translate(-50%, -50%)',
                      width: '250px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      padding: '16px',
                      zIndex: 3,
                  }}
              />
              <img
                  src={controller}
                  alt=""
                  style={{
                      position: 'fixed',
                      bottom: '50%',
                      left: '75%',
                      transform: 'translate(-50%, -50%)',
                      width: '250px',
                      objectFit: 'contain',
                      cursor: 'pointer',
                      padding: '16px',
                      zIndex: 3,
                  }}
              />
          </div>
          <div style={{ ...centerVertically, width: '100%' }}>
              <div className="card text-bg-light mb-3">
                  <div className="container">
                      <div
                          className="row"
                          style={{
                              backgroundColor: 'transparent',
                              paddingLeft: '11%',
                              marginLeft: '0%',
                              marginRight: '7%',
                          }}
                      >
                          <div className="offset-2 col-8">
                              <h2
                                  className="card-header"
                                  style={{ textAlign: 'center' }}
                              >
                                  Create account
                              </h2>
                              <div style={{ width: '100%' }}>
                                  <form
                                      onSubmit={handleSubmit}
                                      id="create-account"
                                  >
                                      <div
                                          className="form-floating mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <label htmlFor="username">
                                              Username
                                          </label>
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
                                      <div
                                          className="alert alert-warning mb-0"
                                          id="warning-message-username"
                                          style={alertStyleUsername}
                                      >
                                          That username is already taken!
                                          <button
                                              onClick={handleDismissUsername}
                                              type="button"
                                              className="close"
                                              style={{
                                                  position: 'absolute',
                                                  top: '0',
                                                  right: '5px',
                                                  fontSize: '16px',
                                              }}
                                          >
                                              <span aria-hidden="true">
                                                  &times;
                                              </span>
                                          </button>
                                      </div>
                                      <div
                                          className="form-floating mb-3"
                                          style={{
                                              textAlign: 'center',
                                              marginTop: '8px',
                                          }}
                                      >
                                          <label htmlFor="password">
                                              Password
                                          </label>
                                          <div style={{ position: 'relative' }}>
                                              <input
                                                  onChange={handleFormChange}
                                                  required
                                                  type={
                                                      !showPassword ||
                                                      !accountFormData.password
                                                          ? 'password'
                                                          : 'text'
                                                  }
                                                  name="password"
                                                  id="password"
                                                  className="form-control"
                                                  value={
                                                      accountFormData.password
                                                  }
                                                  style={{
                                                      marginBottom: '15px',
                                                      paddingRight: '40px',
                                                  }}
                                              />
                                              <button
                                                  type="button"
                                                  disabled={
                                                      !accountFormData.password
                                                  }
                                                  onClick={
                                                      togglePasswordVisibility
                                                  }
                                                  style={{
                                                      position: 'absolute',
                                                      right: '10px',
                                                      top: '50%',
                                                      transform:
                                                          'translateY(-50%)',
                                                      background: 'none',
                                                      border: 'none',
                                                      cursor: 'pointer',
                                                  }}
                                              >
                                                  {!showPassword ||
                                                  !accountFormData.password
                                                      ? '👁️'
                                                      : '👁️‍🗨️'}
                                              </button>
                                          </div>
                                          {accountFormData.password &&
                                              accountFormData.password.length <
                                                  8 && (
                                                  <p style={{ color: 'Red' }}>
                                                      Password Invalid
                                                  </p>
                                              )}

                                          {accountFormData.password &&
                                              accountFormData.password.length >=
                                                  8 && (
                                                  <p style={{ color: 'white' }}>
                                                      Password Strength:{' '}
                                                      <span
                                                          style={{
                                                              color:
                                                                  passwordScore <
                                                                  3
                                                                      ? 'orange'
                                                                      : passwordScore ===
                                                                        3
                                                                      ? 'yellow'
                                                                      : passwordScore ===
                                                                        4
                                                                      ? 'green'
                                                                      : 'white',
                                                          }}
                                                      >
                                                          {passwordScore < 3
                                                              ? 'Weak'
                                                              : passwordScore ===
                                                                3
                                                              ? 'Moderate'
                                                              : passwordScore ===
                                                                4
                                                              ? 'Strong'
                                                              : ''}
                                                      </span>
                                                  </p>
                                              )}
                                          <div
                                              style={{
                                                  position: 'relative',
                                                  display: 'inline-block',
                                              }}
                                          >
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      setShowPasswordHint(
                                                          !showPasswordHint
                                                      )
                                                  }
                                                  style={{
                                                      background: 'none',
                                                      border: 'none',
                                                      color: 'white',
                                                      textDecoration:
                                                          'underline',
                                                      cursor: 'pointer',
                                                      padding: 0,
                                                      fontSize: 'inherit',
                                                  }}
                                              >
                                                  Password requirements
                                              </button>
                                              {showPasswordHint && (
                                                  <div
                                                      style={{
                                                          position: 'fixed',
                                                          bottom: '100px',
                                                          right: '100px',
                                                          backgroundColor:
                                                              '#333',
                                                          color: 'white',
                                                          padding: '15px',
                                                          borderRadius: '5px',
                                                          width: '300px',
                                                          boxShadow:
                                                              '0 2px 15px rgba(0,0,0,0.3)',
                                                          zIndex: 1000,
                                                          maxHeight: '80vh',
                                                          overflowY: 'auto',
                                                      }}
                                                  >
                                                      <div
                                                          style={{
                                                              display: 'flex',
                                                              justifyContent:
                                                                  'space-between',
                                                          }}
                                                      >
                                                          <strong>
                                                              Password
                                                              Requirements:
                                                          </strong>
                                                          <button
                                                              onClick={() =>
                                                                  setShowPasswordHint(
                                                                      false
                                                                  )
                                                              }
                                                              style={{
                                                                  background:
                                                                      'none',
                                                                  border: 'none',
                                                                  color: 'white',
                                                                  cursor: 'pointer',
                                                                  padding:
                                                                      '0 0 0 10px',
                                                              }}
                                                          >
                                                              ×
                                                          </button>
                                                      </div>
                                                      <div
                                                          style={{
                                                              marginTop: '8px',
                                                          }}
                                                      >
                                                          {accountFormData
                                                              .password.length <
                                                          8 ? (
                                                              <p
                                                                  style={{
                                                                      color: 'red',
                                                                      margin: '5px 0',
                                                                  }}
                                                              >
                                                                  ❌ Password
                                                                  must be at
                                                                  least 8
                                                                  characters
                                                              </p>
                                                          ) : (
                                                              <p
                                                                  style={{
                                                                      color: 'green',
                                                                      margin: '5px 0',
                                                                  }}
                                                              >
                                                                  ✅ Minimum
                                                                  length (8
                                                                  characters)
                                                              </p>
                                                          )}

                                                          <p
                                                              style={{
                                                                  margin: '10px 0 5px 0',
                                                                  fontWeight:
                                                                      'bold',
                                                              }}
                                                          >
                                                              Must meet at least
                                                              3 of these 4
                                                              conditions:
                                                          </p>
                                                          <ul
                                                              style={{
                                                                  margin: '5px 0 0 0',
                                                                  paddingLeft:
                                                                      '20px',
                                                              }}
                                                          >
                                                              <li
                                                                  style={{
                                                                      color: /[a-z]/.test(
                                                                          accountFormData.password
                                                                      )
                                                                          ? 'green'
                                                                          : 'inherit',
                                                                  }}
                                                              >
                                                                  {/[a-z]/.test(
                                                                      accountFormData.password
                                                                  )
                                                                      ? '✅'
                                                                      : '❌'}{' '}
                                                                  Lowercase
                                                                  letter
                                                              </li>
                                                              <li
                                                                  style={{
                                                                      color: /[A-Z]/.test(
                                                                          accountFormData.password
                                                                      )
                                                                          ? 'green'
                                                                          : 'inherit',
                                                                  }}
                                                              >
                                                                  {/[A-Z]/.test(
                                                                      accountFormData.password
                                                                  )
                                                                      ? '✅'
                                                                      : '❌'}{' '}
                                                                  Uppercase
                                                                  letter
                                                              </li>
                                                              <li
                                                                  style={{
                                                                      color: /[0-9]/.test(
                                                                          accountFormData.password
                                                                      )
                                                                          ? 'green'
                                                                          : 'inherit',
                                                                  }}
                                                              >
                                                                  {/[0-9]/.test(
                                                                      accountFormData.password
                                                                  )
                                                                      ? '✅'
                                                                      : '❌'}{' '}
                                                                  Number
                                                              </li>
                                                              <li
                                                                  style={{
                                                                      color: /[^A-Za-z0-9]/.test(
                                                                          accountFormData.password
                                                                      )
                                                                          ? 'green'
                                                                          : 'inherit',
                                                                  }}
                                                              >
                                                                  {/[^A-Za-z0-9]/.test(
                                                                      accountFormData.password
                                                                  )
                                                                      ? '✅'
                                                                      : '❌'}{' '}
                                                                  Special
                                                                  character
                                                              </li>
                                                          </ul>
                                                          <p
                                                              style={{
                                                                  margin: '10px 0 0 0',
                                                                  fontStyle:
                                                                      'italic',
                                                              }}
                                                          >
                                                              <strong>
                                                                  Note:
                                                              </strong>{' '}
                                                              Strength must be
                                                              at least
                                                              &quot;Moderate&quot;
                                                              (meet 3
                                                              conditions) to be
                                                              accepted.
                                                          </p>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                      <div
                                          className="form-floating mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <label htmlFor="password">
                                              Password Confirmation
                                          </label>
                                          <div style={{ position: 'relative' }}>
                                              <input
                                                  onChange={
                                                      passwordConfirmChange
                                                  }
                                                  required
                                                  type={
                                                      !showConfirmPassword ||
                                                      !passwordConfirm
                                                          ? 'password'
                                                          : 'text'
                                                  }
                                                  name="password-confirm"
                                                  id="password-confirm"
                                                  className="form-control"
                                                  style={{
                                                      marginBottom: '15px',
                                                      paddingRight: '40px',
                                                  }}
                                              />
                                              <button
                                                  type="button"
                                                  disabled={!passwordConfirm}
                                                  onClick={
                                                      toggleConfirmPasswordVisibility
                                                  }
                                                  style={{
                                                      position: 'absolute',
                                                      right: '10px',
                                                      top: '50%',
                                                      transform:
                                                          'translateY(-50%)',
                                                      background: 'none',
                                                      border: 'none',
                                                      cursor: 'pointer',
                                                  }}
                                              >
                                                  {!showConfirmPassword ||
                                                  !passwordConfirm
                                                      ? '👁️'
                                                      : '👁️‍🗨️'}
                                              </button>
                                          </div>
                                      </div>
                                      <div
                                          className="alert alert-warning mb-0"
                                          id="warning-message-password"
                                          style={alertStylePassword}
                                      >
                                          Your passwords do not match!
                                          <button
                                              onClick={handleDismissPassword}
                                              type="button"
                                              className="close"
                                              style={{
                                                  position: 'absolute',
                                                  top: '0',
                                                  right: '5px',
                                                  fontSize: '16px',
                                              }}
                                          >
                                              <span aria-hidden="true">
                                                  &times;
                                              </span>
                                          </button>
                                      </div>
                                      <div
                                          className="form-floating mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <label htmlFor="first_name">
                                              First name
                                          </label>
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
                                      <div
                                          className="form-floating mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <label htmlFor="last_name">
                                              Last name
                                          </label>
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
                                      <div
                                          className="form-floating mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <label htmlFor="email">Email</label>
                                          <input
                                              onChange={handleFormChange}
                                              required
                                              type="email"
                                              name="email"
                                              id="email"
                                              className="form-control"
                                              value={accountFormData.email}
                                          />
                                      </div>
                                      <div
                                          className="alert alert-warning mb-0"
                                          id="warning-message-email"
                                          style={alertStyleEmail}
                                      >
                                          That email is already taken!
                                          <button
                                              onClick={handleDismissEmail}
                                              type="button"
                                              className="close"
                                              style={{
                                                  position: 'absolute',
                                                  top: '0',
                                                  right: '5px',
                                                  fontSize: '16px',
                                              }}
                                          >
                                              <span aria-hidden="true">
                                                  &times;
                                              </span>
                                          </button>
                                      </div>
                                      <div className="text-center">
                                          <div
                                              className="col-12 mb-3 d-flex justify-content-center align-items-center"
                                              style={{ marginTop: '15px' }}
                                          >
                                              <select
                                                  onChange={handleFormChange}
                                                  required
                                                  name="icon_id"
                                                  id="icon_id"
                                                  className="form-select"
                                                  value={
                                                      accountFormData.icon_id
                                                  }
                                              >
                                                  <option value="">
                                                      Choose your icon
                                                  </option>
                                                  {icons.map((icon) => (
                                                      <option
                                                          key={icon.id}
                                                          value={icon.id}
                                                          style={{
                                                              textAlign:
                                                                  'center',
                                                              flexWrap: 'wrap',
                                                          }}
                                                      >
                                                          {icon.name}
                                                      </option>
                                                  ))}
                                              </select>
                                          </div>
                                          <div
                                              style={{
                                                  backgroundColor:
                                                      'transparent',
                                                  display: 'flex',
                                                  flexWrap: 'wrap',
                                                  justifyContent: 'center',
                                              }}
                                          >
                                              {icons.map((icon, index) => (
                                                  <div
                                                      key={icon.id}
                                                      className="text-center"
                                                  >
                                                      <p>
                                                          {String.fromCharCode(
                                                              65 + index
                                                          )}
                                                      </p>
                                                      <img
                                                          src={icon.icon_url}
                                                          alt={icon.name}
                                                          width="50"
                                                          height="50"
                                                      />
                                                  </div>
                                              ))}
                                          </div>
                                          <br />
                                      </div>
                                      <div
                                          className="mb-3"
                                          style={{ textAlign: 'center' }}
                                      >
                                          <button
                                              type="submit"
                                              disabled={
                                                  accountFormData.password
                                                      .length < 8 ||
                                                  passwordScore < 3
                                              }
                                          >
                                              Create
                                          </button>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default SignUpForm;
