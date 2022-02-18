import mongoose from 'mongoose'

const { Schema } = mongoose

const voteSchema = new Schema(
  {
    owner: { type: mongoose.ObjectId, ref: 'User', default: null },
    ipAddress: { type: String, required: true }
  },
  { timestamps: true }
)

const answerSchema = new Schema(
  {
    answerText: { type: String, required: true, maxlength: 500 },
    owner: { type: mongoose.ObjectId, ref: 'User', required: true },
    votes: [voteSchema],
    hidden: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
)

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true, maxlength: 30, unique: true },
    owner: { type: mongoose.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
    category: { type: String, required: false },
    hidden: { type: Boolean, required: true, default: false },
    imageUrl: { type: String, required: false }
  },
  { timestamps: true }
)

answerSchema.virtual('voteCount').get(function () {
  return this.votes.length
})

questionSchema.virtual('voteCount').get(function () {
  if (!this.answers.length) return 0
  const sum = this.answers.reduce((acc, answer) => {
    return acc + answer.votes.length
  }, 0)

  return sum
})

questionSchema.virtual('votesIn30Mins').get(function () {
  if (!this.answers.length) return 0
  const sum = this.answers.reduce((acc, answer) => {
    const votesIn30Mins = answer.votes.filter((vote) => {
      const d1 = new Date(vote.createdAt)
      const d2 = new Date()

      return d1.getTime() > d2.getTime() - 1000 * 60 * 30
    })

    return acc + votesIn30Mins.length
  }, 0)

  return sum
})

questionSchema.virtual('maxVotes').get(function () {
  let maxVotes = 0
  if (!this.answers.length) return maxVotes
  this.answers.forEach((answer) => {
    if (answer.votes.length > maxVotes) maxVotes = answer.votes.length
  })

  return maxVotes
})

questionSchema.set('toJSON', {
  virtuals: true
})

export default mongoose.model('Question', questionSchema)
