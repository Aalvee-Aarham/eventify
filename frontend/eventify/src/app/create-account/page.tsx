'use client';

import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase'; // Import Firestore instance
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'; // Use full Firestore functions

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign up with Email and Password
  const handleEmailPasswordSignup = async () => {
    setIsLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user details to Firestore with default role "none"
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document in Firestore
      await setDoc(userDocRef, {
        name: '', // You can add the name later if required
        email: user.email,
        accountCreationDate: Timestamp.now(),
        role: 'none', // Default role
        interest: [], // Default empty interests
      });

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Email and Password
  const handleEmailPasswordLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Save user info to localStorage after login
      const user = auth.currentUser;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in successfully!');
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Set persistence to localStorage before signing in with Google
      await auth.setPersistence(browserLocalPersistence); // Ensure persistence is set to browserLocalPersistence
    
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Add user details to Firestore with default role "none"
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document in Firestore
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        // Only add the user details to Firestore if it's a new user
        await setDoc(userDocRef, {
          name: user.displayName || '', // Use display name from Google or leave empty
          email: user.email,
          accountCreationDate: Timestamp.now(),
          role: 'none', // Default role
          interest: [], // Default empty interests
        });
      }

      toast.success('Google Sign-In successful!');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create an Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleEmailPasswordSignup}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up with Email'}
        </button>
        <div className="my-4 text-center text-gray-600">OR</div>
        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in with Google...' : 'Sign Up with Google'}
        </button>

        <div className="text-center text-gray-600 mt-4">
          <span>Already have an account? </span>
          <br />
            <a
            href="/log-in"
            className="text-blue-500 font-semibold hover:underline"
            tabIndex={isLoading ? -1 : 0}
            aria-disabled={isLoading}
            onClick={e => {
              if (isLoading) e.preventDefault();
            }}
            >
            Login here
            </a>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default CreateAccount;
