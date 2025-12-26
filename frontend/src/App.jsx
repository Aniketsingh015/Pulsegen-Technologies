/**
 * FRONTEND ENTRY POINT: App.jsx
 * This is the main component that sets up the React application.
 * It handles:
 * 1. Routing (Navigation between pages like Login, Dashboard, etc.)
 * 2. Auth Provider (Allowing access to user state globally)
 * 3. Protected Routes (Redirects unauthenticated users to Login)
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import { Header } from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadVideo from './pages/UploadVideo';
import VideoPlayer from './pages/VideoPlayer';
import EditVideo from './pages/EditVideo';
import Community from './pages/Community';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {user ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2>Welcome, {user.name}!</h2>
            {/* Logout button is already in Header, but we can keep it here or remove it. Let's keep the greeting but remove the button as it duplicates header. */}
          </div>
          <Dashboard />
        </div>
      ) : (
        <div className="text-center" style={{ marginTop: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Stream Without Limits
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Upload, share, and watch videos with ease. Join our community today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</a>
            <a href="/login" className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem 2rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>Sign In</a>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadVideo />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditVideo />
              </ProtectedRoute>
            } />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
