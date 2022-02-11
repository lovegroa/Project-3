import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'

const Home = () => {
  const [questions, setQuestions] = useState([])
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

  return (
    <>
      <div className='home-heading-container'>
        <h1>What is the best:&nbsp;</h1>
        <Carousel
          pause={false}
          controls={false}
          indicators={false}
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
              <div className='card'>
                <ul className='list-group list-group-flush'>
                  {question.answers.forEach((answer) => {
                    totalVotes += answer.votes.length
                  })}
                  {question.answers.map((answer) => {
                    const style = {
                      background: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${
                        100 - (answer.votes.length / totalVotes) * 100
                      }%, rgba(0,0,255,1) ${
                        100 - (answer.votes.length / totalVotes) * 100
                      }%, rgba(0,0,255,1) 100%)`
                    }

                    return (
                      <li style={style} className='list-group-item'>
                        {answer.answerText}
                        {/* {answer.votes.length} */}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </>
  )
}

export default Home
