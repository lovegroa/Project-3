import React, { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SiteNavBar from './components/SiteNavBar'
import Home from './components/Home'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <SiteNavBar />
          <div className='container main'>
            <Routes>
              <Route path='/' element={<Home />} />
              {/* <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='questions' element={<Questions />} />
              <Route path='questions/:questionId' element={<Question />} />
              <Route path='profile' element={<Profile />} /> */}
            </Routes>
          </div>
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
