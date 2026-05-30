import React from 'react'
import PageLocation from '../../components/pageLocation'
import HeaderTwo from '../../components/header/header-2'
import "./payment.css"

import imgVISA from "../../img/1764260377009.png"
import { Link } from 'react-router-dom'
import PageTransition from '../../components/pageTransaction'
import Footer from '../../components/footer/footer'


function Payment() {
  return (
    <>
          <HeaderTwo />
          <PageTransition>
              <div className="pg-cash">
                  <div className="all-payment">
                    <div className="container">

                    <div className="pg-title">
                      <PageLocation/>
                    </div>

                    <div className="all-content">

                      <div className="payment-methods">

                      <div className="radio-group">
                        <h3 className='text-title'>اختر طريقة الدفع</h3>
                        <label className="radio-card">
                          <input type="radio" name="pay" />
                          <span className="custom-radio"></span>

                          <div className="radio-content">
                            <span className="text">الدفع عند الاستلام</span>
                            <p className="desc">معلومات حول الدفع عند الاستلام </p>
                          </div>

                        </label>

                        <label className="radio-card">
                          <input type="radio" name="pay" />
                          <span className="custom-radio"></span>
                           
                          <div className="radio-content">
                            <span className="text">الدفع بالفيزا</span>
                            <p className="desc">معلومات حول الدفع باستخدام البطاقة البنكية </p>
                            <div className="more-details">

                              <button>اضف بطاقه بنكيه</button>

                              <div className="visa">

                              <p>طرق الدفع المتاحة</p>
                              <span><img src={imgVISA} alt='img'/></span>
                              <span><img src={imgVISA} alt='img'/></span>
                              <span><img src={imgVISA} alt='img'/></span>

                              </div>

                            </div>
                            
                          </div>

                        </label>
                      </div>


                    </div>

                    <div className="Coupon">

                          <p className='text'>كود الخصم الخاص بك</p>

                          <div className="coupon-input">
                              <input  placeholder='كود الخصم'/>
                              <button className='add'>تطبيق</button>
                          </div>

                            <Link to="/order-done"><button className='btn-submit-order'>متابعة</button></Link>
                          
                    </div>

                    </div>
                  
                      
                
                
            
                </div>
               
                 </div>
                   <Footer/>

            </div>
          
          </PageTransition>
           
       
    </>
  )
}

export default Payment