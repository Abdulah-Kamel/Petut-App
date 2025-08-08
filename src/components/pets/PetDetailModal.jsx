import React from 'react';

const PetDetailModal = ({ pet, onClose, onDelete }) => {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-secondary-dark rounded-lg shadow-xl p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold">&times;</button>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={pet.picture || 'https://i.ibb.co/2v7v7xG/paw-print.png'}
            alt={pet.name}
            className="w-32 h-32 rounded-full object-cover bg-gray-200 dark:bg-gray-700 border-4 border-primary"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold dark:text-white">{pet.name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 capitalize">{pet.type} &bull; {pet.gender}</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-md">
              <div className="dark:text-gray-200"><span className="font-semibold">Age:</span> {pet.age} years</div>
              <div className="dark:text-gray-200"><span className="font-semibold">Weight:</span> {pet.weight} kg</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => onDelete(pet.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Pet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
