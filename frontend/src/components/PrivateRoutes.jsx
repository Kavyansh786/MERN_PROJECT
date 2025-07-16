// src/components/PrivateRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoutes({ children }) {
  const isAuthenticated = localStorage.getItem('user') !== null

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
