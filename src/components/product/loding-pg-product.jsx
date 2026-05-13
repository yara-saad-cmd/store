import React from 'react'
import TopHedar from '../heder/topHedar'
import BtmHedar from '../heder/btmHedar'

function Loding() {
  return (

    <div className="loding-itm">
  <header>
        <TopHedar />
        <BtmHedar />
      </header>



    <div className='pg-prosact'>
        <div className="continar">
            <div className="prdact-arya">
                
       <div className="imegs skiltone"></div>



                <div className="titel-ietme ">

                <h1 className="loading-text-item skiltone"></h1>
                <h2 className="loading-text-item1 skiltone"></h2>
                <h2 className="loading-text-item1 skiltone"></h2>
                <h3 className="loading-text-item skiltone"></h3>
                <h3 className="loading-text-item skiltone"></h3>
                <h4 className="loading-text-item skiltone"></h4>
                <h4 className="loading-text-item skiltone"></h4>
                <h3 className="loading-text-item skiltone"></h3>
                </div>
               
            </div>
        </div>
    </div>
    
    </div>
  )
}

export default Loding ;