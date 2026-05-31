import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pg-product.css";
import { IoIosStar } from "react-icons/io";
import { TbShoppingCartPlus } from "react-icons/tb";
import ProductLayout from "../body/ProductLayout";
import Loading from "./loading-pg-product";
import ProductLoading from "../body/product-loading";
import BtmHeader from "../header/btmHeader";
import TopHeader from "../header/topHeader";
import { ContextCart } from "../context/contextcart";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import ImgPgproduct from "./img-pg-product";
import TitlePpgPproduct from "./title-pg-product";
import PageTransition from "../pageTransaction";
import Footertwo from "../footer/footer2";

function Pgproduct() {
  const { id } = useParams();

  const [prodact, setprodact] = useState(null);
  const [loading, setloading] = useState(true);
  const [relatedProducts, setrelatedProducts] = useState([]);
  const [loadingrelatedProducts, setloadingrelatedProducts] = useState(true);

  const [visibleCount, setVisibleCount] = useState(12);

  // const { cartItems = [], AddToCart } = useContext(
  //   ContextCart || "المنتج غير متوفر"
  // );
  const { cartItems, AddToCart } = useContext(ContextCart);

  useEffect(() => {
    const fetchProdact = async () => {
      setprodact(null);     // يمسح بيانات المنتج القديم فوراً
      setloading(true);     // يظهر شاشة التحميل (Loading)
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setprodact(data);
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProdact();
  }, [id]);

  useEffect(() => {
    if (!prodact) return;

    fetch(`https://dummyjson.com/products/category/${prodact.category}`)
      .then((res) => res.json())
      .then((data) => {
        setrelatedProducts(data.products);
      })
      .catch((error) => console.error(error))
      .finally(() => setloadingrelatedProducts(false));
  }, [prodact?.category]);

  if (loading) return <Loading />;
  if (!prodact) return <p>prodact not found</p>;

  return (
    <div className="all-page">
      <header>
        <TopHeader />
        <BtmHeader />
      </header>
      <PageTransition key={id}>
        <div className="pg-prosact">
          <div className="container">
            <div className="prdact-area">
            <ImgPgproduct key={prodact.id} prodact={prodact} />

              <TitlePpgPproduct prodact={prodact} />
            </div>
          </div>

          <hr />
{/* مزيد من المننجات */}
          <div className="mor-product">
            {" "}
            {loadingrelatedProducts ? (
              <ProductLoading />
            ) : (
              <ProductLayout title={"مقترحات من نفس الفئة"}>
                {relatedProducts.slice(0, visibleCount)
                .filter((item) => item.id !== prodact.id)
                .map((item) => {
                  const incart = cartItems.some((i) => i.id === item.id);

                  const handleAddToCart = () => {
                    AddToCart(item);
                    toast.success(
                      <div className="msg">
                        <strong>{item.title}</strong>
                        تمت الإضافة إلى العربة
                      </div>,
                      { duration: 3000 }
                    );
                  };

                  return (
                    <div
                      className={`card ${incart ? "incart" : ""}`}
                      key={item.id}
                    >
                      <Link key={item.id} to={`/products/${item.id}`}>
                        <div className="img">
                          <img src={item.images[0]} alt={item.title} />
                        </div>

                        <div className="content">
                          <div className="text">
                            <h3>{item.title}</h3>
                          </div>

                          <div className="StarsAndPrice">



                            <div className="stars">
                              <span>{item.rating.toFixed(1)}</span>{" "}
                              <IoIosStar />
                              
                            </div>
                            <h5 className="price">
                              <span>EGP </span>
                              {item.price}
                            </h5>
                          </div>

                         
                        </div>
                      </Link>
                          <div className="btm-card">

                            <div className="cart-icon" onClick={handleAddToCart}>
                              <TbShoppingCartPlus />
                            </div>

                            <div className="in-cart">
                              {incart && (
                                <span className="in-cart-label">
                                  في العربة <FaCheck />{" "}
                                </span>
                        )}
                      </div>
                          </div>
                     

                    </div>
                  );
                })}
               
</ProductLayout>
            )}
              
          </div>
          
        </div>
         {visibleCount < relatedProducts.length && (
                  <button className="load-more" onClick={() => setVisibleCount(prev => prev + 12)}>
                    ... عرض المزيد 
                  </button>
                )}
        <Footertwo />
      </PageTransition>
    </div>
  );
}

export default Pgproduct;
