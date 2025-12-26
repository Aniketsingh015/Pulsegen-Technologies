/**
 * DASHBOARD COMPONENT (My Videos)
 * This page acts as the personalized home for the user.
 * Features:
 * 1. Displays ONLY videos uploaded by the logged-in user.
 * 2. Listens for Real-Time Content Analysis updates via Socket.io.
 * 3. Shows status badges (Pending, Safe, Flagged) for each video.
 * 4. Provides options to Edit or Watch videos.
 */

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const socket = useSocket();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get('/api/videos');
                // Filter videos to only show those uploaded by the current user
                if (user) {
                    const myVideos = data.filter(video =>
                        video.user && ((video.user._id === user._id) || (video.user === user._id))
                    );
                    setVideos(myVideos);
                } else {
                    setVideos([]);
                }
                setLoading(false);
            } catch (err) {
                setError('Error fetching videos');
                setLoading(false);
            }
        };

        if (user) {
            fetchVideos();
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('video_status_update', (update) => {
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === update.videoId
                        ? { ...video, status: update.status, analysisResult: update.result }
                        : video
                )
            );
        });

        return () => {
            socket.off('video_status_update');
        };
    }, [socket]);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading videos...</div>;
    if (error) return <div className="container" style={{ marginTop: '2rem', color: 'var(--danger)' }}>{error}</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#eab308', color: 'black' }}>Pending</span>;
            case 'processing': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#3b82f6', color: 'white' }}>Processing...</span>;
            case 'safe': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#22c55e', color: 'white' }}>Safe</span>;
            case 'flagged': return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white' }}>Flagged</span>;
            default: return null;
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="flex justify-between items-center mb-4">
                <h1>My Videos</h1>
                <Link to="/upload" className="btn btn-primary">Upload Video</Link>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {videos.map((video) => (
                    <div key={video._id} className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', backgroundColor: 'var(--bg-card)' }}>
                        <Link to={`/video/${video._id}`}>
                            {(() => {
                                const getYouTubeId = (url) => {
                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                    const match = url.match(regExp);
                                    return (match && match[2].length === 11) ? match[2] : null;
                                };
                                const youtubeId = video.videoUrl ? getYouTubeId(video.videoUrl) : null;

                                if (video.thumbnailUrl) {
                                    return (
                                        <img
                                            src={video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `/${video.thumbnailUrl}`}
                                            alt={video.title}
                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                        />
                                    );
                                } else if (youtubeId) {
                                    return (
                                        <img
                                            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                                            alt={video.title}
                                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                        />
                                    );
                                } else {
                                    return (
                                        <video
                                            src={`/${video.videoUrl}`}
                                            style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                                            muted
                                            preload="metadata"
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                        />
                                    );
                                }
                            })()}
                        </Link>
                        <div style={{ padding: '1rem' }}>
                            <div className="flex justify-between items-start">
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                    <Link to={`/video/${video._id}`} style={{ color: 'var(--text-main)' }}>{video.title}</Link>
                                </h3>
                                {getStatusBadge(video.status)}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                by {video.user?.name || 'Unknown'}
                            </p>

                            {user && video.user && (user._id === video.user._id || user._id === video.user) && (
                                <Link to={`/edit/${video._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', border: '1px solid var(--border-color)', color: 'var(--text-main)', marginRight: '1rem', textDecoration: 'none' }}>
                                    Edit
                                </Link>
                            )}

                            {video.status === 'flagged' && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
                                    Warning: {video.analysisResult}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
