// Import packages
import express from 'express'
import mongoose from 'mongoose'
import router from './config/routes.js'
import { port, dbURI } from './config/environment.js'

// Environment variables
const app = express()

// Launch server

const launchServer = async () => {
  try {
    // Attempt mongoDB connection
    await mongoose.connect(dbURI)
    console.log('🥳 MongoDB connected')
    app.listen(port, () =>
      console.log(`🚀 Server spun up and listening on port ${port}`)
    )

    // *** Middleware ***
    // JSON parser
    app.use(express.json())

    app.set('trust proxy', true)

    // Logger
    app.use((req, _res, next) => {
      console.log(`Request received: ${req.method} - ${req.url}`)
      next()
    })

    // Routes
    app.use('/api', router)

    // Catch all
    app.use((req, res) => {
      console.log('catch all error in index.js ---->')
      return res.status(404).json({ message: 'Route not found' })
    })
  } catch (error) {
    console.log(error.message)
  }
}

launchServer()
