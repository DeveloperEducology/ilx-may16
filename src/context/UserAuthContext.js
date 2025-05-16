import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { auth, db } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // Add user to Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        isNewUser: true,
        isVerified: false,
        createdAt: new Date().toISOString(),
        userId: newUser.uid,
        role: "tutor",
      });

      console.log(
        `User data saved successfully for ${newUser.email} with UID: ${newUser.uid}`
      );
      return userCredential;
    } catch (error) {
      console.error("Error saving user data to Firestore:", error.message);
      throw error;
    }
  }

  async function googleSignIn() {
    try {
      const googleAuthProvider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const newUser = userCredential.user;

      // Add user to Firestore
      await setDoc(
        doc(db, "users", newUser.uid),
        {
          email: newUser.email,
          isNewUser: true,
          isVerified: false,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(
        `User data saved successfully for ${newUser.email} with UID: ${newUser.uid}`
      );
      return userCredential;
    } catch (error) {
      console.error("Error saving user data to Firestore:", error.message);
      throw error;
    }
  }

  function logOut() {
    Cookies.remove("user");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        "Auth state changed:",
        currentUser ? currentUser.email : "No user"
      );
      if (currentUser) {
        Cookies.set("user", JSON.stringify(currentUser), { expires: 7 });
        setUser(currentUser);
      } else {
        Cookies.remove("user");
        setUser(null);
      }
    });

    return () => unsubscribe();
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
