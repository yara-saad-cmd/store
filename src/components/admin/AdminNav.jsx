import React from 'react'
import { NavLink } from 'react-router-dom'
import './AdminNav.css'

const getClassName = ({ isActive }) => (isActive ? 'active' : '')

export default function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="لوحة التحكم">
      <NavLink to="/admin" end className={getClassName}>الطلبات</NavLink>
      <NavLink to="/admin/products" className={getClassName}>المنتجات</NavLink>
    </nav>
  )
}