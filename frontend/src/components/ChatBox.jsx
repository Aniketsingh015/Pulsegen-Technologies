/**
 * CHATBOX COMPONENT
 * Handles the real-time chat interface.
 * Features:
 * 1. Connects to Socket.io backend.
 * 2. Joins/Leaves rooms based on props.
 * 3. Sends and Receives messages in real-time.
 * 4. Displays live user counts (Online/Total).
 */

import { useState, useEffect, useRef } from 'react';
import useSocket from '../hooks/useSocket';

const ChatBox = ({ room, user }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [counts, setCounts] = useState({ onlineCount: 0, totalCount: 0 });
    const socket = useSocket();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (socket && room) {
            socket.emit("join_room", room);
            // Clear messages on room switch or fetch history if we had a backend for it
            setMessageList([]);
        }

        return () => {
            if (socket && room) {
                socket.emit("leave_room", room);
            }
        };
    }, [socket, room]);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        socket.on("room_users_update", (data) => {
            setCounts(data);
        });

        return () => {
            socket.off("receive_message");
            socket.off("room_users_update");
        };
    }, [socket]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: user ? user.name : "Guest",
                message: currentMessage,
                time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    return (
        <div className="chat-window" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)'
        }}>
            <div className="chat-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 'bold' }}>Live Chat: {room}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        <div style={{ color: '#22c55e' }}>{counts.onlineCount} Online</div>
                        <div>{counts.totalCount} Total Members</div>
                    </div>
                </div>
            </div>

            <div className="chat-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messageList.map((messageContent, index) => {
                    const isMyMessage = user && messageContent.author === user.name;
                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                                marginBottom: '1rem'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.2rem',
                                flexDirection: isMyMessage ? 'row-reverse' : 'row'
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                    {messageContent.author}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {messageContent.time}
                                </span>
                            </div>
                            <div style={{
                                backgroundColor: isMyMessage ? 'var(--primary-color)' : '#3f3f46',
                                color: '#fff',
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                borderTopRightRadius: isMyMessage ? '2px' : '12px',
                                borderTopLeftRadius: isMyMessage ? '12px' : '2px',
                                maxWidth: '80%',
                                wordWrap: 'break-word'
                            }}>
                                {messageContent.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <div className="chat-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Say something..."
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-main)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
