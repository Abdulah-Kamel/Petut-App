import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  setDoc,
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Chat, Message, MessageType } from '../models/Chat';

class SimpleChatService {
  static async testConnection() {
    try {
      const testDoc = await getDoc(doc(db, 'test', 'connection'));
      console.log('Firestore connection successful');
      return true;
    } catch (error) {
      console.error('Firestore connection failed:', error);
      return false;
    }
  }
  static async createOrGetChat(otherUserId) {
    const currentUserId = auth.currentUser.uid;
    const participants = [currentUserId, otherUserId].sort();
    const chatId = `${participants[0]}_${participants[1]}`;
    
    try {
      // Check if chat exists
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      
      if (chatDoc.exists()) {
        return chatId;
      }
      
      // Create new chat with fixed ID
      await setDoc(doc(db, 'chats', chatId), {
        participants,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: '',
        unreadCount: {
          [currentUserId]: 0,
          [otherUserId]: 0,
        },
        isOnline: {
          [currentUserId]: true,
          [otherUserId]: false,
        },
        lastSeen: {
          [currentUserId]: serverTimestamp(),
          [otherUserId]: serverTimestamp(),
        },
        createdAt: serverTimestamp(),
      });
      
      return chatId;
    } catch (error) {
      throw new Error(`Failed to create chat: ${error}`);
    }
  }

  static async sendMessage(chatId, content, type) {
    const currentUserId = auth.currentUser.uid;
    
    try {
      const batch = writeBatch(db);
      
      // Add message
      const messageRef = doc(collection(db, 'messages'));
      batch.set(messageRef, {
        chatId,
        senderId: currentUserId,
        content,
        timestamp: serverTimestamp(),
        type: typeof type === 'string' ? type : 'text',
        isRead: false,
        readBy: { [currentUserId]: true },
      });
      
      // Update chat
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants;
        const otherUserId = participants.find(id => id !== currentUserId);
        
        batch.update(chatRef, {
          lastMessage: type === 'image' ? '📷 صورة' : content,
          lastMessageTime: serverTimestamp(),
          lastMessageSenderId: currentUserId,
          lastMessageType: type,
          [`unreadCount.${otherUserId}`]: increment(1),
          [`unreadCount.${currentUserId}`]: 0,
        });
      }
      
      await batch.commit();
      console.log('Message saved to Firestore');
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  static async sendImageMessage(chatId, base64Image) {
    return this.sendMessage(chatId, base64Image, 'image');
  }

  static getUserChats() {
    const currentUserId = auth.currentUser.uid;
    
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUserId)
    );
    
    return {
      subscribe: (callback) => {
        return onSnapshot(q, (snapshot) => {
          const chats = snapshot.docs.map(doc => Chat.fromFirestore(doc));
          chats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
          callback(chats);
        });
      }
    };
  }

  static getChatMessages(chatId, callback) {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => Message.fromFirestore(doc));
      callback(messages);
    });
  }

  static async markMessagesAsRead(chatId) {
    const currentUserId = auth.currentUser.uid;
    
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        [`unreadCount.${currentUserId}`]: 0,
      });
    } catch (error) {
      // Ignore errors
    }
  }

  static async updateOnlineStatus(isOnline) {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;
    
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', currentUserId)
      );
      
      const chats = await getDocs(q);
      const batch = writeBatch(db);
      
      chats.docs.forEach(chatDoc => {
        batch.update(chatDoc.ref, {
          [`isOnline.${currentUserId}`]: isOnline,
          [`lastSeen.${currentUserId}`]: serverTimestamp(),
        });
      });
      
      await batch.commit();
    } catch (error) {
      // Ignore errors
    }
  }

  static async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      return null;
    }
  }

  static async deleteChat(chatId) {
    try {
      // Delete all messages
      const messagesQuery = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId)
      );
      const messages = await getDocs(messagesQuery);
      
      const batch = writeBatch(db);
      messages.docs.forEach(messageDoc => {
        batch.delete(messageDoc.ref);
      });
      
      // Delete chat
      batch.delete(doc(db, 'chats', chatId));
      await batch.commit();
    } catch (error) {
      throw new Error(`Failed to delete chat: ${error}`);
    }
  }
}

export default SimpleChatService;