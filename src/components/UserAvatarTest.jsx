import React from 'react';
import UserAvatar from './UserAvatar';

// Test component to verify UserAvatar works with different image types
const UserAvatarTest = () => {
  const testCases = [
    {
      name: 'URL Image',
      imageData: 'https://example.com/image.jpg',
      userName: 'John Doe'
    },
    {
      name: 'Base64 Image',
      imageData: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      userName: 'Jane Smith'
    },
    {
      name: 'Avatar ID',
      imageData: 'doctor_blue',
      userName: 'Dr. Brown'
    },
    {
      name: 'No Image',
      imageData: null,
      userName: 'Anonymous User'
    },
    {
      name: 'Empty String',
      imageData: '',
      userName: 'Empty User'
    }
  ];

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">UserAvatar Test Cases</h2>
      {testCases.map((testCase, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <UserAvatar 
            imageData={testCase.imageData} 
            userName={testCase.userName}
            size="w-12 h-12"
          />
          <div>
            <p className="font-semibold">{testCase.name}</p>
            <p className="text-sm text-gray-600">{testCase.userName}</p>
            <p className="text-xs text-gray-400">
              Image: {testCase.imageData ? 
                (testCase.imageData.length > 50 ? 
                  `${testCase.imageData.substring(0, 50)}...` : 
                  testCase.imageData
                ) : 'null'
              }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAvatarTest;