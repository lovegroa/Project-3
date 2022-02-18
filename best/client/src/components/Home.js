import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Carousel, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Home = () => {
  const [questions, setQuestions] = useState([])
  const [trendingQuestions, setTrendingQuestions] = useState([])

  const runCallback = (cb) => {
    return cb()
  }

  const sampleQuestion = Math.floor(Math.random() * questions.length)

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
    const getTrendingData = () => {
      let tempTrendingQuestions = [...questions]
      tempTrendingQuestions = tempTrendingQuestions.filter(
        (question) => question.votesIn30Mins !== 0
      )
      tempTrendingQuestions.sort((a, b) => b.votesIn30Mins - a.votesIn30Mins)
      setTrendingQuestions(tempTrendingQuestions)
    }

    getTrendingData()
  }, [questions])

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
                  for (let i = 0; i < trendingQuestions.length; i += 6) {
                    row.push(
                      <Carousel.Item key={i}>
                        <div className='slide'>
                          {runCallback(() => {
                            const row2 = []

                            for (let j = 0; j < 6; j++) {
                              if (i + j < trendingQuestions.length) {
                                row2.push(
                                  <Link
                                    to={`/question/${
                                      trendingQuestions[i + j]._id
                                    }`}
                                  >
                                    <div
                                      className='slide-question'
                                      key={trendingQuestions[i + j]._id}
                                      style={{
                                        backgroundImage: `url(${
                                          trendingQuestions[i + j].imageUrl
                                        })`
                                      }}
                                    >
                                      <p className='slide-text'>
                                        {trendingQuestions[i + j].questionText}
                                      </p>
                                    </div>
                                  </Link>
                                )
                              }
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

          <br />
          <br />
          <br />
          <br />
        </>
      ) : (
        'loading'
      )}
    </>
  )
}

export default Home
