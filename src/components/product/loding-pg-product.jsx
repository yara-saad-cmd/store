import React from 'react'
import TopHeader from '../header/topHeader'
import BtmHeader from '../header/btmHeader'

function Loding() {
  return (

    <div className="loding-itm">
  <header>
        <TopHeader />
        <BtmHeader />
      </header>



    <div className='pg-prosact'>
        <div className="container">
            <div className="prdact-arya">
                
       <div className="imegs skeleton"></div>



                <div className="titel-ietme ">

                <h1 className="loading-text-item skeleton"></h1>
                <h2 className="loading-text-item1 skeleton"></h2>
                <h2 className="loading-text-item1 skeleton"></h2>
                <h3 className="loading-text-item skeleton"></h3>
                <h3 className="loading-text-item skeleton"></h3>
                <h4 className="loading-text-item skeleton"></h4>
                <h4 className="loading-text-item skeleton"></h4>
                <h3 className="loading-text-item skeleton"></h3>
                </div>
               
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Loding ;