import Question from '../models/question.js'
import User from '../models/user.js'

// *** Controllers ***
// Get all questions
export const getQuestions = async (_req, res) => {
  try {
    const questions = await Question.find()
    return res.status(200).json(questions)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// Logged-in user posts a question
export const addQuestion = async (req, res) => {
  try {
    const questionToAdd = await Question.create({
      ...req.body,
      owner: req.currentUser._id
    })
    return res.status(201).json(questionToAdd)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

export const hideQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    const questionToHide = await Question.findById(questionId)
    const user = await User.findById(req.currentUser._id)

    //checks to see if the user owns the questions, or is an admin
    if (!(questionToHide.owner.equals(req.currentUser._id) || user.admin)) {
      throw new Error('Unauthorised')
    }
    questionToHide.hidden = true
    await questionToHide.save()

    return res
      .status(204)
      .json(
        `What is the best: ${questionToHide.questionText}? has been removed from view`
      )
  } catch (error) {
    return res.status(422).json({ message: error.message })
  }
}

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    const questionToDelete = await Question.findById(questionId)
    const user = await User.findById(req.currentUser._id)

    //checks to see if the user owns the questions, or is an admin
    if (!user.admin) {
      throw new Error('Unauthorised')
    }
    questionToDelete.remove()
    await questionToDelete.save()

    return res.status(204)
  } catch (error) {
    return res.status(422).json({ message: error.message })
  }
}

// Get answers to a question
export const getQuestion = async (req, res) => {
  try {
    const { questionId } = req.params
    const answers = await Question.findById(questionId)
      .populate('owner')
      .populate('answers.owner')
    return res.status(200).json(answers)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// *** function which parses the IP from the request - to be validated from front-end ***
const parseIp = (req) => {
  const parsedSocket = req.socket?.remoteAddress.split(':')
  return (
    req.headers['x-forwarded-for']?.split(',').shift() ||
    parsedSocket[parsedSocket.length - 1]
  )
}

// Logged-in user posts a question
export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId)
    if (!question) throw new Error('Question not found')
    question.answers.push({ ...req.body, owner: req.currentUser._id })
    question.answers.sort((a, b) => b.voteCount - a.voteCount)
    await question.save()
    return res.status(201).json(question.answers[question.answers.length - 1])
  } catch (error) {
    return res.status(422).json({ message: error.message })
  }
}

export const hideAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params
    const question = await Question.findById(questionId)

    if (!question) throw new Error('Question not found')

    question.answers.id(answerId)

    const answer = await question.answers.id(answerId)

    answer.hidden = true

    await question.save()

    return res.sendStatus(204)
  } catch (error) {
    return res.status(422).json({ message: error.message })
  }
}

// Get search results
export const getSearchResults = async (req, res) => {
  try {
    const { searchTerm } = req.params
    const searchResults = await Question.find({
      questionText: { $regex: searchTerm, $options: 'i' }
    })
    return res.status(200).json(searchResults)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// delete vote refactored to handle anonymous and logged-in users
export const deleteVote = async (req, res, next) => {
  try {
    const { questionId, voteId } = req.params
    const question = await Question.findById(questionId) // find question
    if (!question) throw new Error('Question not found') // check question exists
    if (!question.answers)
      throw new Error('Question does not yet have any answers') // check there are answers

    if (req.currentUser) {
      // applies for logged-in user
      question.answers.forEach((answer) => {
        const votesToDelete = answer.votes.filter((vote) => {
          if (vote.owner) {
            return vote.owner.equals(req.currentUser._id) // filter votes where the owner is the current user
          }
        })
        votesToDelete.forEach((vote) => vote.remove()) // delete these votes
      })
    }

    // if (!req.currentUser) {
    // applies for anonymous users
    question.answers.forEach((answer) => {
      const votesToDelete = answer.votes.filter(
        (vote) => vote.ipAddress === parseIp(req)
      ) // filter votes where the ipAddress is the same as the current user's IP
      votesToDelete.forEach((vote) => vote.remove()) // delete these votes
    })
    // }
    question.answers.sort((a, b) => b.voteCount - a.voteCount)

    await question.save()

    if (voteId) return res.sendStatus(204)
    next()
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// add vote refactored to handle anonymous and logged-in users
export const addVote = async (req, res) => {
  try {
    console.log(req.headers)

    const { questionId, answerId } = req.params
    const question = await Question.findById(questionId) // find question
    if (req.currentUser) {
      // applies for logged-in user
      const newVote = { owner: req.currentUser._id, ipAddress: parseIp(req) } // populates the owner field
      const answer = question.answers.id(answerId)
      answer.votes.push(newVote) // pushes vote into vote array
    } else if (!req.currentUser) {
      // applies for anonymous user
      const newVote = { ipAddress: parseIp(req) } // populates the ipAdress field
      const answer = question.answers.id(answerId)
      answer.votes.push(newVote) // pushes vote into vote array
    }
    question.answers.sort((a, b) => b.voteCount - a.voteCount)

    await question.save()
    return res.status(200).json(question)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

export const getIp = async (req, res) => {
  try {
    return res.status(200).json({ ip: parseIp(req) })
  } catch (error) {
    return res.status(422).json(error)
  }
}
