import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const useSupportNotifications = (userRole = 'user') => {
  const [user] = useAuthState(auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newTickets, setNewTickets] = useState([]);

  useEffect(() => {
    if (!user) return;

    let q;
    
    if (userRole === 'admin') {
      q = query(
        collection(db, 'support_tickets'),
        where('status', 'in', ['open', 'in_progress']),
        orderBy('updatedAt', 'desc')
      );
    } else {
      // For users: monitor new admin replies
      q = query(
        collection(db, 'support_tickets'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (userRole === 'admin') {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentTickets = tickets.filter(ticket => {
          const createdAt = ticket.createdAt?.toDate();
          return createdAt && createdAt > oneDayAgo;
        });
        setNewTickets(recentTickets);
        setUnreadCount(recentTickets.length);
      } else {
        // Count tickets with new admin messages
        let count = 0;
        tickets.forEach(ticket => {
          if (ticket.messages) {
            const hasNewAdminMessages = ticket.messages.some(msg => 
              msg.isAdmin && 
              new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp) > 
              new Date(ticket.userLastSeen || 0)
            );
            if (hasNewAdminMessages) count++;
          }
        });
        setUnreadCount(count);
        setNewTickets(tickets.filter(ticket => {
          if (!ticket.messages) return false;
          return ticket.messages.some(msg => 
            msg.isAdmin && 
            new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp) > 
            new Date(ticket.userLastSeen || 0)
          );
        }));
      }
    });

    return () => unsubscribe();
  }, [userRole, user]);

  return { unreadCount, newTickets };
};