import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import SimpleChatService from '../services/SimpleChatService';
import ChatScreen from './ChatScreen';
import UserAvatar from '../components/UserAvatar';

const ChatsListScreen = () => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(location.state?.selectedChat || null);

  useEffect(() => {
    if (!user) {
      setChatsLoading(false);
      return;
    }

    // Test Firestore connection
    SimpleChatService.testConnection();

    const unsubscribe = SimpleChatService.getUserChats().subscribe((chatsData) => {
      if (chatsData && chatsData.length > 0) {
        loadChatsWithUserData(chatsData);
      } else {
        setChats([]);
        setChatsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const loadChatsWithUserData = async (chatsData) => {
    const chatsWithUserData = await Promise.all(
      chatsData.map(async (chat) => {
        const otherUserId = chat.participants.find(id => id !== user.uid);
        const userData = await SimpleChatService.getUserData(otherUserId);
        
        return {
          ...chat,
          otherUserName: userData?.fullName || 'Unknown User',
          otherUserImage: userData?.profileImage,
          otherUserId
        };
      })
    );
    
    setChats(chatsWithUserData);
    setChatsLoading(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days}d ago`;
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Now';
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_app"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 bg-secondary-light dark:bg-secondary-dark">
        <div className="text-6xl mb-6 text-gray-400 dark:text-gray-500">💬</div>
        <h2 className="text-2xl font-bold mb-4 text-neutral dark:text-white">Join the Conversation!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">Sign in to start chatting with other pet lovers</p>
        
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-primary_app text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </button>
          <button
            onClick={() => window.location.href = '/signup'}
            className="w-full border border-primary_app text-primary_app py-3 rounded-lg font-semibold hover:bg-primary_app/10 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (selectedChat) {
    return (
        <div className="fixed inset-0 bg-secondary-light dark:bg-secondary-dark z-50">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          <div className="card border-b border-gray-200 dark:border-gray-700 p-4 flex items-center flex-shrink-0">
            <button
              onClick={() => setSelectedChat(null)}
              className="mr-4 text-primary_app hover:text-opacity-70 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-neutral dark:text-white">Messages</h1>
          </div>
          <div className="flex-1 min-h-0">
            <ChatScreen
              chatId={selectedChat.id}
              otherUserId={selectedChat.otherUserId}
              otherUserName={selectedChat.otherUserName}
              otherUserImage={selectedChat.otherUserImage}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark">
      <div className="max-w-4xl mx-auto">
        {chatsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_app"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation from user profiles</p>
          </div>
        ) : (
          <div className="card divide-y divide-gray-200 dark:divide-gray-700">
            {chats.map((chat) => {
              const unreadCount = chat.unreadCount?.[user.uid] || 0;
              const isUnread = unreadCount > 0;
              const isOnline = chat.isOnline?.[chat.otherUserId] || false;

              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center transition-colors"
                >
                <div className="relative mr-4">
                  <UserAvatar imageData={chat.otherUserImage} userName={chat.otherUserName} size="w-12 h-12" />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium truncate text-neutral dark:text-white ${isUnread ? 'font-bold' : ''}`}>
                      {chat.otherUserName}
                    </h3>
                    <div className="flex flex-col items-end ml-2">
                      <span className={`text-xs ${isUnread ? 'text-primary_app font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatTime(chat.lastMessageTime)}
                      </span>
                      {isUnread && (
                        <div className="bg-primary_app text-white text-xs rounded-full px-2 py-1 mt-1 min-w-[20px] text-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm truncate mt-1 ${
                    isUnread ? 'text-primary_app font-medium' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsListScreen;