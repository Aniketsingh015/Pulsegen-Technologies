import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const EditVideo = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const { data } = await axios.get(`/api/videos/${id}`);
                setTitle(data.title);
                setDescription(data.description);
                setLoading(false);

                // Basic client-side ownership check
                if (user && data.user && user._id !== data.user._id && user._id !== data.user) {
                    setError("You are not authorized to edit this video.");
                }

            } catch (err) {
                setError('Error fetching video details');
                setLoading(false);
            }
        };

        if (user) {
            fetchVideo();
        } else {
            navigate('/login');
        }
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.put(
                `/api/videos/${id}`,
                { title, description },
                config
            );

            navigate('/'); // Go back to dashboard after edit
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating video');
            setUpdating(false);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '600px' }}>
            <div className="card">
                <h1 className="text-center mb-4">Edit Video</h1>

                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            className="form-textarea"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={updating || (error && error.includes("authorized"))}
                    >
                        {updating ? 'Updating...' : 'Update Video'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{ width: '100%', marginTop: '1rem', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditVideo;
