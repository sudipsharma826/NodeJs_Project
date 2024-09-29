const express = require("express");
const { registerRender, registerUser, loginRender, loginUser, logout,forgetPasswordRender, forgetPassword, otpRender, otpValidation, resetPasswordRender, resetPassword, googleRegister } = require("../controller/authController");
const router = express.Router();
const passport = require('passport');
const { google } = require('../middleware/passport');

//User Profile Image Hadler ]
// const { multer, storage } = require('../middleware/multerConfig');
// const upload = multer({ storage }); ( Previous code to store the images in the local server)
//New Code to store the images in the cloudinary server
const {upload} = require('../middleware/multerConfig');

//Register Routes
router.route('/register').get(registerRender).post(upload.single('image'),registerUser);

//Login Routes
router.route('/login').get(loginRender).post(loginUser);

//Logout Route
router.route('/logout').get(logout);

//Forget Password
router.route('/forgetPassword').get(forgetPasswordRender).post(forgetPassword)

//OTP Route
router.route('/otp').get(otpRender);

//OTP Routes With Email ( Post Method)
router.route('/otp/:email').post(otpValidation);

//Reset Password
router.route('/resetPassword').get(resetPasswordRender);

//Reset Password With Email ( Post Method)
router.route('/resetPassword/:email/:otp').post(resetPassword);

//Routes for Google Login
router.route('/auth/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));

//Routes for Google Callback
router.route('/auth/google/callback').get((req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/register' }, (err, user, info) => {
        if (err) {
            req.flash('error', 'Authentication error. Please try again.');
            return res.redirect('/register');
        }
        if (!user) {
            req.flash('error', 'No user returned from Google. Please register.');
            return res.redirect('/register');
        }

        // If authentication is successful, log the user in and proceed
        req.logIn(user, (err) => {
            if (err) {
                req.flash('error', 'Login failed. Please try again.');
                return res.redirect('/register');
            }

            // If login is successful, you can call your custom googleRegister function
            return googleRegister(req, res, next);  // Proceed to your custom function
        });
    })(req, res, next);  // Call authenticate middleware with req, res, next
});



module.exports = router;