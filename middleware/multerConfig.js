const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedFileTypes.includes(file.mimetype)) {
                // Use flash message to send an error
                req.flash('error', 'File Type Not Allowed');
                return cb(new Error('File Type Not Allowed'));
            }
            cb(null, './public/images');
        } catch (error) {
            req.flash('error', 'An error occurred while uploading the file');
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        try {
            cb(null, Date.now() + '-' + file.originalname);
        } catch (error) {
            req.flash('error', 'Error occurred while setting file name');
            cb(error);
        }
    }
});

module.exports = {
    multer,
    storage
};
