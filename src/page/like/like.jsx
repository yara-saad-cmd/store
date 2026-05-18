import React, { useContext } from 'react'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import { ContextCart } from '../../components/context/contextcart'
import PageTransaction from '../../components/pageTransaction'
import Product from '../../components/body/product'
import "./like.css"
import likeimg from "../../img/like.png"
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/footer'
function Like() {

  const {likeItems} = useContext(ContextCart)
  return (
    
    <div className="pg-like">
      <TopHeader/>
      <BtmHeader/>

      <PageTransaction>
        <div className="all-like">
            <div className="like-pruda">

          
          <div className="fivrt-prudact">  


                {likeItems.length === 0 ? (
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

                       <Product 
                  products={likeItems}
                  isLikePage={true}
                  title={`المنتجات (${likeItems.length})`}
                />

                </div>

              
               
                )}

           
 
          </div>

        
      </div>
        
        </div>
      

      </PageTransaction>
      <Footer/>
    </div>
   
  )
}

export default Like