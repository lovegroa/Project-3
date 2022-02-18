import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Answer from './general/Answer'
import {
  getTokenFromLocalStorage,
  userAuthenticated
} from './utils/userAuthenticated'

const Question = () => {
  const [question, setQuestion] = useState([])
  const [newAnswer, setnewAnswer] = useState({})
  const { questionId } = useParams()
  let addAnswerInput

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/question/${questionId}`)
        await setQuestion({ ...data, newVotes: 0 })
      } catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [questionId, question.newVotes])

  const handleChange = (e) => {
    addAnswerInput = e.target
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

      await axios.post(
        `/api/question/${questionId}/answers`,
        newAnswer,
        formHeader
      )
      setQuestion({ ...question, newVotes: question.newVotes + 1 })
    } catch (error) {
      console.log(error)
    }
    setnewAnswer({ answerText: '' })
  }

  return (
    <>
      {question.answers ? (
        <>
          <div className='hero-container question-hero'>
            <div id='home-hero-container-left'>
              <h1>
                <span className='question-text'>
                  {question.answers.length !== 0 && question.voteCount > 0 ? (
                    <>
                      <h1>
                        <span className='hero-text'>
                          {question.answers[0].answerText}
                        </span>
                        <br />
                        is the best
                        <br />
                        <span className='hero-text'>
                          {question.questionText}{' '}
                        </span>
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1>
                        The best
                        <br />
                        <span className='hero-text'>
                          {question.questionText}
                        </span>
                        <br />
                        has no answers
                      </h1>
                    </>
                  )}
                </span>
              </h1>
            </div>
            <div id='home-hero-container-right'>
              <img src={question.imageUrl}></img>
            </div>
          </div>

          <Container>
            <div className='home-heading-container'>
              <br />
              <h2>Vote for your favourite below:</h2>
              <br />
            </div>
            <div className='answers-container'>
              {question.answers ? (
                <>
                  {question.answers.map((answer, index) => {
                    return (
                      <Answer
                        key={index}
                        answer={answer}
                        totalVotes={question.voteCount}
                        questionId={question._id}
                        maxVotes={question.maxVotes}
                        question={question}
                        setQuestion={setQuestion}
                      />
                    )
                  })}

                  <div>
                    {userAuthenticated() ? (
                      <>
                        <form id='add-answer-form' onSubmit={handleSubmit}>
                          <input
                            value={newAnswer.answerText}
                            onChange={handleChange}
                            type='text'
                            name='answerText'
                            placeholder='Add answer'
                          ></input>
                          <button
                            className={`general-btn ${
                              newAnswer.answerText ? '' : 'hide'
                            }`}
                            type='submit'
                          >
                            Add
                          </button>
                        </form>
                      </>
                    ) : (
                      <p>log in to add an answer</p>
                    )}
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                </>
              ) : (
                <p>Loading</p>
              )}
            </div>
          </Container>
        </>
      ) : (
        'loading'
      )}
    </>
  )
}

export default Question
