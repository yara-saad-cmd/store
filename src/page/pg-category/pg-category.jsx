import React, { useEffect, useState } from 'react'
import TopHeader from '../../components/header/topHeader';
import BtmHeader from '../../components/header/btmHeader';
import { data, useParams } from 'react-router-dom';
import Product from '../../components/body/product';
import "./pg-category.css"
import ProductLoading from '../../components/body/product-loading';
import PageTransition from '../../components/pageTransaction';
import Footertwo from '../../components/footer/footer2';

function Pgcategory() {

  const {category} = useParams()
  

  const [categoryprodact , setcategoryprodact] = useState([])
  const [isLoading , setisLoading] = useState(true)



    useEffect(()=>{
      fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setcategoryprodact(data.products)
      })
      .catch((error)=> console.error(error))
      .finally(() => setisLoading(false))
    } ,[category])
console.log(categoryprodact)


  return (
    <PageTransition>
       <div className="page-category">
      <TopHeader/>
      <BtmHeader/>
      <div className="page-category-two">
        <>
         {isLoading ? (<ProductLoading key={category}/>
         ):(<div className="prodact">
             <Product products={categoryprodact}  title={category} 
            />

            
          </div>)
        
          
      }
        </>
       

        

        
      </div>
    </div>
    <Footertwo/>
    </PageTransition>
   
  )
}

export default Pgcategory ;