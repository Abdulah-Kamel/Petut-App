import { useState, useEffect, useCallback } from 'react';
import { doc, getDocs, collection, query, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const usePets = (currentUser) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPets = useCallback(async () => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const petsCollectionRef = collection(db, 'users', currentUser.uid, 'pets');
      const petsQuery = query(petsCollectionRef);
      const querySnapshot = await getDocs(petsQuery);
      const petsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsList);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load your pets. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = async (petData, pictureFile) => {
    if (!currentUser?.uid) {
      setError('You must be logged in to add a pet.');
      return null;
    }

    let imageUrl = '';
    if (pictureFile) {
      const apiKey = "01a0445653bd47247515dce07a3f1400";
      const formData = new FormData();
      formData.append("image", pictureFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        imageUrl = result.data.url;
      } else {
        throw new Error('Image upload failed: ' + result.error.message);
      }
    }

    const newPetData = {
      name: petData.name,
      type: petData.type,
      age: Number(petData.age),
      weight: Number(petData.weight),
      gender: petData.gender,
      picture: imageUrl,
      ownerId: currentUser.uid,
      createdAt: serverTimestamp(),
    };

    const petsCollectionRef = collection(db, 'users', currentUser.uid, 'pets');
    const docRef = await addDoc(petsCollectionRef, newPetData);

    const newPetWithId = { id: docRef.id, ...newPetData, createdAt: new Date() };
    setPets(prev => [...prev, newPetWithId]);
    return newPetWithId;
  };

  const deletePet = async (petId) => {
    if (!currentUser?.uid) {
        setError('You must be logged in to delete a pet.');
        return;
    }
    const petDocRef = doc(db, 'users', currentUser.uid, 'pets', petId);
    await deleteDoc(petDocRef);
    setPets(prevPets => prevPets.filter(p => p.id !== petId));
  };

  return { pets, loading, error, setError, addPet, deletePet };
};
