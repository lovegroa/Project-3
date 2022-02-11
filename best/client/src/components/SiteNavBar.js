import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import { userIsAuthenticated } from '../helpers/auth'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import axios from 'axios'


const SiteNavBar = () => {
  
  const [ questions, setQuestions ] = useState([])
  const [ searchValue, setSearchValue ] = useState([])
  const [ filterQuestions, setFilterQuestions ] = useState([])
  const [ randomQ, setRandomQ ] = useState('')

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios.get('/api/questions/')
        setQuestions(data)
      } catch (error) {
        
      }
  
    }
    getQuestions()
  }, [])
  
  
  const navigate = useNavigate()
  
  // const url = window.location.href
  // console.log(url)
  
  // const location = url.split('/')
  // console.log(location)
  // console.log(location[location.length - 1])

  const loggedIn = true
  
  const handleLogOut = () => {
    localStorage.removeItem('winebored-token')
    navigate('/')
  }

  const searchQuery = (e) => { // returns the string of the search query
    console.log(e.target.value.toLowerCase())
    setSearchValue(e.target.value.toLowerCase())
  }
  
  useEffect(() => { // applyFilters
    if (questions.length) {
      const filtersToApply = questions.filter(item => {
        return (
          item.questionText.toLowerCase().includes(searchValue) 
        )
      })
      setFilterQuestions(filtersToApply)
    }
  }, [questions, searchValue])

  useEffect(() => { // generate randomQuestion
    if (questions.length) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)].questionText
      setRandomQ(randomQuestion)
    }
  }, [questions])

  // if on login page then register page
  // if on register page then login page
  // if logged in log out
  

  const handleKeyPress = (e) => { // when enter is pressed jump to relevant question
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  




  return (
    
    <Navbar bg='dark' variant='dark' expand='md'>
      <Container>
          <Navbar.Brand className='justify-content-start'>
            <Link to='/'>What's the best:</Link>
          </Navbar.Brand>
          <Nav.Item className='col-6 justify-content-md-start me-auto'>
            <Form>
              <Form.Control type='text' placeholder={`${randomQ}?`} onChange={searchQuery} onKeyPress={handleKeyPress}/>
            </Form>
          </Nav.Item>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse className='justify-content-end'>
            <Nav className='me'>
            
          
          
        
        
        
      

          
            {/* {loggedIn && location[location.length - 1] !== 'wines' && (
              <Nav.Item>
                <Link to='wines'>Wine List</Link>
              </Nav.Item>
            )} */}
            {loggedIn ? 
              
            <Nav.Item onClick={handleLogOut}>
              <Link to='logout'>Logout</Link>
            </Nav.Item>
            :
            <>
              <Nav.Item>
                <Link to='register'>Register</Link>
              </Nav.Item>
              <Nav.Item>
                <Link to='login'>Login</Link>
              </Nav.Item>
            </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default SiteNavBar
