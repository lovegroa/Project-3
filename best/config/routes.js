import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.js'

// Controllers
import { getQuestions } from '../controllers/questions.js'
import { getProfile } from '../controllers/user.js'
import { secureRoute } from './secureRoute.js'

const router = express.Router()

// *** Question routes ***

router.route('/questions').get(getQuestions) // View questions

router.route('/questions/add')
// .post(secureRoute, ) // Add a new question

router.route('/questions/:questionId')
// .get() // View answers
// .post() // Anonymous user can vote on answers
// .post(secureRoute, ) // Logged-in user can vote on answers
// .put(secureRoute, ) // User deletes (hides) their own question

router.route('/questions/:questionId/addAnswer')
// .post(secureRoute, ) // Add answer to a question

// ** User routes ***
router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/profile').get(secureRoute, getProfile)
// .put(secureRoute, ) // update user profile (e.g. password, email or delete/hide profile)

// Superuser routes
// To be added

export default router
