import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import PageTransaction from '../components/pageTransaction'
import Prsdactloding from '../components/body/product-loading'
import Prodact from '../components/body/product'
import Footertwo from '../components/footer/footer2'

function Pgsearch() {

    const [loding , setloding] =useState(true)
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
                setloding(false)
            }
             
        } 
        if(query) futchresilt()
            
        
    },[query])
    return (
        <div>
            <TopHeader />
            <BtmHeader />
    
            <PageTransaction key={query}>
                <div className="pg-search">

                    {loding ? (
                        <Prsdactloding key={query} />
                    ) : resolt.length > 0 ? (
                        <div className="prodact">
                            <Prodact products={resolt} title={"نتائج البحث"} />
                        </div>
                    ) : <h3 className="on-tata continar">لا توجد منتجات</h3>}

                </div>
                <Footertwo/>
            </PageTransaction>
        </div>
    )
    
  
}

export default Pgsearch