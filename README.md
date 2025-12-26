# Video Streaming Platform

A full-stack video streaming and community platform built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time chat, video uploads, content analysis, and a community hub with 50+ curated videos across 10 tech domains.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

### Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcryptjs
- Persistent sessions via localStorage

### Video Management
- **Upload Videos** - Local file uploads or YouTube URL imports
- **Video Player** - Embedded player with YouTube support
- **Edit Metadata** - Update title, description, and category
- **Auto Thumbnails** - Automatic thumbnail extraction from YouTube URLs

### Community Hub
- **50+ Curated Videos** across 10 tech domains:
  - Web Development, Machine Learning, Data Science
  - Mobile Development, Cloud Computing, Cybersecurity
  - DevOps, Blockchain, Game Development, UI/UX Design
- **Category Filtering** - Filter videos by domain using interactive chips
- **Video Grid** - Responsive gallery with hover previews

### Real-Time Chat
- **Live Chat Rooms** - Domain-based chat rooms (one per category)
- **Online/Total Counts** - Real-time user presence indicators
- **Socket.io Integration** - Instant message delivery

### Content Moderation
- **Sensitivity Analysis** - Mock content analysis for uploaded videos
- **Status Badges** - Pending, Processing, Safe, Flagged indicators
- **Real-Time Updates** - Live status changes via WebSockets

### Modern UI/UX
- Dark theme with gradient accents
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional navigation with user dropdown

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, React Router, Axios |
| **Backend** | Node.js, Express 5, Socket.io |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Styling** | Vanilla CSS with CSS Variables |

---

## Prerequisites

Before running this project, ensure you have:

- **Node.js** v18+ installed
- **MongoDB** (local or MongoDB Atlas account)
- **Git** for version control

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/video-stream-app.git
cd video-stream-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/videostreamapp
JWT_SECRET=your_super_secret_key_here
```

**Note:** For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/videostreamapp`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Seed Community Videos (Optional)

Populate the database with 50 sample YouTube videos:

```bash
cd backend
node seed.js
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Run backend (serves both API and frontend)
cd ../backend
NODE_ENV=production node index.js
```

---

## Deployment (Render.com)

1. Push code to GitHub
2. Create a Web Service on [Render.com](https://render.com)
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && cd ../frontend && npm install && npm run build`
   - **Start Command**: `node index.js`
4. Add Environment Variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV` - `production`

---

## Project Structure

```
video-stream-app/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── videoController.js # Video CRUD
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Video.js           # Video schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── videoRoutes.js     # Video endpoints
│   ├── uploads/               # Uploaded files
│   ├── index.js               # Server entry point
│   ├── seed.js                # Database seeder
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx     # Navigation bar
│   │   │   └── ChatBox.jsx    # Real-time chat
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── hooks/
│   │   │   └── useSocket.js   # Socket.io hook
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # My Videos
│   │   │   ├── Community.jsx  # Video hub + chat
│   │   │   ├── VideoPlayer.jsx # Video playback
│   │   │   ├── UploadVideo.jsx # Upload form
│   │   │   ├── EditVideo.jsx  # Edit metadata
│   │   │   ├── Login.jsx      # Login page
│   │   │   └── Register.jsx   # Registration
│   │   ├── App.jsx            # Main component
│   │   └── App.css            # Global styles
│   └── vite.config.js         # Vite configuration
│
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos |
| GET | `/api/videos/:id` | Get single video |
| POST | `/api/videos/upload` | Upload new video |
| PUT | `/api/videos/:id` | Update video metadata |
| DELETE | `/api/videos/:id` | Delete video |
| POST | `/api/videos/:id/process` | Trigger content analysis |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client to Server | Join a chat room |
| `leave_room` | Client to Server | Leave a chat room |
| `send_message` | Client to Server | Send chat message |
| `receive_message` | Server to Client | Receive chat message |
| `room_users_update` | Server to Client | User count update |
| `video_status_update` | Server to Client | Content analysis status |

---

## Screenshots

### Home Page
The landing page displays a welcome message and quick access to video uploads and community features.

### Community Hub
Browse 50+ curated videos across 10 tech domains with real-time chat integration.

### Video Player
Watch videos with an embedded player supporting both local uploads and YouTube content.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Aniket Singh**

- GitHub: [@Aniketsingh015](https://github.com/Aniketsingh015)

---

Built with the MERN Stack
