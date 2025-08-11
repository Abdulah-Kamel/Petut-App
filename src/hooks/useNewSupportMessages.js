import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const useNewSupportMessages = () => {
  const [user] = useAuthState(auth);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'support_tickets'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalNewMessages = 0;
      
      snapshot.docs.forEach(doc => {
        const ticket = doc.data();
        const messages = ticket.messages || [];
        
        // Count admin messages that are newer than user's last seen
        const adminMessages = messages.filter(msg => 
          msg.isAdmin && 
          msg.timestamp && 
          new Date(msg.timestamp.toDate ? msg.timestamp.toDate() : msg.timestamp) > 
          new Date(ticket.userLastSeen || 0)
        );
        
        totalNewMessages += adminMessages.length;
      });

      setNewMessagesCount(totalNewMessages);
      setHasNewMessages(totalNewMessages > 0);
    });

    return () => unsubscribe();
  }, [user]);

  return { hasNewMessages, newMessagesCount };
};