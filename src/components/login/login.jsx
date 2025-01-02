import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './login.scss';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      setIsAuthenticated(true); 
      navigate('/manage');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div>
          <h2>Login</h2>
        </div>
        <div className='form-container'>
          <form onSubmit={handleLogin}>
            <div className='username'>
              <label>Потребителско име:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className='password'>
              <label>Парола:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            {error && <p>{error}</p>}
            <button type="submit">Влизане</button>
          </form>

        </div>

        <div>
          <p>
            Don't have an account? <a href="/signup">Register here</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
