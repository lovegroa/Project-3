import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { secret } from '../config/environment.js'

export const registerUser = async (req, res) => {
  try {
    await User.create(req.body)
    return res.status(202).json({ message: 'Registration Successful' })
  } catch (error) {
    return res.status(422).json(error)
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const userToLogin = await User.findOne({ email: email })
    if (!userToLogin || !userToLogin.validatePassword(password)) {
      return res.status(401).json({ message: 'Unauthorised' })
    }
    const token = jwt.sign({ sub: userToLogin._id }, secret, {
      expiresIn: '7 days'
    })
    return res
      .status(200)
      .json({ message: `Welcome back, ${userToLogin.username}`, token: token })
  } catch (error) {
    return res.status(404).json({ message: 'User not found' })
  }
}
