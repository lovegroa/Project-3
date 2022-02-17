import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { getTokenFromLocalStorage } from './utils/userAuthenticated'
import { Link } from 'react-router-dom'

const Profile = () => {

  const [ formData, setFormData ] = useState({
    username: '', 
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const [ profileData, setProfileData ] = useState({
    createdAt: '',
    admin: false,
    ownedAnswers: [],
    ownedQuestions: [],
    ownedVotes: [],
  })
  
  const [ success, setSuccess ] = useState('')

  const [ error, setError ] = useState('')

  const [ editToggle, setEditToggle ] = useState(true)

  const parseDate = (datetime) => {
    const parsedDate = datetime.split('T')[0].split('-').reverse().join('-')
    const parsedTime = datetime.split('T')[1].split('.')[0]
    return `${parsedDate} ${parsedTime}`
  }

  // use Effect to retrieve profile information on page load
  useEffect(() => {
    const getProfile = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`
          }
        }
        const { data } = await axios.get(`/api/profile/`, headers)
        console.log(data)
        setFormData({...formData, username: data.username, email: data.email })
        setProfileData({
          ...profileData,
          username: data.username.toUpperCase(), 
          email: data.email,
          createdAt: parseDate(data.createdAt),
          admin: data.admin,
          ownedAnswers: data.ownedAnswers,
          ownedQuestions: data.ownedQuestions,
          ownedVotes: data.ownedVotes,
        })
      } catch (error) {
        console.log(error.message)
        setError(error.message)
      }
    }
    getProfile()
  }, [])

  const handleChange = (e) => {
    console.log(e.target.value)
    setFormData({ [e.target.name]: e.target.value })
    setError('')
  }

  const handleEditClick = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    setEditToggle(!editToggle)
  }

  const clearMessage = () => {
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }
      const { data } = await axios.put('/api/profile', formData, headers)
      console.log(data)
      setEditToggle(!editToggle)
      setProfileData({...profileData, ...formData })
      setSuccess('Updated successfully')
      setTimeout(clearMessage, 5000)
    } catch (error) {
      const { message } = error.response.data
      console.log(message)
      setError(message)
    }
  }

  return (
    <Container className='mt-3 input-form fluid profile-container'> 
      {profileData &&
      <>
        <h4 id='form-title'>Welcome back <span id='em-text'>{profileData.username}</span></h4>
        <p className='mb-1 mt-3'>Account type: <span>{profileData.admin ? 'Admin' : 'User'}</span></p>
        <p className='mb-5'>Account created: <span>{profileData.createdAt}</span></p>
        <Form >
          <Form.Group as={Row} className='mt-2 email'>
            <Form.Label column sm={3} className='mb3'>Email address</Form.Label>
            <Col sm={7}>
              <Form.Control  
                onChange={handleChange}
                type='email' 
                name='email'
                disabled={editToggle}
                defaultValue={formData.email}
                className='form-field-profile'
              />
              {success &&
                <>
                  <Form.Text className='error'>{success}</Form.Text>
                </>
              } 
            </Col>
            <Col sm={2}>
              {editToggle ?
              <Button className='edit-button' onMouseDown={handleEditClick} onChange={handleChange}>
                Edit
              </Button>
              :
              
              <>
                <Button className='edit-button' id='submit' onMouseDown={handleSubmit}>
                  Submit
                </Button>
              </>
              }
            </Col>
          </Form.Group>
          <hr className='mt-4'/>
          <Form.Group as={Row} className='mt-4 password'>
            <Form.Label column sm={3} className='mb-2'>Password</Form.Label>
            <Col sm={7}>
              <Form.Control  
                type='password' 
                name='password'
                disabled
                defaultValue='password'
                className='form-field-profile'
              /> 
              {/* <Form.Text className='error'>
              {error && 
                <Form.Text>
                  {error.imageUrl && error.imageUrl}
                  {error.questionText && error.questionText}
                </Form.Text>}         
              </Form.Text> */}
              
            </Col>
            <Col sm={2}>
              <Button className='edit-button'>
                Edit
              </Button>
            </Col>
            
          </Form.Group>
          <hr className='mt-3'/>
          <Form.Text>
            {error && 
              <p>{`Unauthorized - please login again`}</p>
            }
          </Form.Text>    
        </Form>
        <Form.Group>
          <h4 className='mt-5'>Your questions</h4>
          <hr className='mt-3'/>
          <h5 id='q-title'>What is the best...</h5>
          {profileData ?
          profileData.ownedQuestions.map(question => {
            const { _id, questionText, imageUrl, category, answers, updatedAt, voteCount } = question
            const capitalQ = questionText
              .split(' ')[0]
              .split('')[0]
              .toLocaleUpperCase()
            const joinedQ = questionText.slice(1)
            const parsedQ = capitalQ.concat(joinedQ)
            return (
              <Link 
                key={_id}
                to={`/question/${_id}`}
                className='link-text'
              >
                <div className='profile-item-container'>
                  
                  <div className='profile-img-container'>
                    <img className='profile-img' src={imageUrl} />
                    <div className='profile-img-text'>
                      {parsedQ}<br />
                      <small id='profile-small-img-text'>{`${category}`}</small>
                    </div>
                  </div>
                  
                  <div className='profile-text-container'>
                    <div className='stats-container'>
                      <div className='profile-text'>{`${answers.length} answers`}</div>
                      <div className='profile-text'>{`${voteCount} votes`}</div>
                    </div>
                  
                    <div className='datetime-container'>
                      <div className='profile-footer'>{`Last updated: ${parseDate(updatedAt)}`}</div>
                    </div>
                  </div>
              
                </div>
              </Link>
            )
          })
          :
          <h4>Error</h4>
          }
        </Form.Group>
      </>
      }
    </Container>
    
    
    
    
    
    
    
    
  )
}

export default Profile
