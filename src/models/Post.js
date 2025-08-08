export class Post {
  constructor({
    id,
    userId,
    topic,
    content,
    timestamp,
    imageUrl = null,
    location = null,
    authorName = null,
    authorImage = null,
    commentsCount = 0
  }) {
    this.id = id;
    this.userId = userId;
    this.topic = topic;
    this.content = content;
    this.timestamp = timestamp;
    this.imageUrl = imageUrl;
    this.location = location;
    this.authorName = authorName;
    this.authorImage = authorImage;
    this.commentsCount = commentsCount;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Post({
      id: doc.id,
      userId: data.userId || '',
      topic: data.topic || 'Others',
      content: data.content || '',
      timestamp: data.timestamp?.toDate() || new Date(),
      imageUrl: data.imageUrl,
      location: data.location
    });
  }
}

export class Comment {
  constructor({
    id,
    userId,
    comment,
    timestamp,
    authorName = null,
    authorImage = null
  }) {
    this.id = id;
    this.userId = userId;
    this.comment = comment;
    this.timestamp = timestamp;
    this.authorName = authorName;
    this.authorImage = authorImage;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Comment({
      id: doc.id,
      userId: data.userId || '',
      comment: data.comment || '',
      timestamp: data.timestamp?.toDate() || new Date()
    });
  }
}