/**
 * SOCKET.IO HOOK
 * Provides a reusable Socket.io connection to any component.
 * Connects to the server automatically on mount and disconnects on unmount.
 */

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Use window.location to connect to the current host
        // This works in both development (via Vite proxy) and production
        const newSocket = io(window.location.origin);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return socket;
};

export default useSocket;
