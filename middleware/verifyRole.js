const verifyRole = (roles) => {
    return (req, res, next) => {
        const userRoles = req.user.role; // Assuming this is an array
        console.error(userRoles);
        if (!roles.includes(userRoles)) {
            //return res.status(403).json({ message: 'Access denied' });
            req.flash('error', 'Access Denied. You do not have permission to access this page.');
            return res.redirect('/'); // Redirect if access is denied
        }
        next();
    };
};
module.exports = verifyRole;

//And we will used this in the routes like this:
// router.get('/admin', verifyRole(['admin']), (req, res) => { ( array will be passed to verify the role)
//we are passing array as a single routes can be acess by the multiple roles.
//e.g
//router.route('/edit/:id/').get(isAuthenticated, validUser, verifyRole(['admin','user']),editBlogRender);