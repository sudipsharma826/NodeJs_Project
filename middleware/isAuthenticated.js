const jwt = require('jsonwebtoken');
const { promisify } = require('util'); //Node JS Build-In CallBack Function
const { registers } = require('../model/index');
const { decryptToken } = require('../service/decryptToken');

// Middleware for checking if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    try {
        // Get the token from the request header
        const token = req.cookies.token;
        
        // Check if token exists
        if (!token) {
            req.flash('error', 'Authentication token is missing. Please login.');
            return res.redirect("/login");
        }

        // Verify the token
        const decodedResult = await decryptToken(token, process.env.JWT_SECRET);
        // console.log(decodedResult);

        // Check if the user with the id exists or not
        const userExists = await registers.findByPk(decodedResult.id);

        // If user does not exist
        if (!userExists) {
            req.flash('error', 'User not found. Please login again.');
            return res.redirect("/login");
        }

        // If user exists, attach user to request object and move to the next middleware
        req.user = userExists;
        next();

    } catch (error) {
        // Handle errors that might occur during token verification or user lookup
        console.error(error);
        req.flash('error', 'Authentication failed. Please try again.');
        return res.redirect("/login");
    }
};
