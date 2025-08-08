import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const useSupportNotifications = (userRole = 'user') => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [newTickets, setNewTickets] = useState([]);

  useEffect(() => {
    let q;
    
    if (userRole === 'admin') {
      // للأدمن: مراقبة التذاكر الجديدة والرسائل الجديدة
      q = query(
        collection(db, 'support_tickets'),
        where('status', 'in', ['open', 'in_progress']),
        orderBy('updatedAt', 'desc')
      );
    } else {
      // للمستخدمين: مراقبة الردود الجديدة من الأدمن
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // حساب التذاكر الجديدة (آخر 24 ساعة)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentTickets = tickets.filter(ticket => {
        const createdAt = ticket.createdAt?.toDate();
        return createdAt && createdAt > oneDayAgo;
      });

      setNewTickets(recentTickets);
      setUnreadCount(recentTickets.length);
    });

    return () => unsubscribe();
  }, [userRole]);

  return { unreadCount, newTickets };
};