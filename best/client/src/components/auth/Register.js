import React, { useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

import { FloatingLabel, Container, Form, Button } from 'react-bootstrap'

const Register = () => {

  const navigate = useNavigate()

  const [ formData, setFormData ] = useState({
    username: '', 
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const [ error, setError ] = useState({
    username: '', 
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/register', formData)
      console.log(data)
      navigate('/login')
    } catch (error) {
      console.log(error.response.data.errors)
      setError(error.response.data.errors)
    }
  }
  
  
  
  return (

    <Container className='mt-5 form-container'> 
      <h4>Create your <span>What&#39;s the Best </span>account</h4>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mt-4 username'>
          <FloatingLabel
            label='Username'
            className='mb3 floatingInput' >
            <Form.Control 
              onChange={handleChange} 
              type='text'
              name='username'
              placeholder='Username'
              defaultValue={formData.username} 
              className='form-field'
            />  
          </FloatingLabel>
          <Form.Text className='error'>
            {error.username && 
              <Form.Text>
                {error.username.kind === 'required' && 'Please provide a username'}
                {error.username.kind === 'unique' && 'Sorry, that username already exists'}
                {error.username.kind === 'maxlength' && 'Sorry, username maximum length is 16 characters'}
            </Form.Text>}         
          </Form.Text>
        </Form.Group>

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
              className='form-field'
            />  
          </FloatingLabel>
          <Form.Text className='error'>
            {error.email && 
              <Form.Text>
                {error.email.kind === 'required' && 'Please provide an email address'}
                {error.email.kind === 'unique' && 'Sorry, that email is already registered'}
              </Form.Text>}
          </Form.Text>   
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
                className='form-field'
              />  
            </FloatingLabel>
            <Form.Text className='error'>
              {error.password &&
                <Form.Text>
                {error.password.kind === 'required' && 'Please enter a password'}
              </Form.Text>}
            </Form.Text>      
          </Form.Group>
          
          <Form.Group className='mt-4 confirm-password'>
            <FloatingLabel
              label='Confirm password'
              className='mb3 floatingInput' >
              <Form.Control 
                onChange={handleChange} 
                type='password'
                name='passwordConfirmation'
                placeholder='Confirm password'
                className='form-field'
                defaultValue={formData.passwordConfirmation} 
              />  
            </FloatingLabel>  
            <Form.Text className='error'>
              {error.passwordConfirmation &&
                <Form.Text>
                {error.passwordConfirmation.kind === 'user defined' && 'Passwords do not match'}
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

export default Register
