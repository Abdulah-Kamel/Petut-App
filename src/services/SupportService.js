import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc,
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';
import { SupportTicket, SupportMessage } from '../models/SupportTicket';

export class SupportService {
  static async createSupportTicket({ subject, initialMessage, priority = 'medium' }) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};

    const now = new Date();
    const firstMessage = new SupportMessage({
      id: Date.now().toString(),
      senderId: user.uid,
      senderName: userData.fullName || 'User',
      senderRole: 'user',
      message: initialMessage,
      timestamp: now
    });

    const ticket = new SupportTicket({
      userId: user.uid,
      userName: userData.fullName || 'User',
      userEmail: user.email || '',
      userImage: userData.profileImage,
      subject,
      status: 'open',
      priority,
      createdAt: now,
      updatedAt: now,
      messages: [firstMessage]
    });

    const docRef = await addDoc(collection(db, 'support_tickets'), ticket.toMap());
    return docRef.id;
  }

  static async sendMessage({ ticketId, message, imageUrl }) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};

    const newMessage = new SupportMessage({
      id: Date.now().toString(),
      senderId: user.uid,
      senderName: userData.fullName || 'User',
      senderRole: 'user',
      message,
      timestamp: new Date(),
      imageUrl
    });

    await updateDoc(doc(db, 'support_tickets', ticketId), {
      messages: arrayUnion(newMessage.toMap()),
      updatedAt: serverTimestamp(),
      status: 'open'
    });
  }

  static getUserSupportTickets(callback) {
    const user = auth.currentUser;
    if (!user) return null;

    const q = query(
      collection(db, 'support_tickets'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => SupportTicket.fromFirestore(doc));
      callback(tickets);
    });
  }

  static getSupportTicket(ticketId, callback) {
    return onSnapshot(doc(db, 'support_tickets', ticketId), (doc) => {
      const ticket = doc.exists() ? SupportTicket.fromFirestore(doc) : null;
      callback(ticket);
    });
  }

  static getAllSupportTickets(callback) {
    const q = query(
      collection(db, 'support_tickets'),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => SupportTicket.fromFirestore(doc));
      callback(tickets);
    });
  }

  static async assignTicketToAdmin({ ticketId, adminId, adminName }) {
    await updateDoc(doc(db, 'support_tickets', ticketId), {
      assignedAdminId: adminId,
      assignedAdminName: adminName,
      status: 'in_progress',
      updatedAt: serverTimestamp()
    });
  }

  static async updateTicketStatus({ ticketId, status }) {
    await updateDoc(doc(db, 'support_tickets', ticketId), {
      status,
      updatedAt: serverTimestamp()
    });
  }

  static async sendAdminReply({ ticketId, message, adminId, adminName, imageUrl }) {
    const adminMessage = new SupportMessage({
      id: Date.now().toString(),
      senderId: adminId,
      senderName: adminName,
      senderRole: 'admin',
      message,
      timestamp: new Date(),
      imageUrl
    });

    await updateDoc(doc(db, 'support_tickets', ticketId), {
      messages: arrayUnion(adminMessage.toMap()),
      updatedAt: serverTimestamp(),
      status: 'in_progress',
      hasUnreadMessages: true
    });
  }

  static async markTicketAsRead(ticketId) {
    await updateDoc(doc(db, 'support_tickets', ticketId), {
      hasUnreadMessages: false
    });
  }
}