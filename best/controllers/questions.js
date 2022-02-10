import Question from '../models/question.js'
import questions from '../seeds/data/questions.js'

// *** Controllers ***
// Get all questions
export const getQuestions = async (_req, res) => {
  try {
    const questions = await Question.find()
    console.log(questions)
    return res.status(200).json(questions)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// Logged-in user posts a question
export const addQuestion = async (req, res) => {
  try {
    const questionToAdd = await Question.create({ ...req.body, owner: req.currentUser._id })
    return res.status(201).json(questionToAdd)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// Get answers to a question
export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params
    const answers = await Question.findById(questionId).populate('owner').populate('answers.owner')
    return res.status(200).json(answers)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}

// *** function which parses the IP from the request - to be validated from front-end ***
const parseIp = (req) => {
  const parsedSocket = req.socket?.remoteAddress.split(':')
  return req.headers['x-forwarded-for']?.split(',').shift() || parsedSocket[parsedSocket.length - 1]
}

// deletes all votes associated with a logged-in user (followed by addVote)
export const deleteVote = async (req, res, next) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId) // find question
    if (!question) throw new Error ('Question not found') // check question exists
    if (!question.answers) throw new Error ('Question does not yet have any answers') // check there are answers
    question.answers.forEach(answer => {
      const votesToDelete = answer.votes.filter(vote => { 
        if (vote.owner) {
          return vote.owner.equals(req.currentUser._id) // filter votes where the owner is the current user
        }
      })
      votesToDelete.forEach(vote => vote.remove()) // delete these votes
    })
    await question.save()
    next()
  } catch (error) {
    console.log(error) 
    return res.status(422).json({ message: error.message })
  }
}

// Logged-in user votes on an answer (in sequence after deleteVote)
export const addVote = async (req,res) => {
  try {
    const { questionId, answerId } = req.params
    const question = await Question.findById(questionId) // find question
    const newVote = { owner: req.currentUser._id, ipAddress: parseIp(req) } // populates the owner field
    const answer = question.answers.id(answerId)
    answer.votes.push(newVote) // pushes vote into vote array
    await question.save()
    return res.status(201).json(question)
  } catch (error) {
    console.log(error) 
    return res.status(422).json({ message: error.message })
  }
}

// deletes all votes associated with an anonymous user (followed by addAnonVote)
export const deleteAnonVote = async (req, res, next) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId) // find question
    if (!question) throw new Error ('Question not found') // check question exists
    if (!question.answers) throw new Error ('Question does not yet have any answers') // check there are answers
    question.answers.forEach(answer => {
      const votesToDelete = answer.votes.filter(vote => vote.ipAddress === parseIp(req)) // filter votes where the ipAddress is the same as the current user's IP
      votesToDelete.forEach(vote => vote.remove()) // delete these votes
    })
    await question.save()
    next()
  } catch (error) {
    console.log(error) 
    return res.status(422).json({ message: error.message })
  }
}

// Anon user votes on an answer (in sequence after deleteAnonVote)
export const addAnonVote = async (req,res) => {
  try {
    const { questionId, answerId } = req.params
    const question = await Question.findById(questionId) // find question
    const newVote = { ipAddress: parseIp(req) } // populates the ipAdress field
    const answer = question.answers.id(answerId)
    answer.votes.push(newVote) // pushes vote into vote array
    await question.save()
    return res.status(201).json(question)
  } catch (error) {
    console.log(error) 
    return res.status(422).json({ message: error.message })
  }
}

