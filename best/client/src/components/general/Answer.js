import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import {
  getPayload,
  getUsersIp,
  userAuthenticated
} from '../utils/userAuthenticated'

const Answer = ({ answer, totalVotes }) => {
  const [uHasVoted, setUHasVoted] = useState(false)
  console.log(totalVotes)
  const votePercentage = Math.round((answer.votes.length / totalVotes) * 100)
  let userHasVoted = false

  const checkVotes = async () => {
    let userIp = await getUsersIp()
    let votedUsingAccount = []

    if (userAuthenticated()) {
      const payload = getPayload()

      votedUsingAccount = answer.votes.filter(
        (vote) => vote.owner === payload.sub
      )
    }

    const votedUsingIp = answer.votes.filter((vote) => {
      console.log(vote.ipAddress, userIp, vote.ipAddress === userIp)
      return vote.ipAddress === userIp
    })
    console.log('voted using IP:', votedUsingIp)

    if (votedUsingAccount.length > 0 || votedUsingIp.length > 0) {
      userHasVoted = true
      setUHasVoted(true)
    } else {
      userHasVoted = false
      setUHasVoted(false)
    }
    console.log(votedUsingIp)
    console.log(userHasVoted, answer.answerText)
  }

  checkVotes()

  const props = useSpring({
    from: { width: '0%' },
    to: { width: (votePercentage / 100) * 90 + '%' }
  })

  return (
    <div className='answer-container'>
      <div className='answer-text'>
        <p>{answer.answerText}</p>
      </div>
      <div className='answer-container-right'>
        <p>{votePercentage}%</p>

        <animated.div
          style={{ width: props.width }}
          className='answer-bar'
        ></animated.div>
        <button className={uHasVoted ? 'vote voted' : 'vote'}></button>
      </div>
    </div>
  )
}

export default Answer
