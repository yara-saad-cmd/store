import React, { useEffect, useState } from 'react'
import TopHeader from '../../components/header/topHeader';
import BtmHeader from '../../components/header/btmHeader';
import { data, useParams } from 'react-router-dom';
import Product from '../../components/body/product';
import "./pg-category.css"
import Prsdactloding from '../../components/body/product-loading';
import PageTransaction from '../../components/pageTransaction';
import Footertwo from '../../components/footer/footer2';

function Pgcategory() {

  const {category} = useParams()
  

  const [gategotyprodact , setgategotyprodact] = useState([])
  const [Pgcategory , setPgcategory] = useState(true)



    useEffect(()=>{
      fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setgategotyprodact(data.products)
      })
      .catch((error)=> console.error(error))
      .finally(() => setPgcategory(false))
    } ,[category])
console.log(gategotyprodact)


  return (
    <PageTransaction>
       <div className="pg-search">
      <TopHeader/>
      <BtmHeader/>
      <div className="pg-search">
        <>
         {Pgcategory ? (<Prsdactloding key={category}/>
         ):(<div className="prodact">
             <Product products={gategotyprodact}  title={category} 
            />

            
          </div>)
        
          
      }
        </>
       

        

        
      </div>
    </div>
    <Footertwo/>
    </PageTransaction>
   
  )
}

export default Pgcategory ;