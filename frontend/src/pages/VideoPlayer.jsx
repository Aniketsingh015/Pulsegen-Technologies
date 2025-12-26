import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import useSocket from '../hooks/useSocket';

const VideoPlayer = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const socket = useSocket();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await axios.get(`/api/videos/${id}`);
                setVideo(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching video');
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    useEffect(() => {
        if (!socket) return;
        socket.on('video_status_update', (update) => {
            if (update.videoId === id) {
                setVideo(prev => ({
                    ...prev,
                    status: update.status,
                    analysisResult: update.result,
                    // If transcript was part of update/result we could update it, 
                    // but backend sends result field. 
                    // To keep it simple, if status becomes 'safe' or 'flagged', we strictly might need to re-fetch or backend sends transcript.
                    // Let's re-fetch to get full object including transcript if status changed to final.
                }));
                // Simple re-fetch on completion
                if (update.status === 'safe' || update.status === 'flagged') {
                    axios.get(`/api/videos/${id}`).then(({ data }) => setVideo(data));
                }
            }
        });
        return () => socket.off('video_status_update');
    }, [socket, id]);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading video...</div>;
    if (error) return <div className="container" style={{ marginTop: '2rem', color: 'var(--danger)' }}>{error}</div>;

    // Generic YouTube ID extractor
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = video.videoUrl ? getYouTubeId(video.videoUrl) : null;

    // Construct video source
    const videoSrc = youtubeId
        ? `https://www.youtube.com/embed/${youtubeId}`
        : (video.videoUrl.startsWith('http') ? video.videoUrl : `/${video.videoUrl}`);

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '1200px' }}>
            <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
                {/* Left Column: Video Player */}
                <div>
                    <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'black' }}>
                        {youtubeId ? (
                            <iframe
                                width="100%"
                                height="480"
                                src={videoSrc}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ display: 'block' }}
                            ></iframe>
                        ) : (
                            <video
                                controls
                                autoPlay
                                width="100%"
                                src={videoSrc}
                                style={{ display: 'block' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>

                    <div className="card" style={{ marginTop: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{video.title}</h1>
                        <div className="flex justify-between items-center mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                            <div className="flex items-center gap-4">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                    {video.user?.name ? video.user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{video.user?.name || 'Unknown'}</div>
                                </div>
                            </div>
                            <div style={{ color: 'var(--text-muted)' }}>{video.views} views</div>
                        </div>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{video.description}</p>
                    </div>
                </div>

                {/* Right Column: Transcript */}
                <div className="card" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        Transcript
                    </h3>
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {video.transcript ? (
                            video.transcript.split('\n').map((line, index) => (
                                <p key={index} style={{ marginBottom: '0.8rem', fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                                    {line}
                                </p>
                            ))
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📜</div>
                                <p>Transcript not available.</p>
                                {user && video.user && (user._id === video.user._id || user._id === video.user) ? (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await axios.post(
                                                    `/api/videos/${video._id}/process`,
                                                    {},
                                                    { headers: { Authorization: `Bearer ${user.token}` } }
                                                );
                                            } catch (e) {
                                                console.error(e);
                                                alert('Error starting processing');
                                            }
                                        }}
                                        className="btn btn-primary"
                                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                    >
                                        Generate Transcript
                                    </button>
                                ) : (
                                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        (Only the video owner can generate a transcript)
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
