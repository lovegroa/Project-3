import React from 'react'

import { FloatingLabel, Container, Form, Button } from 'react-bootstrap'


const AddQuestion = () => {
  
  
  
  // call image API

  // form to add question text

  
  
  return (
    <>
      <Container className='mt-5 input-form'> 
        <h4>Add a question to <span>What&#39;s the Best </span></h4>
        
        <Form >
          <Form.Group className='mt-4 username'>
            <Form.Label className='mb3'></Form.Label>
            <Form.Control 
              // onChange={handleChange} 
              as='textarea' rows={3}
              name='questionText'
              placeholder='Write your question here'
              // defaultValue={formData.username} 
            />  
            
            <Form.Text className='error'>
              {/* {error.username && 
                <Form.Text>
                  {error.username.kind === 'required' && 'Please provide a username'}
                  {error.username.kind === 'unique' && 'Sorry, that username already exists'}
                  {error.username.kind === 'maxlength' && 'Sorry, username maximum length is 16 characters'}
              </Form.Text>}          */}
            </Form.Text>
          </Form.Group>

          

          <Form.Group className='mt-5 text-center btn'>
            <Button variant='primary' type='submit'>Submit</Button>
          </Form.Group>

        </Form>
      </Container>
    </>

  )
}

export default AddQuestion
