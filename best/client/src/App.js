import React, { useState, createContext, Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SiteNavBar from './components/SiteNavBar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Home from './components/Home'
import Questions from './components/Questions'
import Question from './components/Question'
import AddQuestion from './components/AddQuestion'
import Profile from './components/Profile'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <SiteNavBar />
          {/* <div className='container main'> */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='questions/:searchTerm' element={<Questions />} />
            <Route path='questions/add' element={<AddQuestion />} />
            <Route path='question/:questionId' element={<Question />} />
            <Route path='profile' element={<Profile />} />
          </Routes>
          {/* </div> */}
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
