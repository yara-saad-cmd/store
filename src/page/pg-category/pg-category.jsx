import React, { useEffect, useState } from 'react'
import TopHeader from '../../components/header/topHeader';
import BtmHeader from '../../components/header/btmHeader';
import { useParams } from 'react-router-dom';
import Product from '../../components/body/product';
import "./pg-category.css"
import ProductLoading from '../../components/body/product-loading';
import PageTransition from '../../components/pageTransaction';
import Footertwo from '../../components/footer/footer2';
import { supabase } from '../../supabaseClient'; // تأكدي من صحة المسار

function Pgcategory() {

  const { category } = useParams();
  
  const [categoryprodact, setcategoryprodact] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setisLoading(true);

      // 1. جلب id القسم بناءً على الـ slug
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category) // 👈 تم تصحيح الفاصلة
        .single();

      if (categoryError || !categoryData) {
        console.log("القسم غير موجود", categoryError);
        setcategoryprodact([]);
        setisLoading(false);
        return;
      }

      // 2. جلب المنتجات بناءً على category_id
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryData.id); // 👈 تم تصحيح اسم العمود category_id

      if (productsError) {
        console.error("خطأ في جلب المنتجات:", productsError);
        setcategoryprodact([]);
      } else {
        setcategoryprodact(productsData);
      }

      setisLoading(false); // 👈 تم نقلها لداخل الدالة
    };

    fetchCategoryProducts();
  }, [category]);

  console.log(categoryprodact);

  return (
    <PageTransition>
      <div className="page-category">
        <TopHeader/>
        <BtmHeader/>
        <div className="page-category-two">
          <>
            {isLoading ? (
              <ProductLoading key={category}/>
            ) : (
              <div className="prodact">
                <Product products={categoryprodact} title={category} />
              </div>
            )}
          </>
        </div>
      </div>
      <Footertwo/>
    </PageTransition>
  )
}

export default Pgcategory;