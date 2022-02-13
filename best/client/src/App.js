import React, { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SiteNavBar from './components/SiteNavBar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Home from './components/Home'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <SiteNavBar />
          <Container>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='register' element={<Register />} />
              <Route path='login' element={<Login />} />
              {/* 
              
              <Route path='questions' element={<Questions />} />
              <Route path='questions/:questionId' element={<Question />} />
              <Route path='profile' element={<Profile />} /> */}
            </Routes>
          </Container>
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
