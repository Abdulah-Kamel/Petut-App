import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useRealTimeMessages = (ticketId, onMessagesUpdate) => {
  useEffect(() => {
    if (!ticketId) return;

    const unsubscribe = onSnapshot(doc(db, 'support_tickets', ticketId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        onMessagesUpdate(data.messages || []);
      }
    });

    return () => unsubscribe();
  }, [ticketId, onMessagesUpdate]);
};