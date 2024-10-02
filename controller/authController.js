const { registers } = require("../model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../service/nodemailer");
//const generator = require('generate-password');

// Register Render Request
exports.registerRender = (req, res) => {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('registerUser.ejs', { error, success });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const image = req.file ? req.file.path : null; // Get the image path from the uploaded file


        const existingUser = await registers.findOne({ where: { email } });
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await registers.create({
            username,
            email,
            password: hashedPassword,
            userProfile:image,
            OauthId:null,
            authProviderL:username
        });

        req.flash('success', 'User registered successfully');
        res.redirect('/login');
        sendEmail({
            email,
            subject: 'Welcome to Blog Management System! Account Details',
            html:`
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
    <h2 style="color: #333;">Dear ${username},</h2>
    <p style="font-size: 16px; line-height: 1.5;">You have successfully registered on our platform.</p>
    <p style="font-size: 16px; line-height: 1.5;">Your account details are:</p>
    <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p style="font-size: 16px; line-height: 1.5;">You can now log in to your account.</p>
    <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
    <p style="font-size: 16px; line-height: 1.5;"><strong>Sudip Sharma Team</strong></p>
    <p style="font-size: 16px; line-height: 1.5;">
        <a href="https://nodeproject.sudipsharma.com.np" style="color: #007BFF;">Visit our website</a>
    </p>
</div>

            `
        });
              
    } catch (error) {
        console.error("Error during registration:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/register');
    }
};

// Login Render Request
exports.loginRender = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');
    res.render('loginUser.ejs', { success, error });
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await registers.findOne({ where: { email } });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('token', token);
            req.flash('success', 'Logged in successfully');
            return res.redirect('/');
        } else {
            req.flash('error', 'Invalid password');
            return res.redirect('/login');
        }

    } catch (error) {
        console.error("Error during login:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/login');
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        req.flash('success', 'Logged out successfully');
        return res.redirect('/login');
    } catch (error) {
        console.error("Logout error:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/logout');
    }
};

// Forget Password Render
exports.forgetPasswordRender = (req, res) => {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('forgetPassword.ejs', { error, success });
};

// Forget Password Logic
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            req.flash('error', 'Please provide an email');
            return res.redirect('/forgetPassword');
        }

        const userExists = await registers.findOne({ where: { email } });

        if (!userExists) {
            req.flash('error', 'User not found');
            return res.redirect('/forgetPassword');
        } else {
            const otpGeneration = Math.floor(1000 + Math.random() * 9000);
            sendEmail({
                email: userExists.email,
                subject: 'Password Reset',
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
    <h2 style="color: #333;">Dear ${userExists.username},</h2>
    <p style="font-size: 16px; line-height: 1.5;">You requested a password reset. Use the OTP below to verify your identity:</p>
    <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">OTP: ${otpGeneration}</p>
    <p style="font-size: 16px; line-height: 1.5;">If you did not request this, please contact support or ignore this email.</p>
    <p style="font-size: 16px; line-height: 1.5;">This OTP is valid for 2 minutes.</p>
    <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
    <p style="font-size: 16px; line-height: 1.5;"><strong>Sudip Sharma Team</strong></p>
    <p style="font-size: 16px; line-height: 1.5;">
        <a href="https://nodeproject.sudipsharma.com.np" style="color: #007BFF;">Visit our website</a>
    </p>
</div>
`
            });

            userExists.otp = otpGeneration;
            userExists.otpGeneratedTime = Date.now();
            await userExists.save();

            req.flash('success', 'OTP sent to your email');
            return res.redirect(`/otp?email=${userExists.email}`);
        }
    } catch (error) {
        console.error("Error during forget password:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/forgetPassword');
    }
};

// OTP Render
exports.otpRender = (req, res) => {
    const email = req.query.email;
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('otpForm.ejs', { email, error, success });
};

// OTP Validation
exports.otpValidation = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;

        const userExists = await registers.findOne({ where: { email } });

        if (!userExists) {
            req.flash('error', 'User not found');
            return res.redirect('/otp');
        }

        const currentTime = Date.now();
        if (userExists.otp === otp) {
            if (currentTime - userExists.otpGeneratedTime > 120000) { // OTP expires after 2 minutes
                req.flash('error', 'OTP expired');
                return res.redirect('/otp');
            }

            req.flash('success', 'OTP verified');
            return res.redirect(`/resetPassword?email=${email}&otp=${otp}`);
        } else {
            req.flash('error', 'Invalid OTP');
            return res.redirect('/otp');
        }
    } catch (error) {
        console.error("Error during OTP validation:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/otp');
    }
};

// Reset Password Render
exports.resetPasswordRender = (req, res) => {
    const email = req.query.email;
    const otp = req.query.otp;
    const error = req.flash('error');
    const success = req.flash('success');

    if (!email || !otp) {
        req.flash('error', 'Invalid request. Missing email or OTP.');
        return res.redirect('/forgetPassword');
    }

    res.render('resetPassword.ejs', { email, otp, error, success });
};

// Reset Password Logic
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email, otp } = req.params;

        const user = await registers.findOne({ where: { email, otp } });

        if (!user) {
            req.flash('error', 'Invalid request.');
            return res.redirect('/forgetPassword');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect(`/resetPassword?email=${email}&otp=${otp}`);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await registers.update(
            {
                password: hashedPassword,
                otp: null,
                otpGeneratedTime: null
            },
            { where: { email, otp } }
        );

        req.flash('success', 'Password reset successful. Please log in.');
        return res.redirect('/login');
    } catch (error) {
        console.error("Error during password reset:", error.message);
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/resetPassword');
    }
};
// Google Auth
exports.googleRegister = async (req, res) => {
    try { 
        if (!req.user) {
            req.flash('error', 'User data not available.');
            return res.redirect('/register');
        }

        const { id, displayName, emails, photos, provider } = req.user;

        // Extract user data from Google
        const username = displayName;
        const email = emails[0].value;
        const userProfileImage = photos[0].value;
        const OauthId = id;
        const authProvider = provider;

        // Check if the user already exists in the database
        let user = await registers.findOne({ where: { email } });
        
        if (!user) {
            // If the user doesn't exist, create a new record in the database
            user = await registers.create({
                username,
                email,
                userProfile: userProfileImage,
                OauthId,
                authProvider
            });

            await sendEmail({
                email,
                subject: '🎉 Welcome to the Blog Management System! 🎉',
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                    <h2 style="color: #333;">Dear ${username},</h2>
                    <p>We are thrilled to welcome you to our platform!</p>
                    <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Email ID: ${email}</p>
                    <p style="font-size: 16px; line-height: 1.5;">If you encounter any issues using our platform, please contact support.</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you,</p>
                    <p style="font-size: 16px; line-height: 1.5;"><strong>Sudip Sharma Team</strong></p>
                    <p style="font-size: 16px; line-height: 1.5;">
                        <a href="https://nodeproject.sudipsharma.com.np" style="color: #007BFF;">Visit our website</a>
                    </p>
                </div>
                `
            });
        }

        // Successful register, create a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Set the token in a cookie
        res.cookie('token', token); // Secure cookie setting
        req.flash('success', `Welcome, ${username}! You are now logged in.`);
        return res.redirect('/'); // Redirect to the home page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/register'); // Redirect to register on error
    }
};
