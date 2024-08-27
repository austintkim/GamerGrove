import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

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
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

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

  const handleFormChange = (e) => {
    setAccountFormData({
      ...accountFormData,
      [e.target.name]: e.target.value
    })
  }

  const passwordConfirmChange = (e) => {
    setPasswordConfirm(
      e.target.value
    )
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
        throw new Error('Failed to create account')
      }
    }
    else {
      setPasswordMismatch(true);
      throw new Error('Passwords did not match up')
    }
  }

  const handleDismiss = () => {
    const alertElement = document.getElementById('warning-message');
    alertElement.style.opacity = '0';
    setTimeout(() => setPasswordMismatch(false), 300);
  };

  const alertStyle = {
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
        onClick={() => { navigate("/"); }}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          margin: '10px',
        }}
      >
        Back to Homepage
      </button>
      <div style={{ ...centerVertically, width: '100%' }}>
        <div className="card text-bg-light mb-3">
          <div className="container">
            <div className="row" style={{ backgroundColor: 'transparent', paddingLeft: '11%', marginLeft: '0%', marginRight: '7%' }}>
              <div className="offset-2 col-8">
                <h2 className="card-header" style={{ textAlign: 'center'}}>Create account</h2>
                <div style={{ width: '100%'}}>
                  <form onSubmit={handleSubmit} id="create-account">
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="username">Username</label>
                      <input onChange={handleFormChange} required type="text" name="username" id="username" className="form-control" value={accountFormData.username} />
                    </div>
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="password">Password</label>
                      <input onChange={handleFormChange} required type="password" name="password" id="password" autoComplete="new-password" className="form-control" value={accountFormData.password} style={{ marginBottom: '15px' }} />
                    </div>
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="password">Password Confirmation</label>
                      <input onChange={passwordConfirmChange} required type="password" name="password-confirm" id="password-confirm" className="form-control" style={{ marginBottom: '15px' }} />
                    </div>
                <div className="alert alert-warning mb-0" id="warning-message" style={alertStyle}>
                  Your passwords do not match!
                  <button onClick = {handleDismiss}
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
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="first_name">First name</label>
                      <input onChange={handleFormChange} required type="text" name="first_name" id="first_name" className="form-control" value={accountFormData.first_name} />
                    </div>
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="last_name">Last name</label>
                      <input onChange={handleFormChange} required type="text" name="last_name" id="last_name" className="form-control" value={accountFormData.last_name} />
                    </div>
                    <div className="form-floating mb-3" style={{ textAlign: 'center'}}>
                      <label htmlFor="email">Email</label>
                      <input onChange={handleFormChange} required type="email" name="email" id="email" className="form-control" value={accountFormData.email} />
                    </div>
                    <div className="text-center">
                      <div className="col-12 mb-3 d-flex justify-content-center align-items-center">
                        <select onChange={handleFormChange} required name="icon_id" id="icon_id" className="form-select" value={accountFormData.icon_id}>
                          <option value="">Choose your icon</option>
                          {icons.map(icon => (
                            <option key={icon.id} value={icon.id} style={{ textAlign: 'center', flexWrap: 'wrap'  }}>
                              {icon.name}
                            </option>
                          ))}
                        </select>
                      </div>
                <div style={{ backgroundColor: 'transparent', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {icons.map((icon, index) => (
                      <div
                        key={icon.id}
                        className="text-center"
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
                  <br />


                    </div>
                    <div className="mb-3" style={{ textAlign: 'center'}}>
                    <button >Create</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
