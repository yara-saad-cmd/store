import React, { useContext } from "react";
import HeaderTwo from "../../components/header/header-2";
import "./cart.css";
import { ContextCart } from "../../components/context/contextcart";
import PageTransition from "../../components/PageTransaction";
import toast from "react-hot-toast"; 
import PageLocation from "../../components/pageLocationFolder/pageLocation"
import Visa from "../../components/visa/visa";import { Link } from "react-router-dom";
import Invoice from "../../components/invoice/invoice";
import CartItem from "../../components/cartItem/CartItem";
import ImgCartEmpty from "../../img/img-cart-ampty.png"
function Cart() {
 
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    delet,
    likeItems,
    AddToLike,
    removelike,
    onColorChange,
    onSizeChange,
  } = useContext(ContextCart);


 
 
      const handleAddToLike = (item) => {
    const inlike = likeItems.some((i) => i.id === item.id);

    if (inlike) {
      removelike(item.id);
      toast?.error?.(`تم حذف ${item.title} من المفضل`);
    } else {
      AddToLike(item);
      toast?.success?.(`تم إضافة ${item.title} إلى المفضل`);
    }
  };


 

  return (
    
    
    <div className="pg-cart">
    <div className="hedar">
      <HeaderTwo />
    </div>

     <PageTransition>

     
            {cartItems.length === 0 ? (
              // حالة العربة فارغة
              <div className="no-goods">
                <img src={ImgCartEmpty} alt="img"/>
                <h2>لم يتم إضافة أي منتجات إلى العربة</h2>
                <Link to="/"> <button className="btn-go-home">تسوق الآن</button></Link>
              
              </div>

            ) : (

        <div className="all-content">
   
        <div className="container">
           <div className="pg-title">
                    <PageLocation />
                  </div>
          <div className="cart">
           
             
              
              
                <div className="cart-goods">

                 
   
                 <div className="title">
                    <p>
                      المنتجات (<span>{cartItems.length}</span>)
                   </p>
                  </div>
  
                  <div className="prdact">
                    {cartItems.map((item) => {
                       const inlike = likeItems.some((i) => i.id === item.id);
                      return (
                        <CartItem
                        key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          item={item}
                          inlike={inlike}
                          onLike={handleAddToLike}
                          onDelete={delet}
                          onIncrease={increaseQuantity}
                          onDecrease={decreaseQuantity}
                          onSizeChange={onSizeChange}
                          onColorChange={onColorChange}
                          layout="cart"
                        />
                      );
                    })}
                  </div>
                </div>
  
                <div className="invoice-area">
                  <div className="invoice">
                    <Invoice layout="cart" />
                  </div>
                  <div className="cach-area">
                    <Visa />
                  </div>
                </div>
              
           
          </div> 
  
        </div>
        
      </div>
     )}
    </PageTransition>
    
  </div>

  );
}

export default Cart;
