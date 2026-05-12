import React, { useContext } from 'react'
import TopHedar from '../../components/heder/topHedar'
import BtmHedar from '../../components/heder/btmHedar'
import { ContxetCart } from '../../components/context/contextcart'
import PadgTranschan from '../../components/padgTranschan'
import Prodact from '../../components/body/prodact'
import "./like.css"
import likeimg from "../../img/like.png"
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/footer'
function Like() {

  const {liketitems} = useContext(ContxetCart)
  return (
    
    <div className="pg-like">
      <TopHedar/>
      <BtmHedar/>

      <PadgTranschan>
        <div className="all-like">
            <div className="like-pruda">

          
          <div className="fivrt-prudact">  


                {liketitems.length === 0 ? (
                  <div className="ampty">
                    <img src={likeimg} alt='img nun'/>
                    <p>لم يتم اضافة منتجات الي قائمةالمفضل</p>

                    <Link to="/"> <button className='shop-naw'> تصوق الان </button> </Link>
                   
                  </div>
                  
                ):(
                <div className="like">

                   <div className="title">
                     <h2>قائمة المفضل</h2>
                     </div>

                       <Prodact 
                  products={liketitems}
                  isLikePage={true}
                  title={`المنتجات (${liketitems.length})`}
                />

                </div>

              
               
                )}

           
 
          </div>

        
      </div>
        
        </div>
      

      </PadgTranschan>
      <Footer/>
    </div>
   
  )
}

export default Like