const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  googleId: {
    type: String, 
    required: true, 
    unique: true
  },
  screenName: {type: String},
  name: {type: String},
  email: {type: String},
  profileImage: {type: String},
  type: {type: String}
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel