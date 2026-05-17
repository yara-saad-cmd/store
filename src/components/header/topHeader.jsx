import React, { useContext } from 'react'
import logo from "../../img/logo.png"
import { Link } from 'react-router-dom'
import { FiHeart } from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";
import "./header.css"
import {ContxetCart} from "../context/contextcart"
import Search from './search';


import { useNavigate } from "react-router-dom";
import { IoSearch } from 'react-icons/io5';

function TopHeader() {

  const {cartitems,liketitems} = useContext(ContxetCart)

  const navigate = useNavigate();


  return (
    <div className='tophedar'>
        <div className='container'>
           <div className="logo-img">
            <Link to="/" className='logo'><img src={logo} alt='logo'/> </Link>

           </div>
           
           <Search/>
           

            <div className="icon-hedar">

              <div className="icon-1 mobile-search-icon" onClick={() => navigate("/search-page")}>
                <IoSearch />
                </div>
           

            
              <div className="icon-1">

               <Link to="/like"> 
               <FiHeart />
                <span className='count'>{liketitems.length}</span>
              </Link>
              
              </div>

              <div className="icon-1">

              <Link to="/cart">
              <TbShoppingCart />
                  <span className='count'>{cartitems.length}</span>
              </Link>

              </div>

              <div className="icon-1">
                <Link to="/useraccount" className='user-acount'>  <LuUserRound /> </Link>
             
                 
              </div>


            </div>


        </div>

    </div>
  )
}

export default TopHeader