// scripts/clearDatabase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

// IMPORTANT: Paste your Firebase config here
// This should be the same config as your seed script and main app.
const firebaseConfig = {
    apiKey: "AIzaSyB6pr6a6y63LvKpauCkonCqyV66WAeJEeg",
    authDomain: "petut-55f40.firebaseapp.com",
    projectId: "petut-55f40",
    storageBucket: "petut-55f40.firebasestorage.app",
    messagingSenderId: "724593819082",
    appId: "1:724593819082:web:7d5ab9881bc9de39c8a333",
    measurementId: "G-JDSBQXNWX0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Deletes all documents within a specified collection.
 * @param {import("firebase/firestore").Firestore} dbInstance - The Firestore database instance.
 * @param {string} collectionPath - The path to the collection to clear.
 */
const clearCollection = async (dbInstance, collectionPath) => {
    try {
        console.log(`Fetching all documents from the '${collectionPath}' collection...`);
        const collectionRef = collection(dbInstance, collectionPath);
        const querySnapshot = await getDocs(collectionRef);

        if (querySnapshot.empty) {
            console.log(`The '${collectionPath}' collection is already empty.`);
            return;
        }

        console.log(`Found ${querySnapshot.size} documents to delete.`);

        // Create an array of delete promises
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            console.log(`Queueing deletion for document: ${doc.id}`);
            deletePromises.push(deleteDoc(doc.ref));
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        console.log('---------------------------------');
        console.log(`Successfully deleted all documents from '${collectionPath}'.`);

    } catch (error) {
        console.error(`Error clearing collection '${collectionPath}':`, error);
        throw error; // Re-throw the error to be caught by the main handler
    }
};

// --- Main Execution ---
const main = async () => {
    try {
        await clearCollection(db, 'products');
        process.exit(0); // Exit the script on success
    } catch (error) {
        console.error('An error occurred during the database clearing process.');
        process.exit(1); // Exit with an error code
    }
};

// Run the main function
main();