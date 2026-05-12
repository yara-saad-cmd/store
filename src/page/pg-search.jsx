import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHedar from '../components/heder/topHedar'
import BtmHedar from '../components/heder/btmHedar'
import PadgTranschan from '../components/padgTranschan'
import Prsdactloding from '../components/body/prodact-loding'
import Prodact from '../components/body/prodact'
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
            <TopHedar />
            <BtmHedar />
    
            <PadgTranschan key={query}>
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
            </PadgTranschan>
        </div>
    )
    
  
}

export default Pgsearch