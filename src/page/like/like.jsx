import React, { useContext } from 'react'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import { ContextCart } from '../../components/context/contextcart'
import PageTransition from '../components/pageTransaction'
import Product from '../../components/body/product'
import "./like.css"
import likeimg from "../../img/like.png"
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/footer'
function Like() {

  const {likeItems} = useContext(ContextCart)
  return (
    
    <div className="pg-like">
      

      <PageTransition>
        <TopHeader/>
      <BtmHeader/>
        <div className="all-like">
            <div className="like-pruda">

          
          <div className="fivrt-prudact">  


                {likeItems.length === 0 ? (
                  <div className="empty-state">
                    <img src={likeimg} alt='قائمة المفضلات'/>
                    <p>لم يتم اضافة منتجات الي قائمة المفضلات</p>

                    <Link to="/"> <button className='btn-shop-now'> تصوق الان </button> </Link>
                   
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
      <Footer/>

      </PageTransition>
      
    </div>
   
  )
}

export default Like