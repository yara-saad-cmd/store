import React, { useContext } from 'react'
import { ContextCart } from '../context/contextCart';
import { Link } from 'react-router-dom';
import "./invoice.css"
function Invoice({layout}) {

 
   


    const {cartItems} = useContext(ContextCart);
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

    const discount = 10;
    const discountAmount = (total * discount) / 100;
    const subtotal = total - discountAmount;
    const shipping = 60;
    const totalPrice = subtotal + shipping;
  return (
    <div className="invoice">
         <p className="title">الفاتوره</p>
              <div className="the-invoice">
                <h4>
                  اجمالي المنتجات:<span>{total.toFixed(2)}</span>
                </h4>
                <h4 className="pordr">
                  الخصم:<span>{discount}%</span>
                </h4>

                <h4>
                  الاجمالي الفرعي:<span>{subtotal.toFixed(2)}</span>
                </h4>
                <h4>
                  الشحن:<span>{shipping}</span>
                </h4>
                <h4>
                  السعر الكلي:<span>{totalPrice.toFixed(2)}</span>
                </h4>
                
                <div className="button">
          <Link to={layout === "cart" ? "/order-details" : "/payment"}>
          
            <button>
              {layout === "cart" ? "اتمام الطلب" :  "تابع الشراء" } (
              <span>{cartItems.length}</span>)
            </button>


          </Link>


        </div>
              </div>
    </div>
  )
}

export default Invoice;