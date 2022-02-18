import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap'
import SingleSelect from './utils/reactSelect'
import { useNavigate } from 'react-router-dom'
import { getTokenFromLocalStorage } from './utils/userAuthenticated'

const apiKey = process.env.REACT_APP_GOOGLE_SEARCH_API_KEY
const AddQuestion = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    questionText: '',
    imageUrl: '',
    category: ''
  })

  const [error, setError] = useState({
    questionText: '',
    imageUrl: '',
    category: ''
  })

  const [selected, setSelected] = useState({
    value: '',
    label: ''
  })

  // call image API
  const getImage = async () => {
    const imgUrls = []

    if (!formData.questionText) {
      setError({
        imageUrl: 'A question is required before you can add an image'
      })
    }
    try {
      if (formData.questionText) {
        const { data } = await axios.get(
          `https://www.googleapis.com/customsearch/v1?q=${formData.questionText}&key=${apiKey}&cx=5f017c0fcf7051673&searchType=image`
        )

        data.items.forEach((item) => {
          imgUrls.push(item.link)
        })
        const randomIndex = Math.floor(Math.random() * imgUrls.length)
        setFormData({ ...formData, imageUrl: imgUrls[randomIndex] })
      }
    } catch (error) {
      console.log(error.response.data.errors)
      setError(error.response.data.errors)
    }
  }

  // extract chosen categories from React-Select
  useEffect(() => {
    console.log(selected.label)
    setFormData({ ...formData, category: selected.label })
  }, [selected])

  // handle search query
  const searchQuery = (e) => {
    setFormData({ ...formData, questionText: e.target.value.toLowerCase() })
    setError({ imageUrl: '' })
    if (e.target.value.toLowerCase().length > 30) {
      setError({
        questionText: 'The maximum length of a question is 30 characters'
      })
    }
  }

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }
      const { data } = await axios.post('/api/questions/add', formData, headers)
      navigate(`/question/${data._id}`)
    } catch (error) {
      console.log(error.response.data.errors)
      setError(error.response.data.errors)
    }
  }

  return (
    <>
      <Container className='mt-3 input-form form-container'>
        <h4>Add a question...</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className='mt-5 question'>
            <Form.Label column sm={2} className='mb3'>
              <span id='question'>What&#39;s the Best:</span>
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                as='textarea'
                rows={2}
                name='questionText'
                placeholder='Write your question here'
                onChange={searchQuery}
                className='textbox'
              />
              <Form.Text className='error'>
                {error && (
                  <Form.Text>
                    {error.imageUrl && error.imageUrl}
                    {error.questionText && error.questionText}
                  </Form.Text>
                )}
              </Form.Text>
              <hr className='mt-5' />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='categories'>
            <Form.Label column sm={2}>
              <span id='image'>Add categories:</span>
            </Form.Label>
            <Col sm={10}>
              {formData.questionText ? (
                <SingleSelect {...{ setSelected }} />
              ) : (
                <div id='empty-div'></div>
              )}
              <hr className='mt-5 mb-5' />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='image'>
            <Form.Label column sm={2} className='mb3'>
              <span id='image'>Add an image:</span>
            </Form.Label>
            <Col sm={3}>
              <Button variant='secondary' id='random-button' onClick={getImage}>
                Get random image
              </Button>
            </Col>
            <Col sm={7} className='d-flex flex-row-reverse'>
              {formData.imageUrl && (
                <Image
                  className='img-fluid img-thumbnail q-image'
                  src={formData.imageUrl}
                ></Image>
              )}
            </Col>
            <hr className='mt-5 mb-5' />
          </Form.Group>

          <Form.Group className='text-center submit-btn'>
            <Button variant='primary' type='submit' id='form-field-btn'>
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  )
}

export default AddQuestion
