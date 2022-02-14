import React from 'react'
import { animated, useSpring } from 'react-spring'

const Answer = ({ answer }) => {
  const props = useSpring({
    from: { width: 0 },
    to: { width: answer.votes.length * 100 }
  })

  return (
    <div className='answer-container'>
      <div className='answer-text'>
        <p>{answer.answerText}</p>
      </div>
      <animated.div
        style={{ width: props.width }}
        className='answer-bar'
      ></animated.div>
    </div>
  )
}

export default Answer
