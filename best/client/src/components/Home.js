import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Carousel } from 'react-bootstrap'

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
      <div className='home-heading-container'>
        <h1>What's the best:&nbsp;</h1>
        <Carousel
          pause={false}
          controls={false}
          indicators={false}
          onSlid={slideChangeEnd}
          onSlide={slideChangeStart}
          className='inline'
        >
          {questions.map((question) => {
            return (
              <Carousel.Item key={question._id}>
                <h1>
                  <span className='home-header'>{question.questionText}</span>
                </h1>
              </Carousel.Item>
            )
          })}
        </Carousel>
      </div>
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
              <div className='answers-container'>
                {question.answers.forEach((answer) => {
                  totalVotes += answer.votes.length
                })}
                {question.answers.map((answer) => {
                  let style
                  if (answerBarWidth) {
                    style = {
                      width: `${(answer.votes.length / totalVotes) * 100}% `
                    }

                    if (!answerBarWidth) {
                      style = {
                        width: `${(answer.votes.length / totalVotes) * 100}% `
                      }
                    }

                    // background: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${
                    //   100 - (answer.votes.length / totalVotes) * 100
                    // }%, rgba(0,0,255,1) ${
                    //   100 - (answer.votes.length / totalVotes) * 100
                    // }%, rgba(0,0,255,1) 100%)`
                  }

                  return (
                    <>
                      <div className='answer-container'>
                        <div className='answer-text'>
                          <p>
                            {answer.answerText}
                            {/* {answer.votes.length} */}
                          </p>
                        </div>
                        <div
                          key={answer._id}
                          style={style}
                          className='answer-bar'
                        >
                          <p>{answer.votes.length}</p>
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </>
  )
}

export default Home
