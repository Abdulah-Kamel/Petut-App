// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB6pr6a6y63LvKpauCkonCqyV66WAeJEeg",
  authDomain: "petut-55f40.firebaseapp.com",
  projectId: "petut-55f40",
  storageBucket: "petut-55f40.appspot.com",
  messagingSenderId: "724593819082",
  appId: "1:724593819082:web:7d5ab9881bc9de39c8a333",
  measurementId: "G-JDSBQXNWX0",
};

const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);
// Google Sign-in
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Exports
export { auth, db, messaging, getToken, onMessage };

// Firestore Utility Functions

export async function getUserCart(uid) {
  const cartRef = doc(db, "users", uid, "cart", "cart");
  const cartSnap = await getDoc(cartRef);
  return cartSnap.exists() ? cartSnap.data() : null;
}

export async function setUserCart(uid, cart) {
  const cartRef = doc(db, "users", uid, "cart", "cart");
  await setDoc(cartRef, cart);
}

export async function deleteUserCart(uid) {
  const cartRef = doc(db, "users", uid, "cart", "cart");
  await deleteDoc(cartRef);
}

export async function placeOrder(uid, orderData) {
  const { orderId } = orderData;
  if (!orderId) {
    throw new Error("Order ID is missing");
  }

  // Reference to the main order document
  const mainOrderRef = doc(db, "orders", orderId);
  await setDoc(mainOrderRef, orderData);

  // Reference to the user's specific order document
  const userOrderRef = doc(db, "users", uid, "orders", orderId);
  await setDoc(userOrderRef, orderData);

  return orderId;
}

export async function getUserOrders(uid) {
  const ordersRef = collection(db, "users", uid, "orders");
  const querySnapshot = await getDocs(ordersRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateOrderStatus(uid, orderId, status) {
  const userOrderRef = doc(db, "users", uid, "orders", orderId);
  const mainOrderRef = doc(db, "orders", orderId);

  await updateDoc(userOrderRef, { status });
  await updateDoc(mainOrderRef, { status });
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

export const setUserProfile = async (uid, data) => {
  console.log('setUserProfile called with:', uid, data);
  const userDocRef = doc(db, "users", uid);
  // Use { merge: true } to update fields without overwriting the entire document
  await setDoc(userDocRef, data, { merge: true });
  console.log('Data saved to Firebase successfully');
};
