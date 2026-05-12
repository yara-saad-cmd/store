import React, { useEffect, useState } from 'react'
import Slider from '../components/body/slider'
import Prodact from "../components/body/prodact"
import Prsdactloding from '../components/body/prodact-loding'
import PadgTranschan from '../components/padgTranschan'
import Footertwo from '../components/footer/footer2'
import TopHedar from '../components/heder/topHedar'
import BtmHedar from '../components/heder/btmHedar'

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
  const [loding, setloding] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(`https://dummyjson.com/products/category/${category}`)
            const data = await res.json()
            return { [category]: data.products }
          })
        ).finally(()=>setloding(false))

        const productData = Object.assign({}, ...results)
        setProduct(productData)
      } catch (error) {
        console.error("Error fetching:", error)
      }
    }

    fetchProducts()
  }, [])

  

  return (
    <PadgTranschan>

     <header>
        <TopHedar />
        <BtmHedar />
      </header>

      <Slider />
  
      {loding ?(
       <Prsdactloding/>
      ):(
       
        <Prodact products={product} />
      )}
      <Footertwo/>
      
   
    </PadgTranschan>
   
  )
}

export default Home;