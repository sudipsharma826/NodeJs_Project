const { blogs } = require('../model/index');

exports.validUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // Current User ID
        const blogId = req.params.id; // Blog ID
        
        // Fetch blog data
        const data = await blogs.findByPk(blogId);
        if (!data) {
            req.flash('error', 'Blog not found.');
            return res.redirect('/blogs'); // Redirect if blog is not found
        }
        
        const blogUserId = data.registerId;
        
        // Check if the current user owns the blog
        if (blogUserId !== userId) {
            req.flash('error', 'Access Denied. You do not have permission to edit this blog.');
            return res.redirect('/blogs'); // Redirect if access is denied
        }

        // If user is valid, proceed to next middleware
        next();
    } catch (error) {
        // Handle any other unexpected errors
        req.flash('error', 'An error occurred while validating user.');
        return res.redirect('/blogs'); // Redirect in case of an error
    }
};
