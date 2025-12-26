import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

export const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <header className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
                <Link to="/" className="logo-text">
                    VideoApp
                </Link>

                <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/community" className={isActive('/community')}>Community</Link>

                    {user ? (
                        <div className="dropdown" ref={dropdownRef}>
                            <div className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="avatar-circle">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <span style={{ fontWeight: 500 }}>{user.name}</span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
                            </div>

                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/upload" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        Upload Video
                                    </Link>
                                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="dropdown-item" style={{ color: 'var(--danger)' }}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/login" className={isActive('/login')}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 6px rgba(99, 102, 241, 0.25)' }}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};
