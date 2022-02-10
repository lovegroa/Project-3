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
