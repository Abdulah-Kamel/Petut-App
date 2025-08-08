import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import SimpleChatService from '../services/SimpleChatService';

export const useUnreadMessages = () => {
  const [user] = useAuthState(auth);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) {
      setTotalUnread(0);
      return;
    }

    const unsubscribe = SimpleChatService.getUserChats().subscribe((chats) => {
      const total = chats.reduce((sum, chat) => {
        return sum + (chat.unreadCount?.[user.uid] || 0);
      }, 0);
      setTotalUnread(total);
    });

    return () => unsubscribe();
  }, [user]);

  return totalUnread;
};