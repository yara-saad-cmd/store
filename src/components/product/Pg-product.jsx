import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pg-product.css";
import { IoIosStar } from "react-icons/io";
import { TbShoppingCartPlus } from "react-icons/tb";
import ProductLayout from "../body/ProductLayout";
import Loding from "./loding-pg-product";
import Prsdactloding from "../body/product-loading";
import BtmHeader from "../header/btmHeader";
import TopHeader from "../header/topHeader";
import { ContxetCart } from "../context/contextcart";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import ImgPgproduct from "./img-pg-product";
import TitekPpgPproduct from "./titel-pg-product";
import PageTransaction from "../pageTransaction";
import Footertwo from "../footer/footer2";

function Pgproduct() {
  const { id } = useParams();

  const [prodact, setprodact] = useState(null);
  const [loading, setloading] = useState(true);
  const [reladProdact, setreladProdact] = useState([]);
  const [loadingreladProdact, setloadingreladProdact] = useState(true);

  const [visibleCount, setVisibleCount] = useState(12);

  // const { cartitems = [], AddToCart } = useContext(
  //   ContxetCart || "المنتج غير متوفر"
  // );
  const { cartitems, AddToCart } = useContext(ContxetCart);

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
        setreladProdact(data.products);
      })
      .catch((error) => console.error(error))
      .finally(() => setloadingreladProdact(false));
  }, [prodact?.category]);

  if (loading) return <Loding />;
  if (!prodact) return <p>prodact not faunde</p>;

  return (
    <div className="all-pag">
      <header>
        <TopHeader />
        <BtmHeader />
      </header>
      <PageTransaction key={id}>
        <div className="pg-prosact">
          <div className="continar">
            <div className="prdact-arya">
            <ImgPgproduct key={prodact.id} prodact={prodact} />

              <TitekPpgPproduct prodact={prodact} />
            </div>
          </div>

          <hr />
{/* مزيد من المننجات */}
          <div className="mor-product">
            {" "}
            {loadingreladProdact ? (
              <Prsdactloding />
            ) : (
              <ProductLayout title={"مقترحات من نفس الفئه"}>
                {reladProdact.slice(0, visibleCount)
                .filter((item) => item.id !== prodact.id)
                .map((item) => {
                  const incart = cartitems.some((i) => i.id === item.id);

                  const handladdtocart = () => {
                    AddToCart(item);
                    toast.success(
                      <div className="masg">
                        <strong>{item.title}</strong>
                        تم الاضافه الي العربه
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

                        <div className="conttnt">
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
                          <div className="ptm-card">

                            <div className="cart-icon" onClick={handladdtocart}>
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
         {visibleCount < reladProdact.length && (
                  <button className="load-more" onClick={() => setVisibleCount(prev => prev + 12)}>
                    ... عرض المزيد 
                  </button>
                )}
        <Footertwo />
      </PageTransaction>
    </div>
  );
}

export default Pgproduct;
