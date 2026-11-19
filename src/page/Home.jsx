
import React, { useEffect, useState, Suspense, lazy } from 'react'
import Goods from "../components/body/product" // ده ملف الـ Product بتاعك
import ProductLoading from '../components/body/product-loading'
import PageTransition from '../components/PageTransaction'
import Footertwo from '../components/footer/footer2'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import { supabase } from '../supabaseClient'
import SliderLoading from '../components/body/SliderLoading'

// السلايدر بيتحمل لوحده بعد باقي الصفحة، عشان مكتبة Swiper تقيلة نسبياً
const Slider = lazy(() => import('../components/body/slider'))

function Home() {
  const [product, setProduct] = useState([])
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchProductsFromSupabase = async () => {
      try {
        // بنجيب المنتجات من سوبابيز
        const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_hidden', false)

        if (error) {
          console.error("Error fetching from Supabase:", error)
        } else {
        
          setProduct({ all: data || [] })
        }
      
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setloading(false)
      }
    }

    fetchProductsFromSupabase()
  }, [])

  return (
    <PageTransition>
      <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Suspense fallback={<SliderLoading />}>
        <Slider />
      </Suspense>

     
      {loading ? (
        <ProductLoading/>
      ) : (
        // بنمرر البيانات المغلفة هنا
        <Goods products={product} />
      )}
      <Footertwo/>
    </PageTransition>
  )
}

export default Home;