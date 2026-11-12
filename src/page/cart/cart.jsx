import React, { useContext } from "react";
import HeaderTwo from "../../components/header/header-2";
import "./cart.css";
import { ContextCart } from "../../components/context/contextcart";
import PageTransition from "../../components/PageTransaction";
import toast from "react-hot-toast"; 
import PageLocation from "../../components/pageLocationFolder/pageLocation"
import { Link } from "react-router-dom";
import Invoice from "../../components/invoice/invoice";
import CartItem from "../../components/cartItem/CartItem";
import ImgCartEmpty from "../../img/img-cart-ampty.png"
import useCartStatus from "../../components/context/useCartStatus"
import { withLivePrice } from "../../components/utils/pricing"

// رسايل التنبيه على المنتج، وتقدري تعدليها براحتك
const PROBLEM_MESSAGES = {
  removed: "المنتج ده لم يعد متاحاً، احذفيه من العربة للمتابعة",
  out_of_stock: "المنتج ده غير متوفر حالياً، احذفيه من العربة للمتابعة",
  
}





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

  const { problems, live } = useCartStatus(cartItems);

  // تغيّر السعر تنبيه بس، أما المحذوف وغير المتوفر فبيمنعوا المتابعة
   // أي مشكلة (منتج محذوف أو غير متوفر) بتمنع المتابعة
   const hasBlockingProblem = Object.keys(problems).length > 0;

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
                      const problem = problems[item.id];
                      return (
                        <div
                          className={`cart-row ${problem ? "has-problem" : ""}`}
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                        >
                                                    <CartItem
                            item={withLivePrice(item, live[item.id])}
                            inlike={inlike}
                            onLike={handleAddToLike}
                            onDelete={delet}
                            onIncrease={increaseQuantity}
                            onDecrease={decreaseQuantity}
                            onSizeChange={onSizeChange}
                            onColorChange={onColorChange}
                            layout="cart"
                          />
                          {problem && (
                            <p className="cart-problem" role="alert">
                              {PROBLEM_MESSAGES[problem]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
  
                <div className="invoice-area">
                <div className="invoice">
                <Invoice layout="cart" blocked={hasBlockingProblem} />
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
