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

// Anonymous user votes on answer

// check if IP answers a question - check there isn't already an answers - delete the previous answer and create a new answer


// Logged-in user votes on an answer
// Ensures user can only have a single vote - deletes any existing votes and then creates a new one
export const addVote = async (req,res) => {
  try {
    const { questionId } = req.params
    const question = await Question.findById(questionId) // find question
    if (!question) throw new Error ('Question not found') // check question exists
    if (!question.answers) throw new Error ('Question does not yet have any answers') // check there are answers
    // check to see if the user has any existing answers
    let previousAnswers = []
    const answerArray = question.answers.forEach(answer => {
      const voteFound = answer.votes.find(vote => {
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


