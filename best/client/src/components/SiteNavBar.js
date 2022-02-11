import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import { userIsAuthenticated } from '../helpers/auth'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Form } from 'react-bootstrap'
// import { Button } from 'react-bootstrap'

const SiteNavBar = () => {
  const url = window.location.href
  const location = url.split('/')
  //use useLocation instead!
  console.log(location[location.length - 1])

  const loggedIn = true
  const navigate = useNavigate()

  const logOut = () => {
    localStorage.removeItem('winebored-token')
    navigate('/')
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand>What is the best:</Navbar.Brand>
        <Form>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Control type='text' placeholder='random word' />
          </Form.Group>
        </Form>

        <Nav className='me'>
          {loggedIn && location[location.length - 1] !== 'wines' && (
            <Nav.Item>
              <Link to='wines'>Wine List</Link>
            </Nav.Item>
          )}

          {location[location.length - 1] === 'login' ? (
            <Link to='register'>
              <Nav.Item>Register</Nav.Item>
            </Link>
          ) : loggedIn ? (
            <Nav.Item onClick={logOut}>
              <Link to='logout'>Logout</Link>
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Link to='login'>Login</Link>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default SiteNavBar
