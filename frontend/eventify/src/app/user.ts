import { Timestamp } from 'firebase/firestore'; // Import Timestamp for accurate date-time handling

interface User {
  name: string; // The name of the user
  email: string; // The email of the user
  accountCreationDate: Timestamp; // Firebase Timestamp to handle account creation date
  profilePicture?: string; // Optional profile picture URL
  role: string; // User's role (e.g., 'admin', 'user', etc.)
  interest: string[]; // Array of interests (e.g., ['coding', 'gaming', 'music'])
}

export default User;
