// Import packages
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

// Define user schema
const { Schema } = mongoose
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, maxlength: 16 },
    admin: { type: Boolean, default: false },
    password: { type: String, required: true },
    hidden: { type: String, default: false },
    categories: [{ type: String }]
  },
  {
    timestamps: true
  }
)

userSchema.virtual('ownedQuestions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.virtual('ownedAnswers', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'answers.owner'
})

userSchema.virtual('ownedVotes', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'answers.votes.owner'
})

userSchema.set('toJSON', {
  virtuals: true,

  transform(_doc, json) {
    delete json.password
    return json
  }
})

// passwordConfirmation virtual field
userSchema.virtual('passwordConfirmation').set(function (passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation
})

// custom password validation function (pre-validate hook)
userSchema.pre('validate', function (next) {
  if (
    this.isModified('password') &&
    this.password !== this._passwordConfirmation
  ) {
    this.invalidate('passwordConfirmation', 'Passwords do not match')
  }
  next()
})

// custom password hashing function (pre-save hook)
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  }
  next()
})

// unique validator plugin
userSchema.plugin(uniqueValidator)

// password validation at login
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

export default mongoose.model('User', userSchema)
