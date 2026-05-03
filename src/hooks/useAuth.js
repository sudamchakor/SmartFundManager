import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Import db
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // New useEffect to manage authorProfiles in Firestore
  useEffect(() => {
    const manageAuthorProfile = async () => {
      if (user) {
        const profileRef = doc(db, 'authorProfiles', user.uid);
        const profileData = {
          uid: user.uid,
          displayName: user.displayName || user.email, // Use display name or email
          email: user.email,
          photoURL: user.photoURL || null,
          lastLogin: serverTimestamp(),
          providerData: user.providerData || [], // Add provider data
        };
        try {
          // Use setDoc with merge: true to create or update the profile
          await setDoc(profileRef, profileData, { merge: true });
          console.log('Author profile managed in Firestore for:', user.uid);
        } catch (error) {
          console.error('Error managing author profile in Firestore:', error);
        }
      }
    };

    if (user) {
      manageAuthorProfile();
    }
  }, [user]); // Run this effect whenever the user object changes

  const firebaseLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    logout: firebaseLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
