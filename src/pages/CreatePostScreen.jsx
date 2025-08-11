import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import ImageUploadWithEditor from '../components/common/ImageUploadWithEditor';

const CreatePostScreen = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('Others');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const topics = ['Adoption', 'Breeding', 'Others'];

  const handleImageChange = (imageData) => {
    setImage(imageData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        topic,
        content: content.trim(),
        timestamp: serverTimestamp(),
        imageUrl: image,
        location: null,
      });

      navigate('/community');
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to create a post</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary_app">Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary_app"
            >
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary_app resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <ImageUploadWithEditor
            onImageChange={handleImageChange}
            currentImage={image}
            label="صورة (اختيارية)"
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostScreen;