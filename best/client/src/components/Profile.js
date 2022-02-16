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
  
  const [ error, setError ] = useState('')

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
          createdAt: parseDate(data.createdAt),
          admin: data.admin,
          ownedAnswers: data.ownedAnswers,
          ownedQuestions: data.ownedQuestions,
          ownedVotes: data.ownedVotes,
        })
        console.log(profileData.ownedQuestions)
      } catch (error) {
        console.log(error.message)
        setError(error.message)
      }
    }
    getProfile()
  }, [])
  
  return (
    <Container className='mt-3 input-form fluid profile-container'> 
      <h4 >Welcome back <span>{formData.username}</span></h4>
      <p className='mb-1 mt-3'>Account type: <span>{profileData.admin ? 'Admin' : 'User'}</span></p>
      <p className='mb-5'>Account created: <span>{profileData.createdAt}</span></p>
      <Form >
        <Form.Group as={Row} className='mt-2 email'>
          <Form.Label column sm={3} className='mb3'>Email address</Form.Label>
          <Col sm={7}>
            <Form.Control  
              type='email' 
              name='email address'
              disabled
              defaultValue={formData.email}
            /> 
          </Col>
          <Col sm={2}>
            <Button className='edit-button'>
              Edit
            </Button>
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
        <hr className='mt-4'/>
        {profileData ?
        profileData.ownedQuestions.map(question => {
          const { _id, questionText, imageUrl, category, answers, updatedAt } = question
          return (
            <Link 
              key={_id}
              to={`/question/${_id}`}
            >
              <div className='profile-item-container'>
                <img className='profile-img' src={imageUrl} />
                <div className='profile-text'>
                  <div>{`What is the best: ${questionText}`}</div>
                  <div className='small-text-container'>
                    <small className='profile-small-text'>{`Category: ${category}`}</small>
                    <small className='profile-small-text'>{`No. of answers: ${answers.length}`}</small>
                    <small className='profile-small-text'>{`Last updated: ${parseDate(updatedAt)}`}</small>
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

    </Container>
    
    
    
    
    
    
    
  )
}

export default Profile
