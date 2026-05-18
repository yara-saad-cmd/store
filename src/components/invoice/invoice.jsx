import React, { useContext } from 'react'
import { ContextCart } from '../context/contextCart';
import { Link } from 'react-router-dom';
import "./invoice.css"
import CartItem from '../cartItem/CartItem';
function Invoice({layout}) {

 
   


    const {cartitems} = useContext(ContextCart);
    const total = cartitems.reduce(
        (acc, itme) => acc + itme.price * itme.quantity,
        0
      );

    const discount = 10;
    const opponent = (total * discount) / 100;
    const subtotal = total - opponent;
    const shipping = 60;
    const totalprice = subtotal + shipping;
  return (
    <div className="invoice">
         <p className="titel">الفاتوره</p>
              <div className="theInvoice">
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
                  السعر الكلي:<span>{totalprice.toFixed(2)}</span>
                </h4>
                
                <div className="button">
          <Link to={layout === "cart" ? "/order-details" : "/Payment"}>
          
            <button>
              {layout === "cart" ? "تابع الشراء" :  "تابع الشراء" } (
              <span>{cartitems.length}</span>)
            </button>


          </Link>


        </div>
              </div>
    </div>
  )
}

export default Invoice;