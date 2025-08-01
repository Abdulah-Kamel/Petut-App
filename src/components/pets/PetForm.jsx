import React, { useState } from 'react';

const PetForm = ({ onCancel, onSubmit, uploading }) => {
  const [petData, setPetData] = useState({
    name: '', type: 'dog', age: '', weight: '', gender: 'male'
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPictureFile(file);
      setPictureUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(petData, pictureFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-secondary-dark p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Add New Pet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
          <input type="text" name="name" value={petData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
          <select name="type" value={petData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white" required>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age (years) *</label>
          <input type="number" name="age" min="0" step="0.5" value={petData.age} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg) *</label>
          <input type="number" name="weight" min="0" step="0.1" value={petData.weight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender *</label>
          <select name="gender" value={petData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pet Photo</label>
          <div className="mt-1 flex items-center space-x-4">
            <img src={pictureUrl || 'https://i.ibb.co/2v7v7xG/paw-print.png'} alt="Pet preview" className="h-20 w-20 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Upload Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600" disabled={uploading}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 disabled:opacity-50" disabled={uploading}>{uploading ? 'Adding Pet...' : 'Add Pet'}</button>
      </div>
    </form>
  );
};

export default PetForm;
