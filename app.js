const express = require('express')
const app = express()
const server = require('http').createServer(app)

const ejs = require('ejs')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    res.render('index')
})

server.listen(3000, function () {
    console.log("Listening on port 3000")
})