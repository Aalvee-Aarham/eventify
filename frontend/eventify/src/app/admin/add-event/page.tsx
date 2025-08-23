'use client';

import React, { useState } from 'react';
import { db } from '@/app/firebase'; // Firebase Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Firestore functions
import ImageKit from 'imagekit'; // For image uploading to ImageKit
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEventPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [clubName, setClubName] = useState<string>(''); 
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize ImageKit
  const imagekit = new ImageKit({
    publicKey: 'public_xMBxgdtAlKbbms2VTfZfBqz0LeM=',
    privateKey: 'private_q/2e6BpjVW7FS5rLban7dS6xK3E=',
    urlEndpoint: 'https://ik.imagekit.io/aalvee',
  });

  // Handle event image change
  const handleEventImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setEventImage(event.target.files[0]);
    }
  };

  // Upload image to ImageKit and return the URL
  const uploadEventImage = async (): Promise<string | null> => {
    if (!eventImage) return null;

    const file = eventImage;
    const reader = new FileReader();

    return new Promise<string | null>((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64File = reader.result as string;
          const uploadResponse = await imagekit.upload({
            file: base64File,
            fileName: file.name,
          });
          resolve(uploadResponse.url); // Return uploaded image URL
        } catch (error) {
          reject('Error uploading event image');
        }
      };
      reader.onerror = () => reject('Error reading file');
      reader.readAsDataURL(file);
    });
  };

  // Handle event submission
  const handleEventSubmit = async () => {
    if (!title || !location || !startDate || !endDate || !shortDescription || !longDescription || !clubName || !eventImage) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    toast.info('Saving event, please wait...');

    try {
      const imageUrl = await uploadEventImage();

      // Use Firestore's automatic document ID generation
      const eventCollectionRef = collection(db, 'events'); // Reference to the 'events' collection
      const eventDocRef = await addDoc(eventCollectionRef, {
        title,
        location,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        shortDescription,
        longDescription,
        clubName,
        eventImageUrl: imageUrl,
        createdAt: Timestamp.now(),
      });

      toast.success('Event created successfully!');
      console.log('Event saved to Firestore with ID:', eventDocRef.id); // Log the auto-generated document ID
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Error saving event data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Create a New Event</h2>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-4 mb-4">
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <textarea
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Long Description"
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Club Name</label>
          <select
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Tech Club">Tech Club</option>
            <option value="Sports Club">Sports Club</option>
            <option value="Music Club">Music Club</option>
            {/* Add more clubs */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Event Image</label>
          <input
            type="file"
            onChange={handleEventImageChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {eventImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <img
                src={URL.createObjectURL(eventImage)}
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleEventSubmit}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Saving Event...' : 'Create Event'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default AddEventPage;
