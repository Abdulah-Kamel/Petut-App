import React from 'react';
import PetCard from './PetCard';
import LoadingAnimation from '../common/LoadingAnimation';

const PetList = ({ pets, loading, onSelectPet }) => {
  if (loading) {
    return <LoadingAnimation />;
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl dark:text-white font-semibold mb-2">No pets yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Add your furry friends to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map(pet => <PetCard key={pet.id} pet={pet} onSelect={() => onSelectPet(pet)} />)}
    </div>
  );
};

export default PetList;
