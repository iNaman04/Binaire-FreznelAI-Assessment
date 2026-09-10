import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    return onAuthStateChanged(auth, function (nextUser) {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = {
    user,
    loading,
    signup: function (email, password) {
      return createUserWithEmailAndPassword(auth, email, password);
    },
    login: function (email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    },
    logout: function () {
      return signOut(auth);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}