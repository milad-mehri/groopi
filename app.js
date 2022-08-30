// setup .env
require("dotenv").config()

// express
const express = require('express')
const app = express()

// auth
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieSession = require('cookie-session')
const cors = require('cors')

// db
const mongoose = require("mongoose")
const User = require('./models/user')

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// ejs
const ejs = require('ejs')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

// bodyParser
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// use cors
app.use(
  cors({
    origin: process.env.SERVER_ROOT,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true
  })
)

// setup cookieSession
app.use(cookieSession({
  // 1 day = 24 hr * 60 min/hr * 60 s/min * 1000 ms/s
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}))

// setup passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_ROOT + "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {

    // check if user already exists in our own db
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser){

        // already have this user
        done(null, currentUser);
      } else {

        // if not, create user
        new User({
          googleId: profile.id,
          name: profile._json.given_name,
          screenName: profile.displayName,
          profileImage: profile._json['picture'],
          email: profile._json.email
        }).save().then((newUser) => {
          done(null, newUser);
        });
      }
    });
  }
));

// check if user logged in (middleware)
const checkUserLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
}

// index
app.get('/', async (req, res) => {
    res.render('index', {user: req.user})
})

// login fail
app.get('auth/login/failed', async (req, res) => {
  res.render('index')
})

// login success, return cookie and user
app.get('auth/login/success', checkUserLoggedIn, async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    })
  }
})

// authentication
app.get(
  '/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

app.get(
  '/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: 'auth/login/failed'}),
  async (req, res) => {
    res.redirect(process.env.SERVER_ROOT)
  }
)

app.get('/logout', checkUserLoggedIn, async (req, res) => {
  req.logout();
  res.redirect(process.env.SERVER_ROOT);
})

// profile page
app.get('/profile', checkUserLoggedIn, async (req, res) => {
  console.log(req.user)
  res.render('profile', {user: req.user})
})

// listen
app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${process.env.PORT || 3000}`)
})

