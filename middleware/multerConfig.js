// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         try {
//             const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//             if (!allowedFileTypes.includes(file.mimetype)) {
//                 // Use flash message to send an error
//                 req.flash('error', 'File Type Not Allowed');
//                 return cb(new Error('File Type Not Allowed'));
//             }
//             cb(null, './public/images');
//         } catch (error) {
//             req.flash('error', 'An error occurred while uploading the file');
//             cb(error);
//         }
//     },
//     filename: function (req, file, cb) {
//         try {
//             cb(null, Date.now() + '-' + file.originalname);
//         } catch (error) {
//             req.flash('error', 'Error occurred while setting file name');
//             cb(error);
//         }
//     }
// });

// module.exports = {
//     multer,
//     storage
// }; ( this is the code to configuration of the iamges to store in the local server)

//Now we are upgrading the storage to store the images in the cloudinary server
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET    // Your Cloudinary API secret
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'node-cms', // Specify a folder in Cloudinary to store the images
        public_id: (req, file) => {
        const originalName= file.originalname.split('.')[0];
        return Date.now() + '-' + originalName // Generate a unique filename using timestamp
        }
    }
});

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        try {
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedFileTypes.includes(file.mimetype)) {
                // Use flash message to send an error
                req.flash('error', 'File Type Not Allowed');
                return cb(new Error('File Type Not Allowed'));
            }
            cb(null, true);
        } catch (error) {
            req.flash('error', 'An error occurred while uploading the file');
            cb(error);
        }
    }
});

// Export the upload middleware
module.exports = {
    upload
};


