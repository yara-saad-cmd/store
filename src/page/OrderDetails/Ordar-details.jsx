import React, { useContext } from 'react'
import PageLocation from '../../components/pageLocation'
import HedarTwo from '../../components/header/header-2'
import UserDataForm from "../../components/userdata/UsaerData"
import Invoice from '../../components/invoice/invoice'
import "./OrderDatails.css"
import PadgTranschan from '../../components/padgTranschan'
import CartItem from '../../components/cartItem/CartItem'
import { ContxetCart } from '../../components/context/contextcart'
import Footer from '../../components/footer/footer'
function OrdarDetails() {
  const { cartitems } = useContext(ContxetCart);
  return (
    <PadgTranschan>

      <div className="pg-ordar-detalis">
        <HedarTwo />
        <div className="pg-titel">
          <PageLocation />
        </div>
        <div className="all-content">
          <div className="continar">
            <div className="detalis">

              <div className="data-ordar-and-user">
                <div className="detalis-ordar">
                  {cartitems.map(item => {


                    return (
                      <CartItem
                        key={item.id}
                        item={item}
                        layout="detalis-ordar"
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
                 
                  <textarea className='masegs' placeholder='ملاحظه للبائع (اختياري)' ></textarea>
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

    </PadgTranschan>


  )
}

export default OrdarDetails