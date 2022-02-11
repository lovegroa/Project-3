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

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios.get('/api/questions/')
        console.log(data)
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

  // applyFilters
  useEffect(() => {
    if (questions) {
      const filtersToApply = questions.filter(item => {
        return (
          item.questionText.toLowerCase().includes(searchValue) 
        )
      })
      setFilterQuestions(filtersToApply)
    }
  }, [questions, searchValue])


  

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
            <Navbar.Brand>
              <Link to='/'>What is the best:</Link>
            </Navbar.Brand>
            <Form>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Control type='text' placeholder='random word' onChange={searchQuery} onKeyPress={handleKeyPress}/>
              </Form.Group>
            </Form>
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
