import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Carousel } from 'react-bootstrap'
import AnswerBar from './general/AnswerBar'
import Answer from './general/Answer'

const Home = () => {
  const [questions, setQuestions] = useState([])
  const [answerBarWidth, setAnswerBarWidth] = useState(false)
  let totalVotes = 0

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/questions')
        await setQuestions(data)
      } catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [])

  const slideChangeEnd = () => {
    setAnswerBarWidth(true)
    console.log('end')
  }

  const slideChangeStart = () => {
    setAnswerBarWidth(false)

    console.log('start')
  }

  return (
    <>
      <Carousel
        pause={false}
        fade
        controls={false}
        indicators={false}
        className='inline'
      >
        {questions.map((question) => {
          totalVotes = 0
          return (
            <Carousel.Item key={question._id}>
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
                      />
                    )
                  })
                ) : (
                  <p>Loading</p>
                )}
              </div>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </>
  )
}

export default Home
