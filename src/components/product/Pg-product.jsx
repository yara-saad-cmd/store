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
import { supabase } from '../../supabaseClient' 

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
    const getProductsData = async () => {
      setprodact(null);     // يمسح بيانات المنتج القديم فوراً
      setloading(true);     // يظهر شاشة التحميل (Loading)
      try {
        const {data,error} = await supabase
        .from('products')
        .select('*')
        .eq('id', id)      // الفلتر السحري: بقوله هات المنتج اللي الـ id بتاعه بيساوي الـ id اللي فوق في رابط الصفحة
        .single();         // بقول لسوبابيز: أنا عايز كائن (Object) واحد بس مش مصفوفة، لأن ده منتج واحد


        if (error) {
          console.error("حصلت مشكلة وإحنا بنجيب البيانات:", error);
        } else {
          
          // 5. التعديل السحري: لو الداتا رجعت تمام، بنخزنها جوه الـ State
          // وغلفناها في { all: data } عشان كود الـ Product القديم بتاعك يفهمها
          setprodact(data);
          console.log("المنتج اللي جاي من سوبابيز هو:", data);
        }
  
      } catch (err) {
        // 6. لو حصل أي خطأ مفاجئ في الكود بره سوبابيز، بنطبعه هنا
        console.error("خطأ غير متوقع:", err);
      }finally {
        // 5. في كل الأحوال (سواء نجحنا أو حصل خطأ) بنقفل شاشة التحميل
        setloading(false);
      }
    };
  
    // 7. إوعي تنسي! إحنا فوق جهزنا الدالة بس، السطر ده هو اللي بيديها أمر "اشتغلي"
    getProductsData();
  
  }, [id]); // 8. القوسين الفاضيين المربعين دول معناهم: نفذ الكود ده "مرة واحدة بس" أول ما الصفحة تفتح





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