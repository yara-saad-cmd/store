import React from 'react'
import PageLocation from '../../components/pageLocation'
import HedarTwo from '../../components/heder/heder-2'
import "./payment.css"

import imgVISA from "../../img/1764260377009.png"
import { Link } from 'react-router-dom'
import PadgTranschan from '../../components/padgTranschan'
import Footer from '../../components/footer/footer'


function Payment() {
  return (
    <>
          <HedarTwo />
          <PadgTranschan>
              <div className="pg-cash">
                  <div className="all-paymemt">
                    <div className="continar">

                    <div className="pg-titel">
                      <PageLocation/>
                    </div>

                    <div className="all-content">

                      <div className="Payment-Methods">

                      <div className="radio-group">
                        <h3 className='text-titel'>اختر طريقة الدفع</h3>
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
                            <div className="mor-detals">

                              <button>اضف بطاقه بنكيه</button>

                              <div className="visa">

                              <p>طرق الدفع المتاحه</p>
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

                          <div className="Coupon-inpt">
                              <input  placeholder='كود الخصم'/>
                              <button className='add'>تطبيق</button>
                          </div>

                            <Link to="/OrdreDane"><button className='Order-Tracking'>متابعه</button></Link>
                          
                    </div>

                    </div>
                  
                      
                
                
            
                </div>
               
                 </div>
                   <Footer/>

            </div>
          
          </PadgTranschan>
           
       
    </>
  )
}

export default Payment