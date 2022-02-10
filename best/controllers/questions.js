import Question from '../models/question.js'
import User from '../models/user.js'

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
export const getAnswers = async (req, res) => {
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

// Logged-in user posts a question
export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId)
    if (!question) throw new Error('Question not found')
    question.answers.push({ ...req.body, owner: req.currentUser._id })
    await question.save()
    return res.status(201).json(question.answers[question.answers.length - 1])
  } catch (error) {
    return res.status(422).json({ message: error.message })
  }
}

// Anonymous user votes on answer

// check if IP answers a question - check there isn't already an answers - delete the previous answer and create a new answer

// Logged-in user votes on an answer
// Ensures user can only have a single vote - deletes any existing votes and then creates a new one
export const addVote = async (req, res) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId) // find question
    if (!question) throw new Error('Question not found') // check question exists
    if (!question.answers)
      throw new Error('Question does not yet have any answers') // check there are answers
    // check to see if the user has any existing answers
    let previousAnswers = []
    const answerArray = question.answers.forEach((answer) => {
      const voteFound = answer.votes.find((vote) => {
        if (vote.owner) {
          return vote.owner.equals(req.currentUser._id)
        }
      })
      if (voteFound) {
        previousAnswers.push(...voteFound)
      }
    })
    console.log('previous Answers', previousAnswers)

    console.log(hasUserVoted)
    if (hasUserVoted) {
      await hasUserVoted.remove() // delete existing vote
    }

    const newVote = { owner: req.currentUser._id } // populates the owner field
    question.answers.votes.push(newVote) // pushes vote into vote array
    await question.save()
    return res.status(201).json(question)
  } catch (error) {
    console.log(error)
    return res.status(422).json({ message: error.message })
  }
}
