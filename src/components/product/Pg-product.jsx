import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pg-product.css";
import ProductLayout from "../body/ProductLayout";
import Loading from "./loading-pg-product";
import BtmHeader from "../header/btmHeader";
import TopHeader from "../header/topHeader";
import { ContextCart } from "../context/contextcart";
import ImgPgproduct from "./img-pg-product";
import TitlePpgPproduct from "./title-pg-product";
import PageTransition from "../pageTransaction";
import Footertwo from "../footer/footer2";

// استيراد الكمبوننت الجديد هنا
import RelatedProducts from "./RelatedProducts"; 

function Pgproduct() {
  const { id } = useParams();

  const [prodact, setprodact] = useState(null);
  const [loading, setloading] = useState(true);
  const [relatedProducts, setrelatedProducts] = useState([]);
  const [loadingrelatedProducts, setloadingrelatedProducts] = useState(true);

  const [visibleCount, setVisibleCount] = useState(12);

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

          {/* استدعاء كمبوننت المنتجات المقترحة وتمرير الـ Props المطلوبة له */}
          <RelatedProducts 
            loadingrelatedProducts={loadingrelatedProducts}
            relatedProducts={relatedProducts}
            visibleCount={visibleCount}
            prodact={prodact}
            cartItems={cartItems}
            AddToCart={AddToCart}
          />
            
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