const passport = require('passport');//Package to authenticate the user
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;//Google Strategy
let userProfile={};//To store the user profile  information that is given by the google  
//Serialize the user
passport.serializeUser((user, cb) => {
    cb(null, user);
});
//Deserialize the user
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});
//Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
    console.error(profile);
    userProfile=profile;
    return done(null, userProfile);
}));