import React, { useContext } from 'react'
import logo from "../../img/logo (1).png"
import { Link, useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";
import "./TopHeader.css"
import { ContextCart } from "../context/contextcart"
import { AuthContext } from "../context/AuthContext"
import Search from './search';
import { IoSearch } from 'react-icons/io5';

function TopHeader() {

  const { cartItems, likeItems } = useContext(ContextCart)
  const { user, loading } = useContext(AuthContext)

  const navigate = useNavigate();

  // مفيش حاجة بتظهر لحد ما نعرف حالة الدخول، عشان الكلمة ما تظهرش ثانية وتختفي
  let accountLink = null
  if (!loading) {
    accountLink = user ? (
      <Link to="/user-account" className='user-account' aria-label="حسابي">
        <LuUserRound />
      </Link>
    ) : (
      <Link to="/login" className="login-link">تسجيل الدخول</Link>
    )
  }

  return (
    <div className='top-header'>
      <div className='container'>
        <div className="logo-img">
          <Link to="/" className='logo'><img src={logo} alt='logo' /></Link>
        </div>

        <Search />

        <div className="icon-header">

          <button
            type="button"
            className="icon-1 mobile-search-icon"
            onClick={() => navigate("/search-page")}
            aria-label="البحث"
          >
            <IoSearch />
          </button>

          <div className="icon-1">
            <Link to="/like">
              <FiHeart />
              <span className='count'>{likeItems.length}</span>
            </Link>
          </div>

          <div className="icon-1">
            <Link to="/cart">
              <TbShoppingCart />
              <span className='count'>
                {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </span>
            </Link>
          </div>

          <div className="icon-1">
            {accountLink}
          </div>

        </div>
      </div>
    </div>
  )
}

export default TopHeader