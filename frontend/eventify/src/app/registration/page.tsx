'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Firebase authentication
import { db } from '../firebase'; // Firestore instance
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'; // Firestore functions
import ImageKit from 'imagekit'; // For image uploading to ImageKit
import { toast, ToastContainer } from 'react-toastify'; // Ensure proper import
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toast

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('student');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null); // To store current user info
  const [isClient, setIsClient] = useState<boolean>(false); // Add client-side flag

  const imagekit = new ImageKit({
    publicKey: 'public_xMBxgdtAlKbbms2VTfZfBqz0LeM=',
    privateKey: 'private_q/2e6BpjVW7FS5rLban7dS6xK3E=',
    urlEndpoint: 'https://ik.imagekit.io/aalvee', // Your ImageKit endpoint
  });

  // Set client flag after mount to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch the current user from Firebase Auth only after mount (useEffect)
  useEffect(() => {
    if (!isClient) return; // Wait for client-side mounting
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log('User fetched from localStorage:', parsedUser);
      fetchUserData(parsedUser.uid);
    } else {
      console.log('No user found in localStorage');
    }
  }, [isClient]);

  // Fetch user data from Firestore
  const fetchUserData = async (userId: string) => {
    console.log('Fetching user data from Firestore:', userId);
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log('User data fetched:', userData);
      setName(userData?.name || '');
      setRole(userData?.role || 'student');
      setProfilePicture(userData?.profilePicture || null);
      setInterests(userData?.interests || []);
    } else {
      console.log('User data does not exist in Firestore');
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  // Upload image to ImageKit and get URL
  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePicture) return null;

    const file = profilePicture;

    // Convert the file to base64 using FileReader
    const reader = new FileReader();
    return new Promise<string | null>((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64File = reader.result as string;
          const uploadResponse = await imagekit.upload({
            file: base64File,
            fileName: file.name,
          });

          resolve(uploadResponse.url); // Wait for the response and then resolve with the URL
        } catch (error) {
          reject('Error uploading profile picture');
        }
      };
      reader.onerror = () => reject('Error reading file');
      reader.readAsDataURL(file); // This converts the file to base64
    });
  };

  // Handle registration submission
  const handleRegistrationSubmit = async () => {
    // Validation check for all fields
    if (!name || !role || !profilePicture || interests.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('No user found'); // Notify error if user is not found
      console.log('No user logged in');
      return;
    }

    setIsLoading(true);
    toast.info('Saving information, please wait...'); // Show loading toast

    try {
      const profilePicUrl = await uploadProfilePicture();
      console.log('Profile picture URL:', profilePicUrl);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        profilePicture: profilePicUrl,
        role,
        interests,
        accountCreationDate: Timestamp.now(),
      });

      toast.success('Registration completed successfully!');
      console.log('User data saved to Firestore');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Error saving user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update interests if role is student
  const handleInterestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInterests((prev) => {
      if (prev.includes(value)) {
        return prev.filter((interest) => interest !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Complete Your Registration</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="admin">Admin</option>
            <option value="club-organizing">Club Organizing</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="mb-4">
  <label className="block text-gray-600 mb-2">Profile Picture</label>
  <input
    type="file"
    onChange={handleProfilePictureChange}
    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  {profilePicture && profilePicture instanceof File && (
    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
      <img
        src={URL.createObjectURL(profilePicture)}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  )}
</div>


        {role === 'student' && (
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Interests</label>
            <div className="flex gap-2 flex-wrap">
              {['Sports', 'Culture', 'Graphics', 'Coding', 'Robotics'].map((interest) => (
                <label key={interest} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={handleInterestChange}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span className="ml-2 text-gray-600">{interest}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRegistrationSubmit}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Saving Information...' : 'Save Info'}
        </button>
      </div>
      {/* Only render ToastContainer on client side */}
      {isClient && (
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      )}
    </div>
  );
};

export default RegistrationPage;
