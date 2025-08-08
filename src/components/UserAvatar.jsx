import React, { useState, useEffect } from 'react';
import { avatarMapping, getAvatarIcon, AvatarIcon } from '../utils/avatarMapping.jsx';
import { isDiceBearAvatar } from '../utils/fluttermojiUtils';

const UserAvatar = ({ imageData, userName, size = 'w-10 h-10' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  
  // Get initials for fallback
  const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  
  // Reset error state when imageData changes
  useEffect(() => {
    setImageError(false);
    setImageSrc(null);
    
    if (imageData && imageData.trim()) {
      // Check if it's a URL (starts with http)
      if (imageData.startsWith('http')) {
        setImageSrc(imageData);
      }
      // Check if it's already a data URL
      else if (imageData.startsWith('data:image/')) {
        setImageSrc(imageData);
      }
      // Check if it's base64 (long string, no underscores, no http)
      else if (imageData.length > 50 && !imageData.includes('_') && !imageData.startsWith('http')) {
        setImageSrc(`data:image/jpeg;base64,${imageData}`);
      }
    }
  }, [imageData]);
  
  // Check if it's a DiceBear avatar
  if (imageData && isDiceBearAvatar(imageData)) {
    return (
      <img
        src={imageData}
        alt={userName || 'User'}
        className={`${size} rounded-full object-cover border border-gray-200 dark:border-gray-600`}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Check if it's an avatar ID from mapping
  if (imageData && typeof imageData === 'string' && avatarMapping[imageData]) {
    return (
      <div className={`${size} rounded-full bg-gray-100 flex items-center justify-center`}>
        <AvatarIcon avatarId={imageData} size={parseInt(size.split('-')[1]) * 2} />
      </div>
    );
  }
  
  // Check if it's an emoji avatar (contains underscore)
  if (imageData && typeof imageData === 'string' && imageData.includes('_') && !imageData.startsWith('http') && !imageData.startsWith('data:')) {
    return (
      <div className={`${size} rounded-full bg-gray-100 flex items-center justify-center`}>
        <AvatarIcon avatarId={imageData} size={parseInt(size.split('-')[1]) * 2} />
      </div>
    );
  }
  
  // Check if we have a valid image source and no error occurred
  if (imageSrc && !imageError) {
    return (
      <img
        src={imageSrc}
        alt={userName || 'User'}
        className={`${size} rounded-full object-cover border border-gray-200`}
        onError={() => {
          console.log('Image failed to load:', imageSrc);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', imageSrc);
        }}
      />
    );
  }
  
  // Fallback to initials
  return (
    <div className={`${size} rounded-full bg-primary_app flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
      {initials}
    </div>
  );
};



export default UserAvatar;