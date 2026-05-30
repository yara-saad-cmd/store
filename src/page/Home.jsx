import React, { useEffect, useState } from 'react'
import Slider from '../components/body/slider'
import Prodact from "../components/body/product"
import Prsdactloading from '../components/body/product-loading'
import PageTransition from '../components/pageTransaction'
import Footertwo from '../components/footer/footer2'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'

const categories = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "laptops",
  "mens-shirts",
  "skin-care",
  "tops",
]

function Home() {
  const [product, setProduct] = useState({})
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(`https://dummyjson.com/products/category/${category}`)
            const data = await res.json()
            return { [category]: data.products }
          })
        ).finally(()=>setloading(false))

        const productData = Object.assign({}, ...results)
        setProduct(productData)
      } catch (error) {
        console.error("Error fetching:", error)
      }
    }

    fetchProducts()
  }, [])

  

  return (
    <PageTransition>

     <header>
        <TopHeader />
        <BtmHeader />
      </header>

      <Slider />
  
      {loading ?(
       <Prsdactloading/>
      ):(
       
        <Prodact products={product} />
      )}
      <Footertwo/>
      
   
    </PageTransition>
   
  )
}

export default Home;