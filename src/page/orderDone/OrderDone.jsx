import React from 'react'
import "./orderDone.css"
import { Link } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/pageTransaction'
import Footer from '../../components/footer/footer'



function OrderDone() {
  return (
    <>
    <div className='page-order-done'>
        <HeaderTwo/>
        <PageTransition>

           <div className="icon-and-content">
            <div className="icon">
            <AiFillCheckCircle />
            </div>

            <h4>تم الطلب</h4>

            <Link to="/">
            <button>الذهاب للصفحة الرئيسية</button>
            </Link>
            
        </div>
      
        </PageTransition>
       
        
    </div>
      <Footer/>
    </>
    
  )
}

export default OrderDone