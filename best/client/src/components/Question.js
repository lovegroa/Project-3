import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import Answer from './general/Answer'

const Question = () => {
  const [question, setQuestion] = useState([])
  const { questionId } = useParams()
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
            props.width = answer.votes.length
            return <Answer key={index} answer={answer} />
          })
        ) : (
          <p>Loading</p>
        )}
      </div>
    </>
  )
}

export default Question
