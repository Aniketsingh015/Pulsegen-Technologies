/**
 * COMMUNITY PAGE
 * This page displays a grid of videos from all users.
 * Features:
 * 1. Domain Filtering: Users can select categories (chips) to filter videos.
 * 2. Chat Sidebar: A real-time chat room updates based on the selected domain.
 * 3. Video Grid: Shows thumbnails (local or YouTube) and metadata.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const Community = () => {
    const [videos, setVideos] = useState([]);
    const [originalVideos, setOriginalVideos] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get('/api/videos');
                setVideos(data);
                setOriginalVideos(data);

                // Extract unique domains
                const allDomains = [...new Set(data.map(v => v.category || 'General'))];
                // Sort domains alphabetically
                allDomains.sort();
                setDomains(['All', ...allDomains]);

                setLoading(false);
            } catch (err) {
                setError('Error fetching community videos');
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleDomainClick = (domain) => {
        setSelectedDomain(domain);
        if (domain === 'All') {
            setVideos(originalVideos);
        } else {
            const filtered = originalVideos.filter(v => v.category === domain);
            setVideos(filtered);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Community...</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <h1 className="mb-4">Explore Communities</h1>

                {/* Domain Chips */}
                <div className="domain-scroll" style={{
                    display: 'flex',
                    gap: '0.8rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    marginBottom: '2rem',
                    whiteSpace: 'nowrap'
                }}>
                    {domains.map(domain => (
                        <button
                            key={domain}
                            onClick={() => handleDomainClick(domain)}
                            style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: selectedDomain === domain ? 'var(--primary-color)' : 'var(--bg-card)',
                                color: selectedDomain === domain ? '#fff' : 'var(--text-main)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                flexShrink: 0
                            }}
                        >
                            {domain}
                        </button>
                    ))}
                </div>

                {/* Video Grid */}
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
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <Link to={`/video/${video._id}`} style={{ color: 'var(--text-main)' }}>{video.title}</Link>
                                    </h3>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                    color: '#a5b4fc'
                                }}>
                                    {video.category || 'General'}
                                </span>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    by {video.user?.name || 'Community'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {videos.length === 0 && (
                    <div className="text-center" style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
                        No videos found in this domain.
                    </div>
                )}
            </div>

            {/* Chat Sidebar */}
            <div style={{ width: '350px', flexShrink: 0 }}>
                {user ? (
                    <ChatBox room={selectedDomain === 'All' ? 'General' : selectedDomain} user={user} />
                ) : (
                    <div className="chat-window" style={{
                        height: '100%',
                        borderLeft: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        textAlign: 'center'
                    }}>
                        <div>
                            <h3>Join the Chat</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Login to chat with the {selectedDomain} community.</p>
                            <Link to="/login" className="btn btn-primary">Login Now</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
