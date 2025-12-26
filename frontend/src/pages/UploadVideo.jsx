import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const UploadVideo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            setError('Please select a video file');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', videoFile);

        setUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            await axios.post('/api/videos/upload', formData, config);
            setUploading(false);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error uploading video');
            setUploading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '600px' }}>
            <div className="card">
                <h2 className="text-center" style={{ marginBottom: '2rem' }}>Upload Video</h2>
                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            className="form-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="My Awesome Video"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell viewers about your video..."
                            rows="4"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Video File</label>
                        <input
                            className="form-input"
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            required
                            style={{ padding: '0.5rem' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={uploading}
                        style={{ width: '100%', marginTop: '1rem', opacity: uploading ? 0.7 : 1 }}
                    >
                        {uploading ? `Uploading...` : 'Upload Video'}
                    </button>

                    {uploading && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        width: `${uploadProgress}%`,
                                        height: '100%',
                                        backgroundColor: 'var(--primary)',
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </div>
                            <p className="text-center" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {uploadProgress}% Completed
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UploadVideo;
