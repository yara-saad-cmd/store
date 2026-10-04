// import React, { useEffect, useState } from 'react'
// import Slider from '../components/body/slider'
// import Prodact from "../components/body/product"
// import ProductLoading from '../components/body/product-loading'
// import PageTransition from '../components/pageTransaction'
// import Footertwo from '../components/footer/footer2'
// import TopHeader from '../components/header/topHeader'
// import BtmHeader from '../components/header/btmHeader'

// const categories = [
//   "beauty",
//   "fragrances",
//   "furniture",
//   "groceries",
//   "home-decoration",
//   "laptops",
//   "mens-shirts",
//   "skin-care",
//   "tops",
// ]

// function Home() {
//   const [product, setProduct] = useState({})
//   const [loading, setloading] = useState(true)

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const results = await Promise.all(
//           categories.map(async (category) => {
//             const res = await fetch(`https://dummyjson.com/products/category/${category}`)
//             const data = await res.json()
//             return { [category]: data.products }
//           })
//         ).finally(()=>setloading(false))

//         const productData = Object.assign({}, ...results)
//         setProduct(productData)
//       } catch (error) {
//         console.error("Error fetching:", error)
//       }
//     }

//     fetchProducts()
//   }, [])

  

//   return (
//     <PageTransition>

//      <header>
//         <TopHeader />
//         <BtmHeader />
//       </header>

//       <Slider />
  
//       {loading ?(
//        <ProductLoading/>
//       ):(
       
//         <Prodact products={product} />
//       )}
//       <Footertwo/>
      
   
//     </PageTransition>
   
//   )
// }

// export default Home;
import React, { useEffect, useState, Suspense, lazy } from 'react'
import Prodact from "../components/body/product" // ده ملف الـ Product بتاعك
import ProductLoading from '../components/body/product-loading'
import PageTransition from '../components/PageTransaction'
import Footertwo from '../components/footer/footer2'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import { supabase } from '../supabaseClient'

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

        if (error) {
          console.error("Error fetching from Supabase:", error)
        } else {
          // التعديل السحري هنا: بنغلف المصفوفة جوه جيسون عشان كود الـ Product القديم بتاعك يقراها علطول
            console.log("البيانات القادمة من سوبابيز بالكامل:", data);
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

      <Suspense >
        <Slider />
      </Suspense>

      {loading ? (
  
      {loading ? (
        <ProductLoading/>
      ) : (
        // بنمرر البيانات المغلفة هنا
        <Prodact products={product} />
      )}
      <Footertwo/>
    </PageTransition>
  )
}

export default Home;