import { useEffect, useState } from 'react'
import React from 'react'
import './App.css'
import './components/sidebar/sidebar'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';
import {Routes, Route} from 'react-router-dom';

import Manage from './components/manage/manage';
import Events from './components/events/events';
import Emergency from './components/emergency/emergency';
import Checkout from './components/checkout/checkout';
import Profile from './components/profile/profile';
import Home from './components/home/home';

import Sticky from 'react-stickynode';



function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api")
    .then((res) => res.json())
    .then((data) => setData(data.message))
  }, [])

  


  return (
    <>
    <div className='wrapper'>
      <div className='header'>
        <Header />
      </div>
      <Sticky>
        <Sidebar/>
      </Sticky>
      <div className='container-wrapper'>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
    </>
  )
}

export default App
