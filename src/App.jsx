import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import './components/sidebar/sidebar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';
import { Routes, Route } from 'react-router-dom';

import Manage from './components/manage/manage';
import Events from './components/events/events';
import Emergency from './components/emergency/emergency';
import Checkout from './components/checkout/checkout';
import Profile from './components/profile/profile';
import Home from './components/home/home';
import ApartamentDetails from './components/manage/apartamentDetails';
import CreateProperty from './components/manage/createProperty';
import NotFound from './components/notfound/NotFound';
import Login from './components/login/login';
import PrivateRoute from './components/PrivateRoute';

import Sticky from 'react-stickynode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // If token exists, user is authenticated
    }
  }, []); // The effect runs only once after the initial render

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path='/' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        </Routes>
      ) : (
        <div className='wrapper'>
          <div className='header'>
            <Header />
          </div>
          <Sticky>
            <Sidebar />
          </Sticky>
          <div className='container-wrapper'>
            <Routes>
              <PrivateRoute path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/apartament/:id" element={<ApartamentDetails />} />
              <Route path="/createProperty" element={<CreateProperty />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
