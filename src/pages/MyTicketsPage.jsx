import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { RiAddLine, RiMessage3Line, RiTimeLine } from 'react-icons/ri';
import UserSupportChatModal from '../components/UserSupportChatModal';

export default function MyTicketsPage() {
  const [user] = useAuthState(auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'support_tickets'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG') + ' ' + date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_app"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support Tickets
          </h1>
          <Link
            to="/contact-us"
            className="bg-primary_app text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <RiAddLine />
            New Ticket
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <RiMessage3Line className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Support Tickets
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any support tickets yet
            </p>
            <Link
              to="/contact-us"
              className="bg-primary_app text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
            >
              <RiAddLine />
              Create New Ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {ticket.subject}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {ticket.message}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <RiTimeLine />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <div>
                      Messages: {ticket.messages?.length || 0}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowChatModal(true);
                    }}
                    className="bg-primary_app text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
                  >
                    <RiMessage3Line />
                    View Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showChatModal && selectedTicket && (
          <UserSupportChatModal
            ticket={selectedTicket}
            onClose={() => {
              setShowChatModal(false);
              setSelectedTicket(null);
            }}
          />
        )}
      </div>
    </div>
  );
}