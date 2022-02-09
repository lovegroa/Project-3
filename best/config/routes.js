import express from 'express'

// *** WORK IN PROGRESS ***

// Controllers
// To be added

const router = express.Router()

// *** Question routes ***

router.route('/questions')
// .get() // View questions

router.route('/questions/add')
// .post(secureRoute, ) // Add a new question

router.route('/questions/:questionId')
// .get() // View answers
// .post() // Vote on answers

router.route('/questions')

// User routes
router.route('/register')
// .post()

router.route('/login')
// .post()

// Superuser routes
// To be added

export default router
