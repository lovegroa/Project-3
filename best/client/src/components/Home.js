import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Carousel, Container } from 'react-bootstrap'
import AnswerBar from './general/AnswerBar'
import Answer from './general/Answer'
import { Link } from 'react-router-dom'

const Home = () => {
  const [questions, setQuestions] = useState([])
  const runCallback = (cb) => {
    return cb()
  }

  const [slides, setSlides] = useState([])
  const [answerBarWidth, setAnswerBarWidth] = useState(false)
  const sampleQuestion = Math.floor(Math.random() * questions.length)

  let tempArray = []

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

  useEffect(() => {
    let i = 0
    let j = 0
    tempArray = []
    for (let i = 0; i < questions.length; i++) {
      if (i % 6 === 0) {
        j++
        tempArray.push([])
      }
      // tempArray[j].push(questions[i])
    }

    // while (i < questions.length) {

    i++
    // }
  }, [questions])

  const slideChangeEnd = () => {
    setAnswerBarWidth(true)
    console.log('end')
  }

  const slideChangeStart = () => {
    setAnswerBarWidth(false)

    console.log('start')
  }

  console.log(tempArray)

  return (
    <>
      {questions[0] ? (
        <>
          <div className='hero-container'>
            <div id='home-hero-container-left'>
              <h1>
                <span className='question-text'>
                  {questions[sampleQuestion].answers[0] ? (
                    <>
                      <h1>
                        <span className='hero-text'>
                          {questions[sampleQuestion].answers[0].answerText}
                        </span>
                      </h1>
                      <h2>is the best </h2>
                      <h2>
                        <span className='hero-text'>
                          {questions[sampleQuestion].questionText}{' '}
                        </span>
                      </h2>
                      <Link to={`/question/${questions[sampleQuestion]._id}`}>
                        <button className='general-btn'>
                          Click here to vote
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <h1>
                        The best
                        <br />
                        <span className='hero-text'>
                          {questions[sampleQuestion].questionText}
                        </span>
                        <br />
                        has no answers
                      </h1>
                      <Link to={`/question/${questions[sampleQuestion]._id}`}>
                        <button className='general-btn'>
                          Add the first answer!
                        </button>
                      </Link>
                    </>
                  )}
                </span>
              </h1>
            </div>
            <div id='home-hero-container-right'>
              <img src={questions[sampleQuestion].imageUrl}></img>
            </div>
          </div>
          <Container>
            <div id='carousel-container'>
              <h2>
                What is the best: <span className='hero-text'>Trending</span>
              </h2>

              <Carousel indicators={false}>
                {runCallback(() => {
                  const row = []
                  for (let i = 0; i < questions.length - 6; i += 6) {
                    row.push(
                      <Carousel.Item key={i}>
                        <div className='slide'>
                          {runCallback(() => {
                            const row2 = []

                            for (let j = 0; j < 6; j++) {
                              row2.push(
                                <Link to={`/question/${questions[i + j]._id}`}>
                                  <div
                                    className='slide-question'
                                    key={questions[i + j]._id}
                                    style={{
                                      backgroundImage: `url(${
                                        questions[i + j].imageUrl
                                      })`
                                    }}
                                  >
                                    <p className='slide-text'>
                                      {questions[i + j].questionText}
                                    </p>
                                  </div>
                                </Link>
                              )
                            }

                            return row2
                          })}
                        </div>
                      </Carousel.Item>
                    )
                  }
                  return row
                })}
              </Carousel>
            </div>
          </Container>
        </>
      ) : (
        'loading'
      )}
    </>
  )
}

export default Home
