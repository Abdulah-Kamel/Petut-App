import React from 'react';
import { useParams } from 'react-router-dom';
import ChatScreen from './ChatScreen';

const ChatScreenWrapper = () => {
  const { chatId } = useParams();
  
  // You would typically fetch other user data here based on chatId
  // For now, we'll pass placeholder props
  return (
    <div className="h-screen">
      <ChatScreen 
        chatId={chatId}
        otherUserId="placeholder"
        otherUserName="Chat User"
        otherUserImage={null}
      />
    </div>
  );
};

export default ChatScreenWrapper;