import React, { useState, createContext, Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import SiteNavBar from './components/SiteNavBar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Home from './components/Home'
import Questions from './components/Questions'
import Question from './components/Question'

function App() {
  const [filterQuestions, setFilterQuestions] = useState([])

  return (
    <>
      <div>
        <BrowserRouter>
          <SiteNavBar
            filterQuestions={filterQuestions}
            setFilterQuestions={setFilterQuestions}
          />
          <div className='container main'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='register' element={<Register />} />
              <Route path='login' element={<Login />} />
              <Route
                path='questions/:searchTerm'
                element={<Questions filterQuestions={filterQuestions} />}
              />
              {/* 
              <Route path='questions/:questionId' element={<Question />} />
              {/* <Route path='profile' element={<Profile />} /> */}
            </Routes>
          </div>
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
