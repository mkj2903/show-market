import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  signInWithPopup, 
  googleProvider, 
  signOut,
  onAuthStateChanged 
} from '../firebase/config';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Google Login
  const loginWithGoogle = async () => {
    try {
      setError('');
      console.log('🔐 Starting Google login...');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('✅ Firebase login successful:', user.email);

      // Check if email is Gmail
      if (!user.email.endsWith('@gmail.com')) {
        await signOut(auth);
        throw new Error('Only Gmail accounts are allowed');
      }

      // Send user data to backend
      console.log('📡 Sending user data to backend...');
      const response = await authAPI.register({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      });

      console.log('✅ Backend registration successful');

      // Store user in localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        token: response.data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 User saved to localStorage');

      setCurrentUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Demo login (without Firebase)
  const loginWithDemo = async () => {
    try {
      setError('');
      
      const demoUser = {
        uid: `demo_${Date.now()}`,
        email: 'demo@gmail.com',
        name: 'Demo User',
        photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
      };
      
      // Send to backend
      const response = await authAPI.register(demoUser);
      
      const userData = {
        ...demoUser,
        token: response.data.token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Demo login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      setCurrentUser(null);
      window.location.href = '/';
    } catch (error) {
      setError(error.message);
      console.error('Logout error:', error);
    }
  };

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has Gmail
        if (user.email.endsWith('@gmail.com')) {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          } else {
            // If no saved user, create one
            const userData = {
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              photoURL: user.photoURL
            };
            setCurrentUser(userData);
          }
        } else {
          await signOut(auth);
          localStorage.removeItem('user');
          setCurrentUser(null);
          setError('Only Gmail accounts are allowed');
        }
      } else {
        // Check if we have demo user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.email === 'demo@gmail.com') {
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithDemo,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};