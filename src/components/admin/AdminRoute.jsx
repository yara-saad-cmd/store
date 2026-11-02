import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import "./AdminShared.css"
// بيحمي صفحات الأدمن: مش مسجل ← الدخول، مسجل وغير أدمن ← الرئيسية
export default function AdminRoute({ children }) {
  const { user, loading, isAdmin, adminLoading } = useContext(AuthContext)

  if (loading || adminLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return children
}