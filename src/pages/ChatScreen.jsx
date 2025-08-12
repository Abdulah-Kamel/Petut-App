import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, onSnapshot, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import UserAvatar from '../components/UserAvatar';
import { Chat, Message, MessageType } from '../models/Chat';
import SimpleChatService from '../services/SimpleChatService';
import ImageEditor from '../components/common/ImageEditor';

const ChatScreen = ({ chatId, otherUserId, otherUserName, otherUserImage }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    // Load current user data
    const loadCurrentUserData = async () => {
      if (user?.uid) {
        const userData = await SimpleChatService.getUserData(user.uid);
        setCurrentUserData(userData);
      }
    };
    loadCurrentUserData();

    // Mark messages as read and update online status
    SimpleChatService.markMessagesAsRead(chatId);
    SimpleChatService.updateOnlineStatus(true);

    // Listen to messages
    const unsubscribeMessages = onSnapshot(
      query(
        collection(db, 'messages'),
        where('chatId', '==', chatId)
      ),
      (snapshot) => {
        console.log('Messages snapshot:', snapshot.docs.length, 'docs');
        try {
          const messagesData = snapshot.docs
            .map(doc => {
              const data = doc.data();
              console.log('Message data:', doc.id, data);
              return Message.fromFirestore(doc);
            })
            .sort((a, b) => a.timestamp - b.timestamp);
          console.log('Processed messages:', messagesData.length);
          setMessages(messagesData);
        } catch (error) {
          console.error('Error loading messages:', error);
          setMessages([]);
        }
      },
      (error) => {
        console.error('Error listening to messages:', error);
        setMessages([]);
      }
    );

    // Listen to chat data
    const unsubscribeChat = onSnapshot(
      doc(db, 'chats', chatId),
      (doc) => {
        try {
          if (doc.exists()) {
            setChatData(Chat.fromFirestore(doc));
          }
        } catch (error) {
          console.error('Error loading chat data:', error);
        }
      },
      (error) => {
        console.error('Error listening to chat:', error);
      }
    );

    return () => {
      unsubscribeMessages();
      unsubscribeChat();
      SimpleChatService.updateOnlineStatus(false);
    };
  }, [chatId, user]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    
    setLoading(true);
    try {
      await SimpleChatService.sendMessage(chatId, messageText.trim(), 'text');
      setMessageText('');
      setShowEmojiPicker(false);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const sendImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size and type
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size is too large. Please select an image smaller than 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        setTempImage(base64);
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Failed to process image');
    }
  };

  const handleImageSave = async (editedImage) => {
    setLoading(true);
    try {
      await SimpleChatService.sendImageMessage(chatId, editedImage);
      setShowImageEditor(false);
      setTempImage(null);
    } catch (error) {
      alert('Failed to send image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageCancel = () => {
    setShowImageEditor(false);
    setTempImage(null);
  };

  const deleteChat = async () => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await SimpleChatService.deleteChat(chatId);
        navigate('/chats');
      } catch (error) {
        alert('Failed to delete chat');
      }
    }
    setShowMenu(false);
  };

  const viewProfile = () => {
    navigate(`/profile/${otherUserId}`);
    setShowMenu(false);
  };

  const formatTime = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${date.getDate()}/${date.getMonth() + 1}`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Now';
  };



  const MessageBubble = ({ message }) => {
    const isMe = message.senderId === user?.uid;
    
    return (
      <div className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && (
          <div className="mr-2 flex-shrink-0">
            <UserAvatar 
              imageData={otherUserImage} 
              userName={otherUserName} 
              size="w-8 h-8" 
            />
            <div className="text-xs text-gray-500 text-center mt-1">
              Support
            </div>
          </div>
        )}
        
        <div className={`max-w-[70%] px-4 py-3 relative shadow-sm ${
          isMe 
            ? 'bg-primary_app text-white rounded-l-2xl rounded-tr-2xl rounded-br-md ml-auto' 
            : 'bg-gray-200 dark:bg-gray-700 text-neutral dark:text-white rounded-r-2xl rounded-tl-2xl rounded-bl-md'
        }`}>
          {isMe && (
            <div className="absolute -top-2 right-2 bg-primary_app-dark text-white text-xs px-2 py-1 rounded-full shadow-sm">
              You
            </div>
          )}
          
          {message.type === 'image' ? (
            <img
              src={`data:image/jpeg;base64,${message.content}`}
              alt="Sent image"
              className="w-48 h-48 object-cover rounded-lg"
            />
          ) : message.type === 'emoji' ? (
            <span className="text-3xl">{message.content}</span>
          ) : (
            <p className="text-base break-words">{message.content}</p>
          )}
          
          <div className={`flex items-center mt-1 text-xs ${
            isMe ? 'justify-end text-orange-100' : 'justify-start text-neutral/70 dark:text-gray-300'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {isMe && (
              <span className="ml-1">
                {message.readBy?.[otherUserId] ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
        
        {isMe && (
          <div className="ml-2 flex-shrink-0">
            <UserAvatar 
              imageData={currentUserData?.profileImage} 
              userName={currentUserData?.fullName || user?.displayName || 'You'} 
              size="w-8 h-8" 
            />
          </div>
        )}
      </div>
    );
  };

  const isOnline = chatData?.isOnline?.[otherUserId] || false;

  return (
    <div className="flex flex-col h-full bg-secondary-light dark:bg-secondary-dark" onClick={(e) => {
      if (e.target === e.currentTarget) {
        setShowMenu(false);
        setShowEmojiPicker(false);
      }
    }}>
      {/* Header */}
      <div className="card border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center min-w-0 flex-1">
          <div className="relative mr-2 sm:mr-3 flex-shrink-0">
            <UserAvatar 
              imageData={otherUserImage} 
              userName={otherUserName} 
              size="w-8 h-8 sm:w-10 sm:h-10" 
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base truncate text-neutral dark:text-white">{otherUserName}</h3>
            <p className={`text-xs sm:text-sm ${isOnline ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 flex-shrink-0 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#313340] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              <button
                onClick={viewProfile}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-neutral dark:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </button>
              <button
                onClick={deleteChat}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-secondary-light dark:bg-secondary-dark">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Start your conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card border-t border-gray-200 dark:border-gray-700 p-2 sm:p-4 flex-shrink-0">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={sendImage}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-primary_app hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-2 text-primary_app hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-20">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false
                  }}
                />
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-primary_app bg-white dark:bg-[#313340] text-neutral dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          <button
            onClick={sendMessage}
            disabled={loading || !messageText.trim()}
            className="bg-primary_app text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Image Editor Modal */}
      {showImageEditor && tempImage && (
        <ImageEditor
          imageData={tempImage}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
};

export default ChatScreen;