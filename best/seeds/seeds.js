import mongoose from 'mongoose'
import questionData from './data/questions.js'
import { dbURI } from '../config/environment.js'
import Question from '../models/question.js'
import userData from './data/users.js'
import User from '../models/user.js'

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI)
    console.log('🚀 Database Connected')

    await mongoose.connection.db.dropDatabase()
    console.log('👌 Database dropped')

    const users = await User.create(userData)

    const questionsWithOwners = questionData.map((question) => {
      const answersWithOwners = question.answers.map((answer) => {
        return {
          ...answer,
          owner: users[Math.floor(Math.random() * users.length)]._id,
        }
      })

      return {
        ...question,
        owner: users[Math.floor(Math.random() * users.length)]._id,
        answers: [...answersWithOwners],
      }
    })

    const questionsAdded = await Question.create(questionsWithOwners)
    console.log(`🌱 Seeded database with ${questionsAdded.length} questions`)

    await mongoose.connection.close()
    console.log('well bye then')
  } catch (error) {
    await mongoose.connection.close()
    console.log(error)
  }
}

seedDatabase()
