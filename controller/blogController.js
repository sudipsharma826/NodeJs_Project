const { blogs, registers } = require("../model/index");
const fs = require('fs'); // File System
const { QueryTypes } = require('sequelize');
const {sequelize}= require('../model/index');
const cloudinary = require('cloudinary').v2;


// Create Render Request
exports.createRender = (req, res) => {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('createBlog.ejs', { error, success });
};

// Create Blog Request
exports.createBlog = async (req, res) => {
    try {
        const userId = req.user.id; // Coming from the middleware (isAuthenticated.js)
        console.error("User ID: " + userId);
        const { title, subtitle, description } = req.body;
        // const image = req.file ? req.file.filename : null; ( in localserver we are storing the images name in the database)
        const image = req.file ? req.file.path : null; // ( in Cloudinary we are storing the images path in the cloudinary server)
        

        // 1. Create user-specific table dynamically
        await sequelize.query(
            `CREATE TABLE IF NOT EXISTS blog_${userId} (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                title VARCHAR(255),
                subtitle VARCHAR(255),
                description VARCHAR(255),
                registerId INT,
                image VARCHAR(255),
                FOREIGN KEY (registerId) REFERENCES registers(id)
            )`,
            { type: QueryTypes.CREATE }
        );

        // 2. Insert data into user's blog table
        await sequelize.query(
            `INSERT INTO blog_${userId} (title, subtitle, description, image, registerId) VALUES (?, ?, ?, ?, ?)`,
            {
                type: QueryTypes.INSERT,
                replacements: [title, subtitle, description, image, userId]
            }
        );

        // 3. Insert data into the main blogs table (for the admin's view)
        await blogs.create({
            title,
            subtitle,
            description,
            image,
            registerId: userId
        });

        // 4. Flash success message and redirect
        req.flash('success', 'Blog created successfully');
        res.redirect('/');
    } catch (err) {
        console.error("Error creating blog: " + err.message);
        req.flash('error', 'Something Went Wrong.ok');
        res.redirect('/create');
    }
};


// Single Blog Request
exports.singleBlogRender = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogs.findByPk(blogId, {
            include: { model: registers }
        });

        const error = req.flash('error');
        const success = req.flash('success');
        res.render('singleBlog.ejs', { blog, error, success });
    } catch (err) {
        console.error("Error fetching single blog: " + err.message);
        req.flash('error', 'Something Went Wrong');
        res.redirect('/');
    }
};

// Delete Blog Request
exports.deleteBlog = async (req, res) => {
    try {
        const userId = req.user.id; // From middleware validUser.js
        const blogId = req.params.id;
        const blogTitle = req.params.title; // Decode the title

        // Check if the blog exists in the user's specific table
        const blogInUserTable = await sequelize.query(
            `SELECT * FROM blog_${userId} WHERE registerId = ? AND title = ?`,
            {
                type: QueryTypes.SELECT,
                replacements: [userId, blogTitle]
            }
        );

        if (blogInUserTable.length === 0) {
            req.flash('error', 'Blog not found in your table');
            return res.redirect('/');
        }

        // Proceed with deletion from the user's specific blog table
        await sequelize.query(
            `DELETE FROM blog_${userId} WHERE registerId = ? AND title = ?`,
            {
                type: QueryTypes.DELETE,
                replacements: [userId, blogTitle]
            }
        );

        // Proceed with deletion from the main blogs table if the blog exists there
        await blogs.destroy({ where: { id: blogId, registerId: userId } });

        req.flash('success', 'Blog deleted successfully');

        // Assuming image filename is stored in blogInUserTable[0].image
        // const imagePath = `public/images/${blogInUserTable[0].image}`;
        // fs.unlink(imagePath, (err) => {
        //     if (err) {
        //         console.error("Error deleting image: " + err.message);
        //     } else {
        //         console.log("Image deleted successfully");
        //     }
        // }); ( This was the iamge removing from the local server)
        // (The image is stored in the cloudinary server so we have to remove the image from the cloudinary server)
        console.log("Image Path: " + blogInUserTable[0].image);
        const imageId = blogInUserTable[0].image.split('/').slice(-2).join('/').split('.')[0].replace(/%20/g, ' ');
        console.error("Image ID: " + imageId);
        await cloudinary.uploader.destroy(imageId, (error, result) => {
            if (error) {
                console.error("Error deleting image: " + error.message);
                req.flash('error', 'Error deleting image');
            } else {
                console.log("Image deleted successfully",result);
            }
        });

        res.redirect('/');
    } catch (err) {
        console.error("Error deleting blog: " + err.message);
        req.flash('error', 'Something Went Wrong');
        res.redirect('/');
    }
};



// Edit Blog Render Request
// Render Edit Blog Page
exports.editBlogRender = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogs.findByPk(blogId);
        
        const error = req.flash('error');
        const success = req.flash('success');
        res.render('editBlog.ejs', { blog, error, success });
    } catch (err) {
        console.error("Error rendering edit blog page: " + err.message);
        req.flash('error', 'Something Went Wrong');
        res.redirect('/');
    }
};

// Edit Blog Request
exports.editBlog = async (req, res) => {
    try {
        const { title, subtitle, description } = req.body; // Get updated blog data from the request body
        const userId = req.user.id; // Get user ID from the middleware
        const blogTitle = req.params.title; // Decode the title from the URL
        const blogId = req.params.id; // Get blog ID from the URL
        const updateData = { title, subtitle, description }; // Prepare data for update

        // Add image if a new file is uploaded
        if (req.file) {
            // Store the new image path for updating the blog
            // updateData.image = req.file.filename; // This is the new image path (stored in local server)
            updateData.image = req.file.path; // This is the new image path (stored in Cloudinary)

            // Find the old blog data to delete the old image
            const oldData = await blogs.findByPk(blogId);
            const oldImagePath = oldData.image; // Get the old image URL
console.error("Old Image Path: " + oldImagePath);
            // Extract the public ID from the old image URL
            const oldImagePublicId = oldImagePath.split('/').slice(-2).join('/').split('.')[0].replace(/%20/g, ' '); // Get public ID without extension
            console.error("Old Image Public ID: " + oldImagePublicId);

            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
                if (error) {
                    console.error("Error deleting old image: " + error.message);
                    req.flash('error', 'Error deleting old image');
                } else {
                    console.log("Old image deleted successfully", result);
                }
            });
        }

        // Update Blog Using Raw Query in the user-defined table
        // Conditionally include the image field in the update only if a new file is uploaded
        const query = `
            UPDATE blog_${userId} 
            SET title = ?, subtitle = ?, description = ? ${req.file ? ', image = ?' : ''}
            WHERE registerId = ? AND title = ?`;

        const replacements = req.file 
            ? [title, subtitle, description, updateData.image, userId, blogTitle] 
            : [title, subtitle, description, userId, blogTitle];

        // Execute the update query
        await sequelize.query(query, {
            type: QueryTypes.UPDATE,
            replacements: replacements
        });

        // Update the blog in the global blogs table
        await blogs.update(updateData, { where: { id: blogId } });

        // Set success flash message and redirect
        req.flash('success', 'Blog updated successfully');
        res.redirect('/');
    } catch (err) {
        console.error("Error updating blog: " + err.message);
        req.flash('error', 'Something Went Wrong');
        res.redirect(`/edit/${req.params.id}`);
    }
};



// Handle My Blogs Page
exports.myBlogsRender = async (req, res) => {
    try {
        const userId = req.user.id;
        const datas = await blogs.findAll({
            where: { registerId: userId },
            include: { model: registers }
        });

        const error = req.flash('error');
        const success = req.flash('success');
        res.render('myBlogs.ejs', { blogs: datas, error, success });
    } catch (err) {
        console.error("Error fetching user blogs: " + err.message);
        req.flash('error', 'Something Went Wrong');
        res.redirect('/');
    }
};
