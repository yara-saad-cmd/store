import React from 'react'
import "./orderDone.css"
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footer from '../../components/footer/footer'

function OrderDone() {
  const location = useLocation()
  const orderId = location.state?.orderId

  // لو حد فتح الصفحة بالرابط مباشرة من غير طلب، نرجّعه للرئيسية
  if (!orderId) {
    return <Navigate to="/" replace />
  }

  return (
    <div className='page-order-done'>
      <PageTransition>
        <HeaderTwo />

        <div className="icon-and-content">
          <div className="icon">
            <AiFillCheckCircle />
          </div>

          <h4>تم الطلب</h4>

          <p className="order-number">
            رقم طلبك: <strong>#{orderId}</strong>
          </p>
          <p className="order-number-hint">
            احتفظي برقم الطلب للرجوع إليه
          </p>

          <Link to="/">
            <button>الذهاب للصفحة الرئيسية</button>
          </Link>
        </div>

        <Footer />
      </PageTransition>
    </div>
  )
}

export default OrderDone