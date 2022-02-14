import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { userAuthenticated } from './utils/userAuthenticated'
import logo from '../images/best.png'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

const SiteNavBar = ({ filterQuestions, setFilterQuestions }) => {
  const [questions, setQuestions] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [randomQ, setRandomQ] = useState('')

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const { data } = await axios.get('/api/questions/')
        setQuestions(data)
      } catch (error) {
        console.log(error)
      }
    }
    getQuestions()
  }, [])

  const navigate = useNavigate()

  const url = window.location.href.split('/') // get page location
  const page = url[url.length - 1]

  const handleLogOut = () => {
    localStorage.removeItem('whats-the-best-token')
    navigate('/')
  }

  const searchQuery = (e) => {
    // returns the string of the search query
    console.log(e.target.value.toLowerCase())
    setSearchValue(e.target.value.toLowerCase())
  }

  useEffect(() => {
    // applyFilters
    if (questions.length) {
      const filtersToApply = questions.filter((item) => {
        return item.questionText.toLowerCase().includes(searchValue)
      })
      setFilterQuestions(filtersToApply)
    }
  }, [questions, searchValue])

  useEffect(() => {
    // generate randomQuestion
    if (questions.length) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)].questionText
      setRandomQ(randomQuestion)
    }
  }, [questions])

  const handleKeyPress = (e) => {
    // when enter is pressed jump to questions page
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    searchValue && navigate(`/questions/${searchValue}`)
    clearSearch()
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  return (
    <Navbar bg='dark' variant='dark' expand='md'>
      <Container>
        <Navbar.Brand className='justify-content-start'>
          <img
            className='navbar-image'
            src={logo}
            alt={`what's the best`}
            width='50'
            height='50'
          />
          <Link className='links' to='/'>
            What&#39;s the best...
          </Link>
        </Navbar.Brand>
        <Nav.Item className='search-container col-4 me-auto'>
          <Form className='dropdown-content col-4' onSubmit={handleSubmit}>
            <Form.Control
              type='text'
              placeholder={`${randomQ}?`}
              onChange={searchQuery}
              onKeyPress={handleKeyPress}
              value={searchValue}
            />

            {filterQuestions &&
              searchValue &&
              filterQuestions.map((question) => {
                const { _id, questionText } = question

                return (
                  <Link
                    className='links search-results'
                    key={_id}
                    to={`/question/${_id}`}
                    onClick={clearSearch}
                  >
                    {questionText}
                  </Link>
                )
              })}
          </Form>
        </Nav.Item>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse className='justify-content-end'>
          <Nav className='me'>
            {userAuthenticated() ? (
              <Nav.Item onClick={handleLogOut}>
                <Link className='links' to='logout'>
                  Logout
                </Link>
              </Nav.Item>
            ) : (
              <>
                {page === 'login' ? (
                  <Nav.Item>
                    <Link className='links' to='register'>
                      Register
                    </Link>
                  </Nav.Item>
                ) : (
                  <Nav.Item>
                    <Link className='links' to='login'>
                      Login
                    </Link>
                  </Nav.Item>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default SiteNavBar
