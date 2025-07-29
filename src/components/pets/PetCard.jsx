import React from 'react';

const PetCard = ({ pet, onSelect }) => (
  <div
    className="border rounded-lg p-4 dark:border-gray-600 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    onClick={onSelect}
  >
    <img
      src={pet.picture || 'https://i.ibb.co/2v7v7xG/paw-print.png'}
      alt={pet.name}
      className="w-20 h-20 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
    />
    <div>
      <h3 className="font-bold text-lg dark:text-white">{pet.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{pet.type}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{pet.age} years, {pet.weight} kg</p>
    </div>
  </div>
);

export default PetCard;
