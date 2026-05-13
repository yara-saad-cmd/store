import React, { useEffect, useState } from 'react'
import TopHedar from '../../components/heder/topHedar';
import BtmHedar from '../../components/heder/btmHedar';
import { data, useParams } from 'react-router-dom';
import Product from '../../components/body/product';
import "./pg-categary.css"
import Prsdactloding from '../../components/body/product-loading';
import PadgTranschan from '../../components/padgTranschan';
import Footertwo from '../../components/footer/footer2';

function Pgcategary() {

  const {category} = useParams()
  

  const [gategotyprodact , setgategotyprodact] = useState([])
  const [Pgcategary , setPgcategary] = useState(true)



    useEffect(()=>{
      fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setgategotyprodact(data.products)
      })
      .catch((error)=> console.error(error))
      .finally(() => setPgcategary(false))
    } ,[category])
console.log(gategotyprodact)


  return (
    <PadgTranschan>
       <div className="pg-search">
      <TopHedar/>
      <BtmHedar/>
      <div className="pg-search">
        <>
         {Pgcategary ? (<Prsdactloding key={category}/>
         ):(<div className="prodact">
             <Product products={gategotyprodact}  title={category} 
            />

            
          </div>)
        
          
      }
        </>
       

        

        
      </div>
    </div>
    <Footertwo/>
    </PadgTranschan>
   
  )
}

export default Pgcategary ;