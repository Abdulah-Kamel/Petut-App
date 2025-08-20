import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiEyeLine, RiMessage3Line, RiTimeLine } from 'react-icons/ri';
import { BeatLoader } from 'react-spinners';
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

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'badge text-bg-danger';
      case 'high': return 'badge text-bg-warning';
      case 'medium': return 'badge text-bg-info';
      case 'low': return 'badge text-bg-success';
      default: return 'badge text-bg-secondary';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <h3 className='text-center mt-5'><BeatLoader color='var(--primary-app)' /></h3>
    );
  }

  return (
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-bold mb-0">
          Support Tickets
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="overflow-x-auto" style={{ maxHeight: '620px', overflowY: 'auto' }}>
        <table className="table table-hover">
          <thead className='position-sticky top-0'>
            <tr>
              <th className="px-3 py-3">
                User
              </th>
              <th className="px-3 py-3">
                Subject
              </th>
              <th className="px-3 py-3">
                Priority
              </th>
              <th className="px-3 py-3">
                Status
              </th>
              <th className="px-3 py-3">
                Date
              </th>
              <th className="px-3 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-3 py-3 align-middle">
                  <div>
                    <div className="fw-medium">
                      {ticket.userName}
                    </div>
                    <div className="text-sm text-secondary">
                      {ticket.userEmail}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="text-sm" style={{maxWidth: '200px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                    {ticket.subject}
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <span className={getPriorityClass(ticket.priority)}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-3 py-3 align-middle text-sm text-secondary">
                  <div className="d-flex align-items-center gap-1">
                    <RiTimeLine />
                    {formatDate(ticket.createdAt)}
                  </div>
                </td>
                <td className="px-3 py-3 align-middle">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowChatModal(true);
                    }}
                    className="custom-button btn-sm"
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
          <p className="text-center text-secondary py-5">
            No support tickets found for this filter.
          </p>
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