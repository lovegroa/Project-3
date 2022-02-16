import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { getTokenFromLocalStorage } from './utils/userAuthenticated'

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
  
  const [ error, setError ] = useState({
    username: '', 
    email: '',
    password: '',
    passwordConfirmation: ''
  })

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
      } catch (error) {
        console.log(error)
      }
    }
    getProfile()
  }, [])
  
  return (
    <Container className='mt-5 input-form fluid'> 
      <h4 >Welcome back NAME OF PERSON</h4>
      <p className='mb-5'>Profile: 
        <span></span>
      </p>
      <Form >
        <Form.Group as={Row} className='mt-2 email'>
          <Form.Label column sm={3} className='mb3'>Email address</Form.Label>
          <Col sm={7}>
            <Form.Control  
              type='email' 
              name='email address'
              disabled
              defaultValue=''
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
          <hr className='mt-4'/>
        </Form.Group>
        
        <Form.Group as={Row} className='mt-2 password'>
          <Form.Label column sm={3} className='mb3'>Password</Form.Label>
          <Col sm={7}>
            <Form.Control  
              type='password' 
              name='password'
              disabled
              defaultValue=''
              value='password'
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
          <hr className='mt-4'/>
        </Form.Group>

        

      </Form>

      <h4 className='mt-5'>Your recent activity</h4>
    </Container>
    
    
    
    
    
    
    
  )
}

export default Profile
