import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState();

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // function signUp(fName, email, password) {
  //   // Create a new user with email and password
  //   createUserWithEmailAndPassword(auth, email, password, )
  //     .then((userCredential) => {
  //       // Once the user is created, update their display name
  //       return updateProfile(userCredential.user, {
  //         displayName: fName
  //       })
  //         .then(() => {
  //           // Display name updated successfully
  //           console.log('Display name updated successfully');
  //         })
  //         .catch((error) => {
  //           // Handle errors updating display name
  //           console.error('Error updating display name:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       // Handle errors creating user
  //       console.error('Error creating user:', error);
  //     });
  // }
  async function signUp(email, password, fName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with the full name
      await updateProfile(userCredential.user, {
        firstName: fName,
        lastName: fName,

      });
      setUser(userCredential.user); // Set the user in your context
      return userCredential.user; // Return the user object
    } catch (error) {
      throw error;
    }
  }
  
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the user state when authentication state changes
      setUser(user);
    });

    // Check for the current user when the app loads
    const initialUser = auth.currentUser;
    if (initialUser) {
      setUser(initialUser);
    }

    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}