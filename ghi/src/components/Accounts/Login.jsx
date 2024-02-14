import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import Hero from "./Hero";

import './Hero.css'


const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const { login } = useToken();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = `${import.meta.env.VITE_API_HOST}/token`;
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    const loginConfig = {
      method: 'post',
      body: form
    }

    const response = await fetch(loginUrl, loginConfig);
    if (response.ok) {
      login(username, password)
      navigate('/login/welcomeback');
    } else {
      setIncorrectLogin(true);
    }

  };

  let messageClasses = 'alert alert-danger d-none mb-0';
  if (incorrectLogin) {
    messageClasses = 'alert alert-danger mb-0';
  }

  return (
    <div style={{ position: 'relative' }}>

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
      <div>
        <Hero />
    <div style={containerStyle}>

    <div className="card text-bg-light mb-3">
      <div className="offset-3 col-6">
      <h5 className="card-header">Login</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              name="username"
              type="text"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input style={{ marginBottom: '15px' }} type="submit" value="Login" />
          </div>
          <div className={messageClasses} id="failure-message">
            Incorrect username or password...
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
  </div>
  </div>
  );
};

export default LoginForm;
