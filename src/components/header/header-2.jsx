import React from 'react'
import logo from "../../img/logo (1).png"
import "./header-2.css"
import { Link } from 'react-router-dom'


function HeaderTwo() {
  return (
    <div className='header-two'>
      <div className="container">
      <Link to="/" className='logo'><img src={logo} alt='logo'/> </Link>

      </div>
    
    </div>
  )
}

export default HeaderTwo