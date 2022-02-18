import axios from 'axios'
import React, { useState } from 'react'
import { animated, useSpring } from 'react-spring'
import {
  getPayload,
  getTokenFromLocalStorage,
  getUsersIp,
  userAuthenticated
} from '../utils/userAuthenticated'

const Answer = ({
  answer,
  totalVotes,
  questionId,
  maxVotes,
  question,
  setQuestion
}) => {
  const [uHasVoted, setUHasVoted] = useState(false)

  let votePercentage = answer.votes.length / totalVotes

  totalVotes === 0
    ? (votePercentage = 0)
    : (votePercentage = answer.votes.length / totalVotes)

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
      return vote.ipAddress === userIp
    })

    if (votedUsingAccount.length > 0 || votedUsingIp.length > 0) {
      userHasVoted = true
      setUHasVoted(true)
    } else {
      userHasVoted = false
      setUHasVoted(false)
    }
  }

  checkVotes()
  let toWidth
  if (totalVotes === 0) {
    toWidth = 0 + '%'
  } else {
    toWidth = (votePercentage / (maxVotes / totalVotes)) * 83 + '%'
  }

  const props = useSpring({
    from: { width: '0%' },
    to: { width: toWidth }
  })

  const handleVote = async (e) => {
    try {
      let url = `/api/question/${questionId}/answers/${answer._id}`
      const formData = {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }
      const formBody = {}

      if (userHasVoted) {
        url += '/vote'
        const { data } = await axios.delete(url, formData)
      } else {
        const { data } = await axios.post(url, formBody, formData)
      }
      setQuestion({ ...question, newVotes: question.newVotes + 1 })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='answer-container' onClick={handleVote}>
      <div className='answer-text'>
        <p>{answer.answerText}</p>
      </div>
      <div className='answer-container-right'>
        <p>{(votePercentage * 100).toFixed(0)}%</p>

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
