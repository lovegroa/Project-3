import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import Answer from './general/Answer'
import {
  getTokenFromLocalStorage,
  userAuthenticated
} from './utils/userAuthenticated'

const Question = () => {
  const [question, setQuestion] = useState([])
  const [newAnswer, setnewAnswer] = useState({})
  const { questionId } = useParams()
  const navigate = useNavigate()

  let props = useSpring({
    from: { width: 0 },
    to: { width: 1000 }
  })

  let totalVotes = 0

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/question/${questionId}`)
        await setQuestion(data)
      } catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [questionId])

  const handleChange = (e) => {
    setnewAnswer({ [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formHeader = {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }

      const { data } = await axios.post(
        `/api/question/${questionId}/answers`,
        newAnswer,
        formHeader
      )
      navigate(0)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='home-heading-container'>
        <h1>Whats the best:&nbsp;</h1>
        <h1>
          <span className='home-header'>{question.questionText}</span>
        </h1>
      </div>
      <div className='answers-container'>
        {question.answers ? (
          question.answers.map((answer, index) => {
            return (
              <Answer
                key={index}
                answer={answer}
                totalVotes={question.voteCount}
                questionId={question._id}
                maxVotes={question.maxVotes}
              />
            )
          })
        ) : (
          <p>Loading</p>
        )}
        {userAuthenticated() ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mt-4 text'>
              <FloatingLabel label='Add answer' className='mb3 floatingInput'>
                <Form.Control
                  onChange={handleChange}
                  type='text'
                  name='answerText'
                  placeholder='add answer'
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className='mt-5 text-center btn'>
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Form.Group>
          </Form>
        ) : (
          <p>log in to add an answer</p>
        )}
      </div>
    </>
  )
}

export default Question
