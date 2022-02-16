import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.js'

// Controllers
import {
  getQuestions,
  addQuestion,
  getQuestion,
  addVote,
  deleteVote,
  addAnswer,
  hideQuestion,
  hideAnswer,
  getSearchResults
} from '../controllers/questions.js'
import { getProfile, updateProfile } from '../controllers/user.js'
import { secureRoute, secureRouteForVotes } from './secureRoute.js'

const router = express.Router()

// *** Question routes ***

router.route('/questions/').get(getQuestions) // View questions

router.route('/questions/:searchTerm').get(getSearchResults) // Filtered questions based on search

router.route('/questions/add').post(secureRoute, addQuestion) // Add a new question

router
  .route('/question/:questionId')
  .get(getQuestion) // View answers !!!should this just return the whole question inc the answer array?!!!
  .delete(secureRoute, hideQuestion) // User deletes (hides) their own question

router
  .route('/question/:questionId/answers/:answerId')
  .post(secureRouteForVotes, deleteVote, addVote) // Logged-in or anon users can vote on answers (one vote only)
  .delete(secureRoute, hideAnswer) // User deletes (hides) their own question AL

router
  .route('/question/:questionId/answers/:answerId/:voteId')
  .delete(secureRouteForVotes, deleteVote)

router.route('/question/:questionId/answers').post(secureRoute, addAnswer) // Add answer to a question AL

// ** User routes ***
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router
  .route('/profile')
  .get(secureRoute, getProfile)
  .put(secureRoute, updateProfile) // update user profile (e.g. password, email or delete/hide profile) AL

// Superuser routes
// To be added

export default router
