import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { RiBellLine, RiMessage3Line, RiCheckDoubleLine } from 'react-icons/ri';

export default function NotificationsPage() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to support tickets for notifications
    const q = query(
      collection(db, 'support_tickets'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = [];
      
      snapshot.docs.forEach(doc => {
        const ticket = { id: doc.id, ...doc.data() };
        
        // Check for new admin messages
        if (ticket.messages) {
          const adminMessages = ticket.messages.filter(msg => 
            msg.isAdmin && 
            new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp) > 
            new Date(ticket.userLastSeen || 0)
          );
          
          if (adminMessages.length > 0) {
            notificationsData.push({
              id: `support-${ticket.id}`,
              type: 'support',
              title: 'New Support Message',
              message: `You have ${adminMessages.length} new message(s) in ticket: ${ticket.subject}`,
              timestamp: adminMessages[adminMessages.length - 1].timestamp,
              ticketId: ticket.id,
              isRead: false
            });
          }
        }
      });

      setNotifications(notificationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNotificationClick = async (notification) => {
    if (notification.type === 'support') {
      navigate(`/support/chat/${notification.ticketId}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      const supportTicketIds = notifications
        .filter(n => n.type === 'support')
        .map(n => n.ticketId);

      const updatePromises = supportTicketIds.map(ticketId =>
        updateDoc(doc(db, 'support_tickets', ticketId), {
          userLastSeen: new Date()
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
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
            Notifications
          </h1>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-primary_app text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <RiCheckDoubleLine />
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <RiBellLine className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're all caught up! No new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-primary_app' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary_app bg-opacity-10 p-3 rounded-full">
                      <RiMessage3Line className="text-primary_app text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-primary_app rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}