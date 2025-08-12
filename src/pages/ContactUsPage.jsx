import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportService } from '../services/SupportService';
import { useAuth } from '../context/AuthContext';

const ContactUsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const startLiveChat = () => {
    const confirmed = window.confirm(
      'Start a quick chat session with our support team. This will create a high priority support ticket for immediate assistance.'
    );
    
    if (confirmed) {
      createQuickChatTicket();
    }
  };

  const createQuickChatTicket = async () => {
    if (!currentUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      const ticketId = await SupportService.createSupportTicket({
        subject: `Live Chat Support - ${new Date().toLocaleString('en-US')}`,
        initialMessage: 'Hello! I need immediate assistance. Please help me.',
        priority: 'high'
      });

      navigate(`/support-chat/${ticketId}`);
    } catch (error) {
      alert(`Error starting chat: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async () => {
    if (!currentUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    if (!subject.trim() || !message.trim()) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const ticketId = await SupportService.createSupportTicket({
        subject: subject.trim(),
        initialMessage: message.trim(),
        priority
      });

      navigate(`/support-chat/${ticketId}`);
    } catch (error) {
      alert(`Error creating ticket: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral dark:text-white mb-4">Contact Us</h1>
          <p className="text-neutral/70 dark:text-gray-300">We're here to help! Choose the best way to reach us</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Live Chat */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary_app/20 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-primary_app" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral dark:text-white">Live Chat</h3>
                <p className="text-neutral/70 dark:text-gray-300">For immediate assistance</p>
              </div>
            </div>
            <button
              onClick={startLiveChat}
              disabled={isLoading}
              className="w-full btn-primary-app py-3 px-4 disabled:opacity-50"
            >
              {isLoading ? 'Starting...' : 'Start Live Chat'}
            </button>
          </div>

          {/* Support Ticket */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="bg-accent/20 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral dark:text-white">Create Support Ticket</h3>
                <p className="text-neutral/70 dark:text-gray-300">For detailed support requests</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-white mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_app bg-white dark:bg-[#313340] text-neutral dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter issue subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-white mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_app bg-white dark:bg-[#313340] text-neutral dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-white mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_app bg-white dark:bg-[#313340] text-neutral dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <button
                onClick={createTicket}
                disabled={isLoading}
                className="w-full btn-primary-app py-3 px-4 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Support Ticket'}
              </button>
            </div>
          </div>
        </div>

        {/* My Tickets Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/my-tickets')}
            className="text-primary_app hover:text-primary_app/80 font-medium transition-colors"
          >
            View My Support Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;