import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import PageTransition from '../components/pageTransaction'
import ProductLoading from '../components/body/product-loading'
import Prodact from '../components/body/product'
import Footertwo from '../components/footer/footer2'

function Pgsearch() {

    const [loading , setloading] =useState(true)
    const [results , setresults] =useState([])
    const query = new URLSearchParams(useLocation().search).get("query")
 
    console.log(results)

    useEffect(()=>{
        const fetchResults = async ()=>{
            setloading(true)
            try{
                const res= await fetch(
                    `https://dummyjson.com/products/search?q=${query}`
                )
                const data = await res.json()
                setresults(data.products || [])

            }catch (error){
                console.error("search error",error)

                
            }finally{
                setloading(false)
            }
             
        } 
        if(query) fetchResults()
            
        
    },[query])
    return (
        <div>
            <TopHeader />
            <BtmHeader />
    
            <PageTransition key={query}>
                <div className="pg-search">

                    {loading ? (
                        <ProductLoading key={query} />
                    ) : results.length > 0 ? (
                        <div className="prodact">
                            <Prodact products={results} title={"نتائج البحث"} />
                        </div>
                    ) : <h3 className="no-data-text container">لا توجد منتجات</h3>}

                </div>
                <Footertwo/>
            </PageTransition>
        </div>
    )
    
  
}

export default Pgsearch