const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log('GoogleStrategy callback called');
  // Check if the email domain is of the specific college
  try {
    console.log('User profile:', profile);
    const emailDomain = profile.emails[0].value.split('@')[1];
    if (emailDomain === 'btech.nitdgp.ac.in') {
      console.log('User profile:', profile);
      cb(null, profile);
    } else {
      console.log('Invalid email domain:', emailDomain);
      cb(new Error('Invalid email domain'));
    }
  } catch (error) {
    console.error('Error in GoogleStrategy callback:', error);
  }
}
));
