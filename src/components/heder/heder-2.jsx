import React from 'react'
import logo from "../../img/logo.png"
import "./heder-2.css"
import { Link } from 'react-router-dom'


function HedarTwo() {
  return (
    <div className='herdartwo'>
      <div className="continar">
      <Link to="/" className='logo'><img src={logo} alt='logo'/> </Link>

      </div>
    
    </div>
  )
}

export default HedarTwo