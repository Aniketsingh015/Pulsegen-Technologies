const Video = require('../models/Video');

// @desc    Upload a video
// @route   POST /api/videos/upload
// @access  Private
const uploadVideo = async (req, res) => {
    try {
        const { title, description } = req.body;

        // req.files is set by multer
        // We expect fields 'video' and 'thumbnail'
        const videoFile = req.files['video'] ? req.files['video'][0] : null;
        const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

        if (!videoFile) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const video = await Video.create({
            user: req.user._id,
            title,
            description,
            videoUrl: videoFile.path,
            thumbnailUrl: thumbnailFile ? thumbnailFile.path : null,
            status: 'pending'
        });

        res.status(201).json(video);

        // --- Mock Content Analysis Start ---
        const io = req.app.get('socketio');

        // Notify processing started
        video.status = 'processing';
        await video.save();
        io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 0 });

        // Simulate processing steps with delays
        setTimeout(async () => {
            io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 30 });

            setTimeout(async () => {
                io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 70 });

                setTimeout(async () => {
                    // Random analysis result
                    const isSafe = Math.random() > 0.2; // 80% chance safe
                    video.status = isSafe ? 'safe' : 'flagged';
                    video.analysisResult = isSafe ? 'Content Safe' : 'Flagged for Sensitivity';

                    // Generate Mock Transcript
                    video.transcript = `[00:01] Welcome to the video stream app.
[00:05] This is a generated transcript for the video "${video.title}".
[00:10] In a real-world scenario, this text would be extracted using a speech-to-text model.
[00:15] For now, we are simulating the process to demonstrate the UI capability.
[00:20] The transcription process runs alongside the sensitivity analysis.
[00:25] Thank you for watching!`;

                    await video.save();

                    io.emit('video_status_update', {
                        videoId: video._id,
                        status: video.status,
                        progress: 100,
                        result: video.analysisResult
                    });
                }, 2000);
            }, 2000);
        }, 2000);
        // --- Mock Content Analysis End ---
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find({}).populate('user', 'name');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('user', 'name');
        if (video) {
            // Increment views
            video.views += 1;
            await video.save();
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        // Check if error is due to invalid ID format
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const video = await Video.findById(req.params.id);

        if (video) {
            // Check if user is owner
            if (video.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to edit this video' });
            }

            video.title = title || video.title;
            video.description = description || video.description;

            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Process existing video to generate transcript
// @route   POST /api/videos/:id/process
// @access  Private (Owner only)
const processVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (video) {
            // Check if user is owner
            if (video.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to process this video' });
            }

            res.json({ message: 'Processing started' });

            // --- Mock Content Analysis Start ---
            const io = req.app.get('socketio');

            // Notify processing started
            video.status = 'processing';
            await video.save();
            io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 0 });

            // Simulate processing steps with delays
            setTimeout(async () => {
                io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 30 });

                setTimeout(async () => {
                    io.emit('video_status_update', { videoId: video._id, status: 'processing', progress: 70 });

                    setTimeout(async () => {
                        // Random analysis result
                        const isSafe = Math.random() > 0.2; // 80% chance safe
                        video.status = isSafe ? 'safe' : 'flagged';
                        video.analysisResult = isSafe ? 'Content Safe' : 'Flagged for Sensitivity';

                        // Generate Mock Transcript
                        video.transcript = `[00:01] Welcome to the video stream app.
[00:05] This is a generated transcript for the video "${video.title}".
[00:10] In a real-world scenario, this text would be extracted using a speech-to-text model.
[00:15] For now, we are simulating the process to demonstrate the UI capability.
[00:20] The transcription process runs alongside the sensitivity analysis.
[00:25] Thank you for watching!`;

                        await video.save();

                        io.emit('video_status_update', {
                            videoId: video._id,
                            status: video.status,
                            progress: 100,
                            result: video.analysisResult
                        });
                    }, 2000);
                }, 2000);
            }, 2000);
            // --- Mock Content Analysis End ---

        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadVideo,
    getVideos,
    getVideoById,
    updateVideo,
    processVideo,
};
