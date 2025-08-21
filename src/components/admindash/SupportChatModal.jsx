import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, updateDoc, arrayUnion, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiCloseLine, RiSendPlaneFill, RiUserLine, RiAdminLine } from 'react-icons/ri';
import { useDarkMode } from '../../context/DarkModeContext.jsx';

export default function SupportChatModal({ ticket, onClose }) {
    const { isDarkMode } = useDarkMode();
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!ticket?.id) return;

        const unsubscribe = onSnapshot(doc(db, 'support_tickets', ticket.id), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setMessages(data.messages || []);
            }
        });

        return () => unsubscribe();
    }, [ticket?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setLoading(true);
        try {
            const messageData = {
                senderId: user.uid,
                senderName: user.displayName || 'Admin',
                message: newMessage.trim(),
                timestamp: new Date(),
                isAdmin: true
            };

            await updateDoc(doc(db, 'support_tickets', ticket.id), {
                messages: arrayUnion(messageData),
                updatedAt: new Date(),
                status: 'in_progress'
            });

            setNewMessage('');
            toast.success('Message sent successfully');
        } catch (error) {
            toast.error('Error sending message');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div className="modal-header">
                        <div>
                            <h5 className="modal-title fw-bold">
                                {ticket.subject}
                            </h5>
                            <p className="text-muted small mb-0">
                                with {ticket.userName} ({ticket.userEmail})
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`btn-close ${isDarkMode ? 'btn-close-white' : ''}`}
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Messages */}
                    <div className="modal-body flex-grow-1 overflow-auto p-3" style={{ maxHeight: '400px' }}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`d-flex mb-3 ${message.isAdmin ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                                <div
                                    className={`px-3 py-2 rounded ${
                                        message.isAdmin
                                            ? 'bg-primary-app text-white'
                                            : 'background-secondary'
                                    }`}
                                    style={{ maxWidth: '70%' }}
                                >
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        {message.isAdmin ? (
                                            <RiAdminLine size={16} />
                                        ) : (
                                            <RiUserLine size={16} />
                                        )}
                                        <span className="small opacity-75">
                                            {message.senderName}
                                        </span>
                                        <span className="small opacity-75">
                                            {formatMessageTime(message.timestamp)}
                                        </span>
                                    </div>
                                    <p className="small mb-0">{message.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="modal-footer">
                        <form onSubmit={sendMessage} className="w-100">
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="form-control"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <RiSendPlaneFill />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}