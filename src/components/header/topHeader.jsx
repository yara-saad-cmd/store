import React, { useContext } from 'react'
import logo from "../../img/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";
import "./TopHeader.css"
import {ContextCart} from "../context/contextcart"
import Search from './search';



import { IoSearch } from 'react-icons/io5';

function TopHeader() {

  const {cartItems,likeItems} = useContext(ContextCart)

  const navigate = useNavigate();


  return (
    <div className='top-header'>
        <div className='container'>
           <div className="logo-img">
            <Link to="/" className='logo'><img src={logo} alt='logo'/> </Link>

           </div>
           
           <Search/>
           

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
                <Link to="/user-account" className='user-account'>  <LuUserRound /> </Link>
             
                 
              </div>


            </div>


        </div>

    </div>
  )
}

export default TopHeader