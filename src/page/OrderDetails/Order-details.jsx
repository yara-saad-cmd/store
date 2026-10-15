import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PageLocation from '../../components/pageLocationFolder/pageLocation'
import HeaderTwo from '../../components/header/header-2'
import UserDataForm from "../../components/userdata/UserData"
import Invoice from '../../components/invoice/invoice'
import "./OrderDetails.css"
import PageTransition from '../../components/PageTransaction'
import CartItem from '../../components/cartItem/CartItem'
import { ContextCart } from '../../components/context/contextcart'
import Footer from '../../components/footer/footer'
function OrderDetails() {
  const { cartItems } = useContext(ContextCart);

  // القيمة الابتدائية بتتقرا من localStorage، فالملاحظة متضيعش لو العميلة عملت Refresh
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem("orderNote") || "";
    } catch (error) {
      console.error("خطأ في قراءة الملاحظة:", error);
      return "";
    }
  });

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setNote(value);

    try {
      localStorage.setItem("orderNote", value);
    } catch (error) {
      console.error("فشل حفظ الملاحظة:", error);
    }
  };

 
   
      if (cartItems.length === 0) {
        return <Navigate to="/cart" replace />;
      }
    
  

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
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
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
                 
                 
                <textarea
                    className='masegs'
                    placeholder='ملاحظة للبائع (اختياري)'
                    value={note}
                    onChange={handleNoteChange}
                    maxLength={500}
                  ></textarea>
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