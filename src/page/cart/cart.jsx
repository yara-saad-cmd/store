import React, { useContext } from "react";
import HedarTwo from "../../components/header/header-2";
import "./cart.css";
import { ContxetCart } from "../../components//context/contextcart";
import { FaRegHeart } from "react-icons/fa";import { FaHeart, FaRegTrashCan } from "react-icons/fa6";
import PadgTranschan from "../../components/padgTranschan";
import toast from "react-hot-toast"; 
import PageLocation from "../../components/pageLocation"
import Visa from "../../components/visa/visa";import { Link } from "react-router-dom";
import Invoice from "../../components/invoice/invoice";
import CartItem from "../../components/cartItem/CartItem";
import ImgCartAmpty from "../../img/img-cart-ampty.png"
function Cart() {
 
  const {
    cartitems,
    increassQuntity,
    dncreassQuntity,
    delet,
    liketitems,
    AddToLike,
    removelike,
    onColorChange,
    onSizeChange,
  } = useContext(ContxetCart);


 
  const HandelAddToLike = (item) => {
    const inlike = liketitems.some((i) => i.id === item.id);

    if (inlike) {
     
      removelike(item.id);
      toast?.error && toast.error(`تم حذف ${item.title} من المفضل`);
    } else {
      AddToLike(item);
      toast?.success && toast.success(`تم إضافة ${item.title} إلى المفضل`);
    }
  };

 

  return (
    
    
    <div className="pg-cart">
    <div className="hedar">
      <HedarTwo />
    </div>

     <PadgTranschan>

     
            {cartitems.length === 0 ? (
              // حالة العربة فارغة
              <div className="no-prodact">
                <img src={ImgCartAmpty} alt="img"/>
                <h2>لم يتم إضافة أي منتجات إلى العربة</h2>
                <Link to="/"> <button className="butm-go-home">تسوق الان</button></Link>
              
              </div>

            ) : (

        <div className="all-content">
   
        <div className="continar">
           <div className="pg-titel">
                    <PageLocation />
                  </div>
          <div className="cart">
           
             
              
              
                <div className="cart-prodact">

                 
   
                 <div className="titel">
                    <p>
                      المنتجات (<span>{cartitems.length}</span>)
                   </p>
                  </div>
  
                  <div className="prdact">
                    {cartitems.map((item) => {
                       const inlike = liketitems.some((i) => i.id === item.id);
                      return (
                        <CartItem
                          key={item.id}
                          item={item}
                          inlike={inlike}
                          onLike={HandelAddToLike}
                          onDelete={delet}
                          onIncrease={increassQuntity}
                          onDecrease={dncreassQuntity}
                          onSizeChange={onSizeChange}
                          onColorChange={onColorChange}
                          layout="cart"
                        />
                      );
                    })}
                  </div>
                </div>
  
                <div className="invoice-arya">
                  <div className="invoice">
                    <Invoice layout="cart" />
                  </div>
                  <div className="cach-arya">
                    <Visa />
                  </div>
                </div>
              
           
          </div> 
  
        </div>
        
      </div>
     )}
    </PadgTranschan>
    
  </div>

  );
}

export default Cart;
