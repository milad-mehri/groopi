const User = require('./models/user')

async function createUser (username, password, email) {
    if(!username || !password || !email) return undefined;
    let user = await new User({
        username: username,
        password: password,
        email: email
    })

    console.log(user)
    user.save()

    return user
}

async function fetchUser (username) {
    if(!username) return undefined;
    
}

async function updateUser (username, thingToSet, value) {
    
}

module.exports = {
    createUser,
    fetchUser,
    updateUser
}
