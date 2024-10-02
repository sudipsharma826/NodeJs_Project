const express = require("express");
const router = express.Router();

// Multer for file upload
// const { multer, storage } = require('../middleware/multerConfig');
// const upload = multer({ storage });( Previous code to store the images in the local server)
//New Code to store the images in the cloudinary server
const {upload} = require('../middleware/multerConfig');

// Import controllers and middleware
const { 
    createRender, 
    createBlog, 
    singleBlogRender, 
    editBlogRender, 
    editBlog, 
    deleteBlog, 
    myBlogsRender 
} = require("../controller/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { validUser } = require("../middleware/vaildUser");
const verifyRole = require("../middleware/verifyRole");


// Create Blog Routes
router.route('/create')
    .get(isAuthenticated, createRender)
    .post(isAuthenticated,verifyRole(['admin','user']), upload.single('image'),createBlog);

// Single Blog Routes
router.route('/blog/:id')
    .get(singleBlogRender);

// Edit Blog Routes
router.route('/edit/:id/').get(isAuthenticated, validUser,editBlogRender);
//Edit blog post route
router.route('/edit/:id/:title').post(isAuthenticated, validUser, upload.single('image'), editBlog);

// Delete Blog Routes
router.route('/delete/:id/:title')
    .get(isAuthenticated, validUser, deleteBlog);


// Handle My Blogs Path
router.route('/myBlogs')
    .get(isAuthenticated, myBlogsRender);

module.exports = router;
