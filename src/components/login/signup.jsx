import React, { useState } from 'react';
import axios from 'axios';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // Handle signup logic, like sending a POST request to the backend.
    console.log({ username, email, password, firstname, lastname, phone });

    try {
        const response = await axios.post('http://localhost:3001/signup', { username, password, email, firstname, lastname, phone });
        console.log(response)
        // localStorage.setItem('token', response.data.token); 
        // setIsAuthenticated(true); 
        // navigate('/manage');
      } catch (err) {
        setError('Invalid credentials');
      }
    
  };

  return (
    <div className='signup-wrapper'>
      <div className='signup-container'>
        <h2>Форма за регистрация</h2>
        <div className='form-container'>
          <form onSubmit={handleSignup}>
            <div className='username'>
              <label>Username:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className='email'>
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className='password'>
              <label>Password:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className='firstname'>
              <label>Име:</label>
              <input 
                type="firstname" 
                value={firstname} 
                onChange={(e) => setFirstname(e.target.value)} 
              />
            </div>
            <div className='lastname'>
              <label>Фамилия:</label>
              <input 
                type="lastname" 
                value={lastname} 
                onChange={(e) => setLastname(e.target.value)} 
              />
            </div>
            <div className='phone'>
              <label>Телефон:</label>
              <input 
                type="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>
            <button type="submit">Регистрация</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Signup;
