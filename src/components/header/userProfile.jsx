import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './header.scss';
import * as userService from '../../services/userService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (username) {
        userService.getUser(username)
            .then((data) => {
                setUser(data);
                setLoading(false); 
            },
            (error) => {
              console.error('Error:', error);
              toast("Възникна проблем със сървъра! Моля, опитайте по-късно!");
              setLoading(false);
              setError("Грешка при зареждане на профила.");
            });
    } else {
        toast("Не сте влезли в системата!");
        setLoading(false);
        setError("Не сте влезли в системата.");
    }
}, []);
  

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div>Зареждане...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="user-profile-box">
      <h2>Профил</h2>
      <p><b>Потребител:</b> {user[0].username}</p>
      {user[0].firstname && <p><b>Име:</b> {user[0].firstname}</p>}
      {user[0].lastname && <p><b>Фамилия:</b> {user[0].lastname}</p>}
      {user[0].email && <p><b>Email:</b> {user[0].email}</p>}
      {user[0].phone && <p><b>Телефон:</b> {user[0].phone}</p>}
      {user[0].role && <p><b>Роля:</b> {user[0].role}</p>}
      <button className="custom-btn-danger" onClick={handleLogout}>Изход</button>
    </div>
  );
};

export default UserProfile;
