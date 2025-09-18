
'use client';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOut() {
    return firebaseSignOut(auth);
}

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

export async function updateUserProfile(profileData) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user is signed in.');
  await updateProfile(user, profileData);
}

export async function updateUserPassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No user is signed in.');

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  // Re-authenticate the user
  await reauthenticateWithCredential(user, credential);
  
  // Now, update the password
  await updatePassword(user, newPassword);
}
