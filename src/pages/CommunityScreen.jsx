import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

const CommunityScreen = () => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const topics = ['All', 'Adoption', 'Breeding', 'Others'];

  useEffect(() => {
    let q = collection(db, 'posts');
    
    if (selectedTopic !== 'All') {
      q = query(q, where('topic', '==', selectedTopic));
    }
    
    q = query(q, orderBy('timestamp', sortBy === 'latest' ? 'desc' : 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const post = { id: docSnap.id, ...docSnap.data() };
          
          // Get user data
          try {
            const userDoc = await getDoc(doc(db, 'users', post.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              post.authorName = userData.fullName || 'Unknown User';
              post.authorImage = userData.profileImage;
            }
          } catch (e) {
            post.authorName = 'Unknown User';
          }
          
          return post;
        })
      );
      
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedTopic, sortBy]);

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        alert('Error deleting post');
      }
    }
  };

  const getTopicColor = (topic) => {
    switch (topic) {
      case 'Adoption': return 'bg-green-500';
      case 'Breeding': return 'bg-pink-500';
      default: return 'bg-blue-500';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp.toDate();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-secondary-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-dark">
      <div className="max-w-2xl mx-auto p-4">
      {/* Sort Options */}
      <div className="flex justify-end items-center mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border border-gray-600 bg-[#313340] text-white rounded-lg text-sm focus:outline-none focus:border-primary_app"
        >
          <option value="latest">Latest</option>
          <option value="Oldest">oldest</option>
        </select>
      </div>

      {/* Topic Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedTopic === topic
                ? 'bg-primary_app text-white'
                : 'bg-[#313340] text-gray-300 hover:bg-gray-600'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No posts yet. Be the first to share!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-[#313340] rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {/* Author Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="cursor-pointer hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${post.userId}`);
                    }}
                  >
                    <UserAvatar 
                      imageData={post.authorImage} 
                      userName={post.authorName} 
                      size="w-10 h-10" 
                    />
                  </div>
                  <div>
                    <p 
                      className="font-semibold cursor-pointer hover:text-primary_app text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${post.userId}`);
                      }}
                    >
                      {post.authorName}
                    </p>
                    <p className="text-sm text-gray-400">{formatTime(post.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-white text-xs ${getTopicColor(post.topic)}`}>
                    {post.topic}
                  </span>
                  {user?.uid === post.userId && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const menu = e.target.nextSibling;
                          menu.classList.toggle('hidden');
                        }}
                        className="text-gray-400 hover:text-gray-200 p-1"
                      >
                        ⋮
                      </button>
                      <div className="hidden absolute right-0 mt-2 w-32 bg-[#313340] rounded-md shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-post/${post.id}`);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePost(post.id);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="mb-3 text-gray-300">{post.content}</p>
              
              {/* Image */}
              {post.imageUrl && (
                <img
                  src={`data:image/jpeg;base64,${post.imageUrl}`}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              {/* Actions */}
              <div className="flex items-center text-gray-400 text-sm">
                <span>💬 {post.commentsCount || 0} comments</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button - Bottom Left */}
      <button 
        onClick={() => navigate('/create-post')}
        className="fixed bottom-6 left-6 bg-primary_app text-white w-14 h-14 rounded-full shadow-lg hover:bg-opacity-90 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      </div>
    </div>
  );
};

export default CommunityScreen;