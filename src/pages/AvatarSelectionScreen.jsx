import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AvatarSelectionScreen = ({ onSelect }) => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  
  const avatars = [
    // Professional
    { icon: '🏥', color: 'bg-blue-500', id: 'doctor_blue' },
    { icon: '⚕️', color: 'bg-green-500', id: 'hospital_green' },
    { icon: '🩺', color: 'bg-red-500', id: 'healing_red' },
    { icon: '🛡️', color: 'bg-purple-500', id: 'health_purple' },
    
    // People
    { icon: '👤', color: 'bg-orange-500', id: 'person_orange' },
    { icon: '😊', color: 'bg-teal-500', id: 'face_teal' },
    { icon: '👨‍💼', color: 'bg-indigo-500', id: 'account_indigo' },
    { icon: '👩‍💼', color: 'bg-brown-500', id: 'person_brown' },
    
    // Fun & Friendly
    { icon: '😄', color: 'bg-amber-500', id: 'emoji_amber' },
    { icon: '😍', color: 'bg-pink-500', id: 'happy_pink' },
    { icon: '❤️', color: 'bg-red-500', id: 'heart_red' },
    { icon: '⭐', color: 'bg-yellow-500', id: 'star_yellow' },
    
    // Animals
    { icon: '🐾', color: 'bg-brown-500', id: 'pets_brown' },
    { icon: '🐕', color: 'bg-green-500', id: 'paw_green' },
    
    // Nature
    { icon: '🌱', color: 'bg-green-500', id: 'eco_green' },
    { icon: '🌸', color: 'bg-pink-500', id: 'flower_pink' },
    
    // Tech
    { icon: '🤖', color: 'bg-green-500', id: 'android_green' },
    { icon: '💻', color: 'bg-blue-500', id: 'computer_blue' },
    
    // Sports
    { icon: '⚽', color: 'bg-black', id: 'soccer_black' },
    { icon: '💪', color: 'bg-red-500', id: 'fitness_red' },
  ];

  const handleSelect = () => {
    if (selectedAvatar && onSelect) {
      onSelect(selectedAvatar);
    }
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-white px-4">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="text-primary_app hover:text-opacity-70 mr-4"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">Choose Avatar</h1>
      </div>

      <div className="p-4">
        <p className="text-lg text-center mb-6">Select your profile avatar</p>
        
        {/* Avatar Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`
                aspect-square rounded-2xl border-2 p-4 transition-all
                ${selectedAvatar === avatar.id 
                  ? 'border-primary_app border-4 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className={`
                w-full h-full rounded-xl ${avatar.color} bg-opacity-10 
                flex items-center justify-center
              `}>
                <span className="text-3xl">{avatar.icon}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Select Button */}
        <button
          onClick={handleSelect}
          disabled={!selectedAvatar}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all
            ${selectedAvatar 
              ? 'bg-primary_app text-white hover:bg-opacity-90' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Select Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarSelectionScreen;