import React, { useContext } from 'react'
import PageLocation from '../../components/pageLocationFolder/pageLocation'
import HeaderTwo from '../../components/header/header-2'
import UserDataForm from "../../components/userdata/UserData"
import Invoice from '../../components/invoice/invoice'
import "./OrderDetails.css"
import PageTransition from '../../components/pageTransaction'
import CartItem from '../../components/cartItem/CartItem'
import { ContextCart } from '../../components/context/contextCart'
import Footer from '../../components/footer/footer'
function OrderDetails() {
  const { cartItems } = useContext(ContextCart);
  return (
    <PageTransition>

      <div className="pg-ordar-details">
        <HeaderTwo />
        <div className="pg-title">
          <PageLocation />
        </div>
        <div className="all-content">
          <div className="container">
            <div className="details">

              <div className="data-ordar-and-user">
                <div className="details-ordar">
                  {cartItems.map(item => {


                    return (
                      <CartItem
                        key={item.id}
                        item={item}
                        layout="details-ordar"
                      />
                    );
                  })}
                </div>

                <div className='user-data'>
                  <UserDataForm />
                </div>

                
                <div className="maseg">
                 
                    <p>افضل وقت للاستلام في اليوم (اختياري)</p>


                    <div className="time">
                      <div className="time-group">
                        <label htmlFor="appt-one">من الساعة:</label>
                        <input type='time' className='masegs-time' id='appt-one' name='appt-one' />
                      </div>

                      <div className="time-group">
                        <label htmlFor="appt">إلى الساعة:</label>
                        <input type='time' className='masegs-time' id='appt' name='appt' />
                      </div>
                    </div>
                 
                  <textarea className='masegs' placeholder='ملاحظة للبائع (اختياري)' ></textarea>
                </div>
              </div>




              <div className="invoice">
                <Invoice layout="payment" />

              </div>

            </div>
          </div>


        </div>
        <Footer />
      </div>

    </PageTransition>


  )
}

export default OrderDetails