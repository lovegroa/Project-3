import React, { useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { FloatingLabel, Container, Form, Button } from 'react-bootstrap'

const Login = () => {
  
  const navigate = useNavigate()
  
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  })
  
  const [ error, setError ] = useState('')

  const storeToken = (token) => {
    window.localStorage.setItem('whats-the-best-token', token)
  }
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/login', formData)
      storeToken(data.token)
      navigate('/')
    } catch (error) {
      const { message } = error.response.data
      console.log(message)
      setError(message)
    }
  }


  return (
    
    <Container className='mt-5 input-form'> 
      <h4>Login into your <span>What&#39;s the Best </span>account</h4>
      
      <Form onSubmit={handleSubmit}>

        <Form.Group className='mt-4 email'>
          <FloatingLabel
            label='Email'
            className='mb3 floatingInput' >
            <Form.Control 
              onChange={handleChange} 
              type='email'
              name='email'
              placeholder='Email'
              defaultValue={formData.email} 
            />  
          </FloatingLabel>  
        </Form.Group>

        <Form.Group className='mt-4 password'>
          <FloatingLabel
            label='Password'
            className='mb3 floatingInput' >
            <Form.Control 
              onChange={handleChange} 
              type='password'
              name='password'
              placeholder='Password'
              defaultValue={formData.password} 
            />  
          </FloatingLabel>
          <Form.Text className='error'>
          {error && 
            <Form.Text>
              {error}
            </Form.Text>}
          </Form.Text>       
        </Form.Group>
          
        <Form.Group className='mt-5 text-center btn'>
          <Button variant='primary' type='submit'>Submit</Button>
        </Form.Group>

      </Form>
    </Container>



  )
}

export default Login
