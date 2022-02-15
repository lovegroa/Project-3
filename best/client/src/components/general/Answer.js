import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import {
  getPayload,
  getUsersIp,
  userAuthenticated
} from '../utils/userAuthenticated'

const Answer = ({ answer }) => {
  const [userHasVoted, setUserHasVoted] = useState(false)
  const [userIp, setUserIp] = useState('')

  useEffect(() => {
    const checkVotes = async () => {
      setUserIp(await getUsersIp)
    }

    checkVotes()
  }, [])

  useEffect(() => {
    const checkVotes = async () => {
      let votedUsingAccount = []

      if (userAuthenticated()) {
        const payload = getPayload()

        votedUsingAccount = answer.votes.filter(
          (vote) => vote.owner === payload.sub
        )
      }

      const votedUsingIp = answer.votes.filter((vote) => {
        return vote.ipAddress === userIp
      })
      if (votedUsingAccount.length > 0 || votedUsingIp.length > 0) {
        setUserHasVoted(true)
      } else {
        setUserHasVoted(false)
      }
      console.log(userHasVoted)
    }

    checkVotes()
  }, [userIp])

  const props = useSpring({
    from: { width: 0 },
    to: { width: answer.votes.length * 100 }
  })

  return (
    <div className='answer-container'>
      <div className='answer-text'>
        <p>{answer.answerText}</p>
      </div>
      <div className='answer-container-right'>
        <animated.div
          style={{ width: props.width }}
          className='answer-bar'
        ></animated.div>
        <button className={userHasVoted ? 'vote voted' : 'vote'}></button>
      </div>
    </div>
  )
}

export default Answer
