import React, { useContext, useState } from 'react'
// import TopHedar from "../heder/topHedar"
// import BtmHedar from "../heder/btmHedar"
import ProductLayout from './ProductLayout'
import { IoIosStar } from "react-icons/io";
import { TbShoppingCartPlus } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { ContxetCart } from "../context/contextcart"
import { FaCheck } from "react-icons/fa6";
import toast from 'react-hot-toast';

function Product({ products, title, isLikePage = false }){
 
 
  const allProducts = Array.isArray(products)
  ? products
  : Object.values(products || {}).flatMap(item =>
      Array.isArray(item) ? item : item.products || []
    );

  

  const { cartitems = [], AddToCart ,removelike } = useContext(ContxetCart);


  const [visibleCount, setVisibleCount] = useState(20);


  console.log(allProducts);


  return (
    <div className="pag-prodacrs">

      {/* <header>
        <TopHedar />
        <BtmHedar />
      </header> */}

      <ProductLayout title={title || "المنتجات"}>

        {allProducts && allProducts.length > 0 ? (
          allProducts.slice(0, visibleCount)
          .map((item) => {

            const incart = cartitems.some(i => i.id === item.id);

            const handladdtocart = () => {
              AddToCart(item);
              toast.success(
                <div className="masg">
                  <strong>{`تم اضافه ${item.title}الي العربه`}</strong>
                  
                </div>,
                { duration: 3000 }
              );
            };

            return (
              <div className={`card ${incart ? "incart" : ""}`} key={item.id}>

              {isLikePage && (

                 
                     <button 
                  className="remove-like-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removelike(item.id);
                  }}
                >
                  إزالة
                </button>

                  
               
              )}    

                <Link to={`/products/${item.id}`}>
                  <div className="img">
                    <img src={item.images && item.images[0]} alt={item.title} />
                  </div>

                  <div className="conttnt">
                    <div className="text">
                      <h3>{item.title}</h3>
                    </div>

                    <div className="StarsAndPrice">
                      <div className="stars">
                        <span>{(item.rating ?? 0).toFixed(1)}</span>
                        <IoIosStar />
                      </div>
                      <h5 className="price">
                        <span>EGP</span> {item.price}
                      </h5>
                    </div>
                  </div>
                </Link>

                <div className="ptm-card">
                  
                  <div className="icon" onClick={handladdtocart}>
                    <TbShoppingCartPlus />
                  </div>

                  <div className="in-cart">
                    {incart && <span className="in-cart-label">في العربة <FaCheck /></span>}
                  </div>
                </div>
               
              </div>
            );
          })
          
        ) : (
          <p>لا توجد منتجات حالياً</p>
        )}

      </ProductLayout>
 {visibleCount < allProducts.length && (
                  <button className="load-more" onClick={() => setVisibleCount(prev => prev + 16)}>
                    ... عرض المزيد 
                  </button>
                )}

    </div>
  );
}

export default Product;
