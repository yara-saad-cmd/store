import React from 'react'
import TopHeader from '../header/topHeader'
import BtmHeader from '../header/btmHeader'
import "./loading-pg-product.css"
function Loading() {
  return (

    <div className="loading-itm">
  <header>
        <TopHeader />
        <BtmHeader />
      </header>



    <div className='pg-prosact'>
        <div className="container">
            <div className="prdact-area">
                
       <div className="imegs skeleton"></div>



                <div className="title-items ">

                <div className="loading-text-item skeleton h1"></div>

                <div className="loading-text-item1 skeleton h2"></div>
                <div className="loading-text-item1 skeleton h2"></div>

                <div className="loading-text-item skeleton h3"></div>
                <div className="loading-text-item skeleton h3"></div>

                <div className="loading-text-item skeleton h4"></div>
                <div className="loading-text-item skeleton h4"></div>

                <div className="loading-text-item skeleton h3"></div>
                </div>
               
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Loading ;