import React from 'react'

const AnswerBar = (props) => {
  const { completed } = props

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
    margin: 50
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: 'blue',
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div>
      <div>
        <span>{`${completed}%`}</span>
      </div>
    </div>
  )
}

export default AnswerBar
