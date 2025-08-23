import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; // Import initialized Firebase auth instance and googleProvider
import { toast } from 'react-toastify'; // Toast notification library for error messages

// Helper function to show error messages via toast
const showErrorToast = (message: string): void => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
  });
};

// Function to sign up a user
export const signup = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    toast.success(`User signed up: ${user.email}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorToast(`Error signing up: ${error.message}`);
    } else {
      showErrorToast('An unknown error occurred during sign up');
    }
  }
};

// Function to login a user
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    toast.success(`User logged in: ${user.email}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorToast(`Error logging in: ${error.message}`);
    } else {
      showErrorToast('An unknown error occurred during login');
    }
  }
};

// Function to log out a user
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast.success('User logged out successfully', {
      position: 'top-right',
      autoClose: 5000,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorToast(`Error logging out: ${error.message}`);
    } else {
      showErrorToast('An unknown error occurred during logout');
    }
  }
};

// Function to sign in with Google
export const googleLogin = async (): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    toast.success(`User signed in with Google: ${user.email}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorToast(`Error signing in with Google: ${error.message}`);
    } else {
      showErrorToast('An unknown error occurred during Google sign-in');
    }
  }
};
