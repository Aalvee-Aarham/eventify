'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase'; // Import Firestore instance
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Use full Firestore functions

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter(); // Use useRouter hook here, it will work fine in this client component

  // Sign in with Email and Password
  const handleEmailPasswordLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        // Save user info to localStorage after login
        localStorage.setItem('user', JSON.stringify(user));

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (!userSnapshot.exists()) {
          // Create a default user document if it doesn't exist
          await setDoc(userDocRef, {
            email: user.email,
            accountCreationDate: user.metadata.creationTime,
            role: 'none', // Default role
            interest: [],
          });
        }

        toast.success('Logged in successfully!');
        
        // Redirect to the home page
        router.push('/'); // Redirect to the home page
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

      // Add user details to Firestore if not already present
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email,
          accountCreationDate: user.metadata.creationTime,
          role: 'none',
          interest: [],
        });
      }

      toast.success('Google Sign-In successful!');

      // Redirect to the home page
      router.push('/'); // Redirect to the home page
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login to Your Account</h2>
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
          onClick={handleEmailPasswordLogin}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Login with Email'}
        </button>
        <div className="my-4 text-center text-gray-600">OR</div>
        <button
          onClick={handleGoogleLogin}
          className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in with Google...' : 'Login with Google'}
        </button>
        <div className="text-center text-gray-600 mt-4">
          <span>Don’t have an account? </span>
          <br />
            <a
            href="/create-account"
            className="text-blue-500 font-semibold hover:underline"
            tabIndex={isLoading ? -1 : 0}
            aria-disabled={isLoading}
            onClick={e => {
              if (isLoading) e.preventDefault();
            }}
            >
            Create Account Here
            </a>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default Login;
