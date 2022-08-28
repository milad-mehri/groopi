const mongoose = require("mongoose")
require("dotenv").config()

const mongoURI = process.env.MONGOURI

async function mongo() {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    console.log("Mongo great success!")

    return mongoose
}

module.exports = mongo