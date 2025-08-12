import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportService } from '../services/SupportService';

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = SupportService.getUserSupportTickets((ticketsData) => {
      setTickets(ticketsData);
      setIsLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_app mx-auto mb-4"></div>
          <p className="text-neutral/70 dark:text-gray-300">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral dark:text-white">My Support Tickets</h1>
          <button
            onClick={() => navigate('/contact-us')}
            className="btn-primary-app px-4 py-2"
          >
            Create New Ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-neutral/40 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral dark:text-white mb-2">No Support Tickets</h3>
            <p className="text-neutral/70 dark:text-gray-300 mb-4">You haven't created any support tickets yet</p>
            <button
              onClick={() => navigate('/contact-us')}
              className="btn-primary-app px-6 py-2"
            >
              Create Support Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="card p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/support-chat/${ticket.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral dark:text-white mb-2">{ticket.subject}</h3>
                    <p className="text-neutral/70 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                      {ticket.messages[0]?.message}
                    </p>
                  </div>
                  {ticket.hasUnreadMessages && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-4">
                      New
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)} Priority
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                  {ticket.assignedAdminName && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Assigned to {ticket.assignedAdminName}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm text-neutral/70 dark:text-gray-400">
                  <span>Messages: {ticket.messages.length}</span>
                  <span>Last updated: {new Date(ticket.updatedAt).toLocaleDateString('en-US')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;