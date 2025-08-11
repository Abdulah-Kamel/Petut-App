export class SupportTicket {
  constructor({
    id,
    userId,
    userName,
    userEmail,
    userImage = null,
    subject,
    status = 'open',
    priority = 'medium',
    createdAt,
    updatedAt,
    assignedAdminId = null,
    assignedAdminName = null,
    messages = [],
    hasUnreadMessages = false
  }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;
    this.userImage = userImage;
    this.subject = subject;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.assignedAdminId = assignedAdminId;
    this.assignedAdminName = assignedAdminName;
    this.messages = messages;
    this.hasUnreadMessages = hasUnreadMessages;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new SupportTicket({
      id: doc.id,
      userId: data.userId || '',
      userName: data.userName || '',
      userEmail: data.userEmail || '',
      userImage: data.userImage,
      subject: data.subject || '',
      status: data.status || 'open',
      priority: data.priority || 'medium',
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      assignedAdminId: data.assignedAdminId,
      assignedAdminName: data.assignedAdminName,
      messages: data.messages?.map(m => SupportMessage.fromMap(m)) || [],
      hasUnreadMessages: data.hasUnreadMessages || false
    });
  }

  toMap() {
    return {
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      userImage: this.userImage,
      subject: this.subject,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      assignedAdminId: this.assignedAdminId,
      assignedAdminName: this.assignedAdminName,
      messages: this.messages.map(m => m.toMap()),
      hasUnreadMessages: this.hasUnreadMessages
    };
  }
}

export class SupportMessage {
  constructor({
    id,
    senderId,
    senderName,
    senderRole = 'user',
    message,
    timestamp,
    imageUrl = null
  }) {
    this.id = id;
    this.senderId = senderId;
    this.senderName = senderName;
    this.senderRole = senderRole;
    this.isAdmin = senderRole === 'admin';
    this.message = message;
    this.timestamp = timestamp;
    this.imageUrl = imageUrl;
  }

  static fromMap(data) {
    return new SupportMessage({
      id: data.id || '',
      senderId: data.senderId || '',
      senderName: data.senderName || '',
      senderRole: data.senderRole || 'user',
      message: data.message || '',
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp || new Date()),
      imageUrl: data.imageUrl
    });
  }

  toMap() {
    return {
      id: this.id,
      senderId: this.senderId,
      senderName: this.senderName,
      senderRole: this.senderRole,
      isAdmin: this.isAdmin,
      message: this.message,
      timestamp: this.timestamp,
      imageUrl: this.imageUrl
    };
  }

  toMap() {
    return {
      id: this.id,
      senderId: this.senderId,
      senderName: this.senderName,
      senderRole: this.senderRole,
      message: this.message,
      timestamp: this.timestamp,
      imageUrl: this.imageUrl
    };
  }
}