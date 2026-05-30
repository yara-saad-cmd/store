import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import PageTransition from '../components/pageTransaction'
import Prsdactloading from '../components/body/product-loading'
import Prodact from '../components/body/product'
import Footertwo from '../components/footer/footer2'

function Pgsearch() {

    const [loading , setloading] =useState(true)
    const [resolt , setresolt] =useState([])
    const query = new URLSearchParams(useLocation().search).get("query")
 
    console.log(resolt)

    useEffect(()=>{
        const futchresilt = async ()=>{
            try{
                const res= await fetch(
                    `https://dummyjson.com/products/search?q=${query}`
                )
                const data = await res.json()
                setresolt(data.products || [])

            }catch (error){
                console.error("search error",error)

                
            }finally{
                setloading(false)
            }
             
        } 
        if(query) futchresilt()
            
        
    },[query])
    return (
        <div>
            <TopHeader />
            <BtmHeader />
    
            <PageTransition key={query}>
                <div className="pg-search">

                    {loading ? (
                        <Prsdactloading key={query} />
                    ) : resolt.length > 0 ? (
                        <div className="prodact">
                            <Prodact products={resolt} title={"نتائج البحث"} />
                        </div>
                    ) : <h3 className="on-tata container">لا توجد منتجات</h3>}

                </div>
                <Footertwo/>
            </PageTransition>
        </div>
    )
    
  
}

export default Pgsearch