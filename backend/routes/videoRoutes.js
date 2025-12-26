const express = require('express');
const router = express.Router();
const {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    processVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getVideos);

router.route('/upload')
    .post(protect, upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), uploadVideo);

router.route('/:id')
    .get(getVideoById)
    .put(protect, updateVideo);

router.route('/:id/process')
    .post(protect, processVideo);

module.exports = router;
