const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const domains = [
    "Web Development", "Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity",
    "Blockchain", "Cloud Computing", "DevOps", "Mobile App Dev", "Game Development",
    "UI/UX Design", "Product Management", "Digital Marketing", "SEO", "Content Creation",
    "Video Editing", "Graphic Design", "Photography", "Music Production", "Animation",
    "Automotive", "Electric Vehicles", "Space Exploration", "Robotics", "Drones",
    "Cooking", "Baking", "Vegan Recipes", "Fitness", "Yoga",
    "Mental Health", "Personal Finance", "Investing", "Real Estate", "Crypto Trading",
    "Travel", "Adventure Sports", "History", "Philosophy", "Psychology",
    "Physics", "Mathematics", "Chemistry", "Biology", "Environment",
    "Education", "Language Learning", "DIY & Crafts", "Home Improvement", "Gardening"
];

// HIGH CONFIDENCE VIDEO LIST
// Using highly reliable, embeddable videos from official channels or Creative Commons
const safeVideos = {
    tech: [
        "https://www.youtube.com/watch?v=W6NZfCO5SIk", // Blender Foundation (Big Buck Bunny, etc)
        "https://www.youtube.com/watch?v=aqz-KE-bpKQ", // Big Buck Bunny
        "https://www.youtube.com/watch?v=gC_L9qAHz9k", // Google I/O intro style
    ],
    nature: [
        "https://www.youtube.com/watch?v=LXb3EKWsInQ", // 4K Nature
        "https://www.youtube.com/watch?v=t5J6aK0c_tY", // 4K Cities
    ],
    coding: [
        "https://www.youtube.com/watch?v=F3z1N48C4AE", // HTML Crash Course
        "https://www.youtube.com/watch?v=pkdgV05BrRI", // CSS Crash Course
    ]
};

const getVideoForDomain = (domain) => {
    // Map domains to categories
    if (["Web Development", "Artificial Intelligence", "DevOps", "Cybersecurity"].includes(domain)) {
        return safeVideos.coding[Math.floor(Math.random() * safeVideos.coding.length)];
    }
    if (["Nature", "Environment", "Travel", "History"].includes(domain)) {
        return safeVideos.nature[Math.floor(Math.random() * safeVideos.nature.length)];
    }
    // Default to the most generic safe tech/nature mix
    const all = [...safeVideos.tech, ...safeVideos.nature];
    return all[Math.floor(Math.random() * all.length)];
};

const seedData = async () => {
    await connectDB();

    try {
        let user = await User.findOne({ email: 'admin@community.com' });
        if (!user) {
            user = await User.create({
                name: 'Community Admin',
                email: 'admin@community.com',
                password: 'password123',
                isAdmin: true
            });
            console.log('Created Admin User');
        }

        // Clean up previous seed data (based on email)
        const deleted = await Video.deleteMany({ user: user._id });
        console.log(`Cleared ${deleted.deletedCount} old admin videos`);

        const videosToInsert = [];

        domains.forEach(domain => {
            // Reduced count to ensure quality over quantity
            for (let i = 1; i <= 2; i++) {
                const videoUrl = getVideoForDomain(domain);
                videosToInsert.push({
                    user: user._id,
                    title: `Amazing ${domain} Demo ${i}`,
                    description: `Experience the best in ${domain}. A curated video for our community members.`,
                    videoUrl: videoUrl,
                    thumbnailUrl: null,
                    category: domain,
                    status: 'safe',
                    analysisResult: 'Content Safe',
                });
            }
        });

        await Video.insertMany(videosToInsert);
        console.log(`Seeded ${videosToInsert.length} RELIABLE YouTube videos across ${domains.length} domains.`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
