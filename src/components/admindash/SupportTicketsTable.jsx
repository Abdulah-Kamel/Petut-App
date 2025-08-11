import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiEyeLine, RiMessage3Line, RiTimeLine } from 'react-icons/ri';
import SupportChatModal from './SupportChatModal';

export default function SupportTicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const q = query(
      collection(db, 'support_tickets'),
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
  }, []);

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, 'support_tickets', ticketId), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Ticket status updated successfully');
    } catch (error) {
      toast.error('Error updating ticket status');
      console.error(error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary_app"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {ticket.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.userEmail}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {ticket.subject}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'urgent' ? 'Urgent' :
                     ticket.priority === 'high' ? 'High' :
                     ticket.priority === 'medium' ? 'Medium' : 'Low'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(ticket.status)}`}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <RiTimeLine />
                    {formatDate(ticket.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowChatModal(true);
                    }}
                    className="bg-primary_app text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-90 transition-colors flex items-center gap-1"
                  >
                    <RiMessage3Line />
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No support tickets found
          </div>
        )}
      </div>

      {showChatModal && selectedTicket && (
        <SupportChatModal
          ticket={selectedTicket}
          onClose={() => {
            setShowChatModal(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}