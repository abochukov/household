import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.scss';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Функция за логване на потребителя
  const handleLogin = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0); // Връща изгледа най-горе, ако има скрол
    document.body.style.overflow = 'hidden'; // Забранява скролването

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      setIsAuthenticated(true);
      navigate('/manage');
    } catch (err) {
      setError('Потребителското име или паролата са грешни.');
    }
  };

  // Функция за излизане (logout)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);  // Състоянието на автентикацията се сменя
    navigate('/login'); // Пренасочваме към логин страницата
  };

  // Функция за проследяване на активността
  const resetInactivityTimer = () => {
    clearTimeout(window.inactivityTimer);
    window.inactivityTimer = setTimeout(handleLogout, 300000); // 5 минути (60000 милисекунди)
  };

  // Добавяне на слушатели за събития на активност
  useEffect(() => {
    // Следене на активността на потребителя
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    // Стартиране на таймера при първоначално зареждане
    resetInactivityTimer();

    // Почистване на слушателите, когато компонентът бъде демонтиран
    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, []);

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div>
          <h2>Вход</h2>
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
            <button type="submit" className='login-button'>Влизане</button>
          </form>
        </div>

        <div className='login-footer'>
          <p>
            Все още нямаш акаунт?<br/> <a href="/signup">Регистрирай се тук</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
