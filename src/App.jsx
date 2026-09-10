import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./services/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Models from "./pages/Models";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-center"><div className="loader" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/models" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}