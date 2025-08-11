export class Chat {
  constructor({
    id,
    participants,
    lastMessage,
    lastMessageTime,
    lastMessageSenderId,
    unreadCount,
    isOnline,
    lastSeen,
    otherUserName = null,
    otherUserImage = null
  }) {
    this.id = id;
    this.participants = participants;
    this.lastMessage = lastMessage;
    this.lastMessageTime = lastMessageTime;
    this.lastMessageSenderId = lastMessageSenderId;
    this.unreadCount = unreadCount;
    this.isOnline = isOnline;
    this.lastSeen = lastSeen;
    this.otherUserName = otherUserName;
    this.otherUserImage = otherUserImage;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Chat({
      id: doc.id,
      participants: data.participants || [],
      lastMessage: data.lastMessage || '',
      lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
      lastMessageSenderId: data.lastMessageSenderId || '',
      unreadCount: data.unreadCount || {},
      isOnline: data.isOnline || {},
      lastSeen: Object.fromEntries(
        Object.entries(data.lastSeen || {}).map(([key, value]) => [
          key, 
          value?.toDate ? value.toDate() : new Date()
        ])
      )
    });
  }
}

export class Message {
  constructor({
    id,
    chatId,
    senderId,
    content,
    timestamp,
    type,
    isRead = false,
    readBy = {}
  }) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.content = content;
    this.timestamp = timestamp;
    this.type = type;
    this.isRead = isRead;
    this.readBy = readBy;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    const message = new Message({
      id: doc.id,
      chatId: data.chatId || '',
      senderId: data.senderId || '',
      content: data.content || '',
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
      type: data.type || 'text',
      isRead: data.isRead || false,
      readBy: data.readBy || {}
    });
    console.log('Created message object:', message);
    return message;
  }
}

export const MessageType = {
  text: 'text',
  image: 'image',
  emoji: 'emoji'
};