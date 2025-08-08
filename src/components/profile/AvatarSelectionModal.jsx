import React, { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { setUserProfile } from '../../firebase';
import { getDiceBearAvatarList } from '../../utils/fluttermojiUtils';

const AvatarSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  
  const avatars = getDiceBearAvatarList();

  const handleSelect = async () => {
    if (!selectedAvatar || !currentUser) return;
    
    setLoading(true);
    try {
      // Save avatar to Firebase
      await setUserProfile(currentUser.uid, {
        profileImage: selectedAvatar,
        avatarType: 'dicebear'
      });
      
      if (onSelect) {
        onSelect(selectedAvatar);
      }
      onClose();
    } catch (error) {
      console.error('Error saving avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">اختيار أفاتار</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`
                  aspect-square rounded-xl border-2 p-2 transition-all
                  ${selectedAvatar === avatar.id 
                    ? 'border-primary_app border-4 scale-105' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }
                `}
              >
                <div className="w-full h-full rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-2">
                  <img
                    src={avatar.url}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedAvatar || loading}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-colors
                ${selectedAvatar && !loading
                  ? 'bg-primary_app text-white hover:bg-primary_app/90' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'جاري الحفظ...' : 'اختيار'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default AvatarSelectionModal;