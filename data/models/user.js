const mongoose = require("mongoose")

const reqString = {
    type: String,
    required: true
}

const unReqString = {
    type: String,
    required: false
}

const user = mongoose.Schema({
    username: reqString,
    email: reqString,
    password: reqString,
    timeStamp: {
        type: Date, 
        default: Date.now
    }
    // bio: {
    //     type: String,
    //     required: true,
    //     default: "I am a groopi user!"
    // }
    // pfp: reqString https://placekitten.com/128/128
})

module.exports = mongoose.model('user', user)