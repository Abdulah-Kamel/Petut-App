import React, { useState } from 'react';
import { usePets } from '../pets/usePets';
import PetList from '../pets/PetList';
import PetForm from '../pets/PetForm';
import PetDetailModal from '../pets/PetDetailModal';

const PetsTab = ({ currentUser }) => {
  const { pets, loading, error, setError, addPet, deletePet } = usePets(currentUser);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAddPet = async (petData, pictureFile) => {
    if (!petData.name || !petData.age || !petData.weight) {
      setError('Please fill in all required fields.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await addPet(petData, pictureFile);
      setIsAddingPet(false);
    } catch (err) {
      console.error('Error adding pet:', err);
      setError(`Failed to add pet. ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to permanently delete this pet?")) return;
    try {
      await deletePet(petId);
      setSelectedPet(null); // Close modal on successful deletion
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl dark:text-white font-bold">My Pets</h2>
        {!isAddingPet && (
          <button
            onClick={() => setIsAddingPet(true)}
            className="px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 transition-colors"
          >
            Add Pet
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {isAddingPet ? (
        <PetForm 
          onSubmit={handleAddPet} 
          onCancel={() => setIsAddingPet(false)} 
          uploading={uploading} 
        />
      ) : (
        <PetList 
          pets={pets} 
          loading={loading} 
          onSelectPet={setSelectedPet} 
        />
      )}

      {selectedPet && (
        <PetDetailModal 
          pet={selectedPet} 
          onClose={() => setSelectedPet(null)} 
          onDelete={handleDeletePet} 
        />
      )}
    </div>
  );
};

export default PetsTab;