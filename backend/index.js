/**
 * ENTRY POINT: server.js (or index.js)
 * This is the main file where the Backend Server starts.
 * It sets up:
 * 1. Express (for API routes like /api/videos)
 * 2. MongoDB Connection (database)
 * 3. Socket.io (for real-time chat and updates)
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file (like DB URL, Secrets)
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io for Real-Time Communication
// In production, 'cors' allows the same origin. In development, allow localhost:5173.
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    const User = require('./models/User');

    socket.on('join_room', async (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);

        // Calculate counts
        const onlineCount = io.sockets.adapter.rooms.get(room)?.size || 0;
        const totalCount = await User.countDocuments(); // Proxy for 'Total Community Members'

        io.to(room).emit('room_users_update', { onlineCount, totalCount });
    });

    socket.on('leave_room', async (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);

        const onlineCount = io.sockets.adapter.rooms.get(room)?.size || 0;
        const totalCount = await User.countDocuments();

        io.to(room).emit('room_users_update', { onlineCount, totalCount });
    });

    socket.on('send_message', (data) => {
        // data: { room, author, message, time }
        console.log(`Message in ${data.room}: ${data.message}`);
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// Make io accessible to our routes
app.set('socketio', io);

const path = require('path');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

app.use(cors());
app.use(express.json());

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- PRODUCTION SETUP ---
// In production, serve the React frontend from the backend
if (process.env.NODE_ENV === 'production') {
    // Serve the built React app
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Any route not matching an API route should serve index.html (for React Router)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

const PORT = process.env.PORT || 5001;

// Start the Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
