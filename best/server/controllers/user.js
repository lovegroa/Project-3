import User from '../models/user.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id)
      .populate('ownedQuestions')
      .populate('ownedAnswers')
      .populate('ownedVotes')
    if (!user) throw new Error('User not found')
    return res.status(200).json(user)
  } catch (error) {
    return res.status(401).json({ message: error })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.currentUser._id)
    if (!user) throw new Error('User not found')
    Object.assign(user, req.body)
    await user.save()
    return res.status(202).json(user)
  } catch (err) {
    return res.status(404).json(err.message)
  }
}
