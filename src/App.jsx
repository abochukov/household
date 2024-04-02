import { useEffect, useState } from 'react'
import React from 'react'
import './App.css'
import './components/sidebar/sidebar'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Sidebar from './components/sidebar/sidebar';
import Header from './components/header/header';

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
    </div>
    </>
  )
}

export default App
