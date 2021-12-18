var passport = require('passport');

const googlePassport = passport;

require("dotenv").config();

const { v4: uuidv4 } = require('uuid');

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;;

const User = require('../models/user.model');

const {newToken} = require('../controllers/auth.controller');

const { BACKEND_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const url = `${BACKEND_URL}`;

googlePassport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${url}/auth/google/callback`,
  },
  async function(accessToken, refreshToken, profile, done) {
    let user = await User.findOne({email: profile?._json?.email});

    if(!user){
        user = await User.create({
          email: profile?._json?.email,
          password: uuidv4()
        });
    }
    const token = newToken(user);
    return done(null, {user, token});
  }
));

module.exports = googlePassport;