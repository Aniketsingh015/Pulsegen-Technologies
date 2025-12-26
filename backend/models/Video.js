const mongoose = require('mongoose');

const videoSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'General'
        },
        videoUrl: {
            type: String, // Path to the video file
            required: true,
        },
        thumbnailUrl: {
            type: String,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'safe', 'flagged'],
            default: 'pending',
        },
        analysisResult: {
            type: String, // e.g., "Contains violence", "Safe content"
            default: '',
        },
        transcript: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
