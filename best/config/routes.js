import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.js'

// Controllers
import { 
  getQuestions, 
  addQuestion, 
  getQuestion, 
  addVote, 
  deleteVote, 
  addAnonVote,
  deleteAnonVote,
  addAnswer,
  hideQuestion
} from '../controllers/questions.js'
import { getProfile } from '../controllers/user.js'
import { secureRoute } from './secureRoute.js'

const router = express.Router()

// *** Question routes ***

router.route('/questions').get(getQuestions) // View questions

router.route('/questions/add').post(secureRoute, addQuestion) // Add a new question

router.route('/questions/:questionId')
  .get(getQuestion) // View answers !!!should this just return the whole question inc the answer array?!!!
  .delete(secureRoute, hideQuestion) // User deletes (hides) their own question

router.route('/questions/:questionId/answers/:answerId')
  .post(secureRoute, deleteVote, addVote) // Logged-in user can vote on answers (one vote only)
  .put(deleteAnonVote, addAnonVote) // Anonymous user can vote on answers (one vote only)

router.route('/questions/:questionId/answers').post(secureRoute, addAnswer) // Add answer to a question AL

// ** User routes ***
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/profile').get(secureRoute, getProfile)
// .put(secureRoute, ) // update user profile (e.g. password, email or delete/hide profile) AL

// Superuser routes
// To be added

export default router
