import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pg-product.css";
import Loading from "./loading-pg-product";
import BtmHeader from "../header/btmHeader";
import TopHeader from "../header/topHeader";
import { ContextCart } from "../context/contextcart";
import ImgPgproduct from "./img-pg-product";
import TitlePpgPproduct from "./title-pg-product";
import PageTransition from "../PageTransaction";
import Footertwo from "../footer/footer2";
import { supabase } from '../../supabaseClient'; 

// استيراد الكمبوننت الجديد هنا
import RelatedProducts from "./RelatedProducts"; 

function Pgproduct() {
  const { id } = useParams();

  const [goods, setprodact] = useState(null);
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
        .eq('is_hidden', false)
        .maybeSingle();
        
        if (error) {
          console.error("حصلت مشكلة وإحنا بنجيب البيانات:", error);
        } else {
          setprodact(data);
         
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
    if (!goods?.category_id) return;

    const getRelatedProducts = async () => {
      setloadingrelatedProducts(true);
      try {
        const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", goods.category_id)
        .neq("id", goods.id)
        .eq("is_hidden", false)
        .neq("id", goods.id);

        if (error) {
          console.error("Error fetching related products:", error);
        } else {
          setrelatedProducts(data || []);
        }
      } catch (err) {
        console.error("Error:", err);;
      } finally {
        setloadingrelatedProducts(false);
      }
    };

    getRelatedProducts();
  }, [goods?.category_id]);

  if (loading) return <Loading />;
  if (!goods) {
    return (
      <div className="status-message">
        <h2>المنتج غير موجود</h2>
        <Link to="/">العودة للرئيسية</Link>
      </div>
    );
  }
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
              <ImgPgproduct key={goods.id} goods={goods} />
              <TitlePpgPproduct goods={goods} />
            </div>
          </div>

          <hr />

          {/* استدعاء كمبوننت المنتجات المقترحة بشكل نظيف وتمرير دالة العداد */}
          <RelatedProducts 
            loadingrelatedProducts={loadingrelatedProducts}
            relatedProducts={relatedProducts}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount} // 👈 مررنا الدالة هنا لكي يعمل الزر بداخل الكمبوننت
            goods={goods}
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