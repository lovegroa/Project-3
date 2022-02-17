import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'
import {
  getPayload,
  getTokenFromLocalStorage,
  getUsersIp,
  userAuthenticated
} from '../utils/userAuthenticated'

const Answer = ({ answer, totalVotes, questionId, maxVotes }) => {
  const [uHasVoted, setUHasVoted] = useState(false)
  const navigate = useNavigate()

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

  const props = useSpring({
    from: { width: '0%' },
    to: { width: (votePercentage / ((maxVotes / totalVotes) * 100)) * 90 + '%' }
  })
  console.log(answer.answerText, maxVotes)

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
      navigate(0)
    } catch (err) {
      console.log(err)
    }
  }

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
        <button
          onClick={handleVote}
          className={uHasVoted ? 'vote voted' : 'vote'}
        ></button>
      </div>
    </div>
  )
}

export default Answer
