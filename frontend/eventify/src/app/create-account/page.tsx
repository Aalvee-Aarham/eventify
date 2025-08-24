'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase'; // Import Firestore instance
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'; // Use full Firestore functions
import { useRouter } from 'next/navigation'; // For Next.js 13 and onwards (use next/navigation instead of useRouter)

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const router = useRouter(); // Ensure you are using the correct import for the Next.js version you are using

  // Sign up with Email and Password
  const handleEmailPasswordSignup = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid); 
      await setDoc(userDocRef, {
        name: '',
        email: user.email,
        accountCreationDate: Timestamp.now(),
        role: 'none', 
        interest: [],
      });

      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Account created successfully!');
      
      // Navigate using useRouter (client-side navigation)
      router.push('/registration');
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
      const user = auth.currentUser;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in successfully!');
        
        router.push('/registration');
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
      await auth.setPersistence(browserLocalPersistence); 
    
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem('user', JSON.stringify(user));

      const userDocRef = doc(db, 'users', user.uid); 
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email,
          accountCreationDate: Timestamp.now(),
          role: 'none',
          interest: [],
        });
      }

      toast.success('Google Sign-In successful!');
      router.push('/registration');
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
