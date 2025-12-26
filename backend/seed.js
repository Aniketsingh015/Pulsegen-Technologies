/**
 * SEED SCRIPT
 * Populates the database with sample YouTube videos across various domains.
 * Run this script to add community content to the database.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    category: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'safe' },
    analysisResult: String,
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

const sampleVideos = [
    // Web Development
    { title: "React Tutorial for Beginners", videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk", category: "Web Development" },
    { title: "Node.js Crash Course", videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", category: "Web Development" },
    { title: "CSS Grid in 100 Seconds", videoUrl: "https://www.youtube.com/watch?v=uuOXPWCh-6o", category: "Web Development" },
    { title: "JavaScript ES6 Features", videoUrl: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", category: "Web Development" },
    { title: "TypeScript Tutorial", videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs", category: "Web Development" },

    // Machine Learning
    { title: "Machine Learning Basics", videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU", category: "Machine Learning" },
    { title: "Neural Networks Explained", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", category: "Machine Learning" },
    { title: "TensorFlow in 10 Minutes", videoUrl: "https://www.youtube.com/watch?v=tPYj3fFJGjk", category: "Machine Learning" },
    { title: "PyTorch Tutorial", videoUrl: "https://www.youtube.com/watch?v=c36lUUr864M", category: "Machine Learning" },
    { title: "Deep Learning Fundamentals", videoUrl: "https://www.youtube.com/watch?v=VyWAvY2CF9c", category: "Machine Learning" },

    // Data Science
    { title: "Python for Data Science", videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", category: "Data Science" },
    { title: "Pandas Tutorial", videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", category: "Data Science" },
    { title: "Data Visualization with Python", videoUrl: "https://www.youtube.com/watch?v=a9UrKTVEeZA", category: "Data Science" },
    { title: "SQL for Data Analysis", videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY", category: "Data Science" },
    { title: "Statistics for Data Science", videoUrl: "https://www.youtube.com/watch?v=xxpc-HPKN28", category: "Data Science" },

    // Mobile Development
    { title: "React Native Tutorial", videoUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc", category: "Mobile Development" },
    { title: "Flutter Crash Course", videoUrl: "https://www.youtube.com/watch?v=1gDhl4leEzA", category: "Mobile Development" },
    { title: "Swift for iOS Development", videoUrl: "https://www.youtube.com/watch?v=comQ1-x2a1Q", category: "Mobile Development" },
    { title: "Kotlin Android Tutorial", videoUrl: "https://www.youtube.com/watch?v=F9UC9DY-vIU", category: "Mobile Development" },
    { title: "Mobile App Design Principles", videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", category: "Mobile Development" },

    // Cloud Computing
    { title: "AWS Basics for Beginners", videoUrl: "https://www.youtube.com/watch?v=ulprqHHWlng", category: "Cloud Computing" },
    { title: "Docker Tutorial", videoUrl: "https://www.youtube.com/watch?v=fqMOX6JJhGo", category: "Cloud Computing" },
    { title: "Kubernetes Explained", videoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do", category: "Cloud Computing" },
    { title: "Google Cloud Platform", videoUrl: "https://www.youtube.com/watch?v=4D3X6Xl5c_Y", category: "Cloud Computing" },
    { title: "Azure Fundamentals", videoUrl: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", category: "Cloud Computing" },

    // Cybersecurity
    { title: "Ethical Hacking Course", videoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", category: "Cybersecurity" },
    { title: "Network Security Basics", videoUrl: "https://www.youtube.com/watch?v=E03gh1huvW4", category: "Cybersecurity" },
    { title: "Penetration Testing", videoUrl: "https://www.youtube.com/watch?v=3FNYvj2U0HM", category: "Cybersecurity" },
    { title: "Cryptography Explained", videoUrl: "https://www.youtube.com/watch?v=jhXCTbFnK8o", category: "Cybersecurity" },
    { title: "Web Security Fundamentals", videoUrl: "https://www.youtube.com/watch?v=WlmKwIe9z1Q", category: "Cybersecurity" },

    // DevOps
    { title: "DevOps Tutorial for Beginners", videoUrl: "https://www.youtube.com/watch?v=j5Zsa_eOXeY", category: "DevOps" },
    { title: "CI/CD Pipeline Explained", videoUrl: "https://www.youtube.com/watch?v=scEDHsr3APg", category: "DevOps" },
    { title: "Jenkins Tutorial", videoUrl: "https://www.youtube.com/watch?v=FX322RVNGj4", category: "DevOps" },
    { title: "Terraform Crash Course", videoUrl: "https://www.youtube.com/watch?v=SLB_c_ayRMo", category: "DevOps" },
    { title: "Ansible for Automation", videoUrl: "https://www.youtube.com/watch?v=1id6ERvfozo", category: "DevOps" },

    // Blockchain
    { title: "Blockchain Explained", videoUrl: "https://www.youtube.com/watch?v=SSo_EIwHSd4", category: "Blockchain" },
    { title: "Solidity Tutorial", videoUrl: "https://www.youtube.com/watch?v=M576WGiDBdQ", category: "Blockchain" },
    { title: "Smart Contracts", videoUrl: "https://www.youtube.com/watch?v=ZE2HxTmxfrI", category: "Blockchain" },
    { title: "Web3 Development", videoUrl: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", category: "Blockchain" },
    { title: "NFT Development", videoUrl: "https://www.youtube.com/watch?v=GKJBEEXUha0", category: "Blockchain" },

    // Game Development
    { title: "Unity Game Development", videoUrl: "https://www.youtube.com/watch?v=gB1F9G0JXOo", category: "Game Development" },
    { title: "Unreal Engine Tutorial", videoUrl: "https://www.youtube.com/watch?v=dHPuqoI0gOw", category: "Game Development" },
    { title: "Godot Engine Basics", videoUrl: "https://www.youtube.com/watch?v=WbJ0KFw0bCs", category: "Game Development" },
    { title: "Game Design Principles", videoUrl: "https://www.youtube.com/watch?v=zQvWMdWhFCc", category: "Game Development" },
    { title: "3D Modeling for Games", videoUrl: "https://www.youtube.com/watch?v=TPrnSACiTJ4", category: "Game Development" },

    // UI/UX Design
    { title: "UI Design Fundamentals", videoUrl: "https://www.youtube.com/watch?v=_Hp_dI0DzY4", category: "UI/UX Design" },
    { title: "Figma Tutorial", videoUrl: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", category: "UI/UX Design" },
    { title: "UX Research Methods", videoUrl: "https://www.youtube.com/watch?v=v_s_dQIGi0M", category: "UI/UX Design" },
    { title: "Design Systems", videoUrl: "https://www.youtube.com/watch?v=wIuVvCuiJhU", category: "UI/UX Design" },
    { title: "Prototyping with Adobe XD", videoUrl: "https://www.youtube.com/watch?v=WEljsc2jorI", category: "UI/UX Design" },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing sample videos (optional - keeps user uploaded ones)
        // await Video.deleteMany({ user: null });

        // Insert sample videos
        const result = await Video.insertMany(sampleVideos.map(v => ({
            ...v,
            description: `Learn about ${v.title}`,
            status: 'safe',
            user: null, // Community videos without specific user
        })));

        console.log(`Successfully seeded ${result.length} videos!`);
        console.log('Categories:', [...new Set(sampleVideos.map(v => v.category))]);

        await mongoose.disconnect();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
