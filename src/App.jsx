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
import Signup from './components/login/signup';
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
    <div className='wrapper'>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />  
      </Routes>

      <div className='header'>
        <PrivateRoute><Header /></PrivateRoute>
      </div>
      <Sticky>
        <PrivateRoute><Sidebar /></PrivateRoute>
      </Sticky>
      <div className='container-wrapper'>
        <Routes>
          <Route path="/home" element={<PrivateRoute> <Home /></PrivateRoute>}/>
          <Route path="/manage" element={<PrivateRoute> <Manage /></PrivateRoute>}/>
          <Route path="/events" element={<PrivateRoute> <Events /></PrivateRoute>}/>
          <Route path="/emergency" element={<PrivateRoute> <Emergency /></PrivateRoute>}/>
          <Route path="/checkout" element={<PrivateRoute> <Checkout /></PrivateRoute>}/>
          <Route path="/profile" element={<PrivateRoute> <Profile /></PrivateRoute>}/>
          <Route path="/apartament/:id" element={<PrivateRoute> <ApartamentDetails /></PrivateRoute>}/>
          <Route path="/createProperty" element={<PrivateRoute> <CreateProperty /></PrivateRoute>}/>
        </Routes>
      </div>  
    </div>
  );
}

export default App;
