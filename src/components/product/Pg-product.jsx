import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Pg-product.css";
import Loading from "./loading-pg-product";
import BtmHeader from "../header/btmHeader";
import TopHeader from "../header/topHeader";
import { ContextCart } from "../context/contextcart";
import ImgPgproduct from "./img-pg-product";
import TitlePpgPproduct from "./title-pg-product";
import PageTransition from "../pageTransaction";
import Footertwo from "../footer/footer2";
import { supabase } from '../../supabaseClient'; 

// استيراد الكمبوننت الجديد هنا
import RelatedProducts from "./RelatedProducts"; 

function Pgproduct() {
  const { id } = useParams();

  const [prodact, setprodact] = useState(null);
  const [loading, setloading] = useState(true);
  const [relatedProducts, setrelatedProducts] = useState([]);
  const [loadingrelatedProducts, setloadingrelatedProducts] = useState(true);

  // غيري الرقم هنا إلى 4 أو 8 بناءً على عدد الكروت التي تريدين ظهورها في البداية
  const [visibleCount, setVisibleCount] = useState(4); 

  const { cartItems, AddToCart } = useContext(ContextCart);

  useEffect(() => {
    const getProductsData = async () => {
      setprodact(null);     
      setloading(true);     
      try {
        const {data, error} = await supabase
        .from('products')
        .select('*')
        .eq('id', id)      
        .single();         

        if (error) {
          console.error("حصلت مشكلة وإحنا بنجيب البيانات:", error);
        } else {
          setprodact(data);
          console.log("المنتج اللي جاي من سوبابيز هو:", data);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setloading(false);
      }
    };
  
    getProductsData();
  }, [id]); 

  useEffect(() => {
    if (!prodact || !prodact.category_id) return;

    const getRelatedProducts = async () => {
      setloadingrelatedProducts(true);
      try {
        const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", prodact.category_id);

        if (error) {
          console.log("Error fetching related products:", error);
        } else {
          setrelatedProducts(data || []);
        }
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setloadingrelatedProducts(false);
      }
    };

    getRelatedProducts();
  }, [prodact?.category_id]);

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

          {/* استدعاء كمبوننت المنتجات المقترحة بشكل نظيف وتمرير دالة العداد */}
          <RelatedProducts 
            loadingrelatedProducts={loadingrelatedProducts}
            relatedProducts={relatedProducts}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount} // 👈 مررنا الدالة هنا لكي يعمل الزر بداخل الكمبوننت
            prodact={prodact}
            cartItems={cartItems}
            AddToCart={AddToCart}
          />
        </div>
        
        <Footertwo />
      </PageTransition>
    </div>
  );
}

export default Pgproduct;