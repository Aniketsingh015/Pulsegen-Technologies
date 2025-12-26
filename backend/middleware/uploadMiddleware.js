const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === 'video') {
            cb(null, 'uploads/videos/');
        } else if (file.fieldname === 'thumbnail') {
            cb(null, 'uploads/thumbnails/');
        }
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mov|avi|mkv/i;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    // Mimetype check can be tricky across OS/Browsers, so we rely mainly on extension for this demo
    // or we can make the regex more permissive.
    const mimetype = true; // filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images and Videos only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
