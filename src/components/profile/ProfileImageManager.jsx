import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineCamera, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi';

import ImageEditor from '../common/ImageEditor';

const ProfileImageManager = ({ 
  profileImage, 
  onImageChange, 
  onImageDelete, 
  onAvatarSelect,
  userName = "User" 
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleImageClick = () => {
    setShowOptions(!showOptions);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        setTempImage(base64);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = (editedImage) => {
    // Convert base64 back to file for upload
    const byteCharacters = atob(editedImage);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], 'profile-image.jpg', { type: 'image/jpeg' });
    
    if (onImageChange) {
      onImageChange(file);
    }
    setShowEditor(false);
    setTempImage(null);
  };

  const handleImageCancel = () => {
    setShowEditor(false);
    setTempImage(null);
  };

  const handleDelete = () => {
    if (onImageDelete) {
      onImageDelete();
    }
    setShowOptions(false);
  };



  const renderImage = () => {
    if (profileImage) {
      // Regular image
      return (
        <img
          src={profileImage}
          alt={userName}
          className="w-full h-full rounded-full object-cover border border-gray-200 dark:border-gray-600"
        />
      );
    }
    
    // Default fallback
    const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    return (
      <div className="w-full h-full rounded-full bg-primary_app flex items-center justify-center text-white font-bold text-xl border border-gray-200 dark:border-gray-600">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Profile Image */}
      <div 
        className="w-28 h-28 cursor-pointer relative group"
        onClick={handleImageClick}
      >
        {renderImage()}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <HiOutlineCamera className="text-white text-2xl" />
        </div>
      </div>

      {/* Options Menu */}
      {showOptions && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 min-w-48"
        >
          <button
            onClick={handleFileSelect}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-200 rounded-t-lg"
          >
            <HiOutlineCamera className="text-lg" />
            <span>رفع صورة جديدة</span>
          </button>
          

          {profileImage && (
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 text-red-500 border-t border-gray-100 dark:border-gray-600 rounded-b-lg"
            >
              <HiOutlineTrash className="text-lg" />
              <span>حذف الصورة</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Editor Modal */}
      {showEditor && tempImage && (
        <ImageEditor
          imageData={tempImage}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
};



export default ProfileImageManager;