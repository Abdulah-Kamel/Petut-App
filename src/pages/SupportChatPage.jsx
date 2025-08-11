import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SupportService } from '../services/SupportService';
import { useAuth } from '../context/AuthContext';

const SupportChatPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;
    
    console.log('Current User:', currentUser);
    console.log('Current User UID:', currentUser?.uid);

    const unsubscribe = SupportService.getSupportTicket(ticketId, (ticketData) => {
      setTicket(ticketData);
      console.log('Ticket data:', ticketData);
      console.log('Ticket messages:', ticketData?.messages);
      if (ticketData) {
        SupportService.markTicketAsRead(ticketId);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      await SupportService.sendMessage({
        ticketId,
        message: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      alert(`Error sending message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_app mx-auto mb-4"></div>
          <p className="text-neutral/70">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <div className="card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/my-tickets')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-neutral">{ticket.subject}</h1>
                <p className="text-sm text-neutral/70">Ticket ID: {ticket.id}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusText(ticket.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] overflow-y-auto p-4 mb-4 space-y-4">
          {ticket.messages.map((message, index) => {
            const isSupport = message.isAdmin || false;
            const isMe = !isSupport && message.senderId === currentUser?.uid;

            return (
              <div
                key={index}
                className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {isSupport && (
                  <div className="mr-3 flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      Support
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm relative ${
                    isMe
                      ? 'bg-primary_app text-white rounded-l-2xl rounded-tr-2xl rounded-br-md'
                      : 'bg-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl rounded-bl-md'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 text-xs ${
                    isMe ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">
                      {isMe ? 'You' : 'Customer Support'}
                    </span>
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>

                {isMe && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-8 h-8 bg-primary_app rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== 'closed' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message to support..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary_app focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="bg-primary_app text-white px-6 py-2 rounded-lg hover:bg-primary_app/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {ticket.status === 'closed' && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">This ticket has been closed. No new messages can be sent.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatPage;

