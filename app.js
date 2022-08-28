const express = require('express')
const app = express()
const server = require('http').createServer(app)

const db = require('./data/data')

const ejs = require('ejs')
const { application } = require('express')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

var bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

require('./data/mongo')()

app.get('/', async (req, res) => {
    res.render('index')
})

app.get('/signup', async (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req, res) => {
    let user = await db.createUser(
        req.body.username,
        req.body.password,
        req.body.email
    )

    return res.json(user)
})

server.listen(process.env.PORT || 3000, function () {
    console.log(`Listening on port ${process.env.PORT || 3000}`)
})
