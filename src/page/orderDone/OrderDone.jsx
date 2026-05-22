import React from 'react'
import "./orderDone.css"
import { Link } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import HeaderTwo from '../../components/header/header-2'
import PageTransaction from '../../components/pageTransaction'
import Footer from '../../components/footer/footer'



function OrderDone() {
  return (
    <>
    <div className='pg-orderdane'>
        <HeaderTwo/>
        <PageTransaction>

           <div className="icon-and-content">
            <div className="icon">
            <AiFillCheckCircle />
            </div>

            <h4>تم الطلب</h4>

            <Link to="/">
            <button>الذهاب للصفحه الرسية</button>
            </Link>
            
        </div>
      
        </PageTransaction>
       
        
    </div>
      <Footer/>
    </>
    
  )
}

export default OrderDone