import mongoose from 'mongoose'

const { Schema } = mongoose

const voteSchema = new Schema(
  {
    owner: { type: mongoose.ObjectId, ref: 'User', required: false },
    ipAddress: { type: String, required: true },
  },
  { timestamps: true }
)

const answerSchema = new Schema(
  {
    answerText: { type: String, required: true, maxlength: 500 },
    owner: { type: mongoose.ObjectId, ref: 'User', required: true },
    votes: [voteSchema],
    hidden: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true, maxlength: 30 },
    owner: { type: mongoose.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
    categories: { type: Array, required: false },
    hidden: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

answerSchema.virtual('voteCount').get(function () {
  return this.votes.length
})

export default mongoose.model('Question', questionSchema)
