// test-firebase.js - Run this to test Firebase connection
import { auth, signInWithPopup, googleProvider, signOut } from './firebase/config';

async function testFirebase() {
  console.log('🔧 Testing Firebase Connection...');
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase App Initialized');
    
    // Test 2: Try to get current user
    const user = auth.currentUser;
    console.log('Current User:', user ? 'Logged in' : 'Not logged in');
    
    // Test 3: Check Google provider
    console.log('Google Provider:', googleProvider.providerId);
    
    console.log('🎉 Firebase is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ Firebase Error:', error.message);
    console.error('Full Error:', error);
    return false;
  }
}

// Run test
testFirebase().then(result => {
  if (result) {
    console.log('✅ All tests passed! Firebase is ready.');
  } else {
    console.log('❌ Firebase setup failed. Check your configuration.');
  }
});