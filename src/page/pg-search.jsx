import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TopHeader from '../components/header/topHeader'
import BtmHeader from '../components/header/btmHeader'
import PageTransition from '../components/pageTransaction'
import ProductLoading from '../components/body/product-loading'
import Prodact from '../components/body/product'
import Footertwo from '../components/footer/footer2'
import { supabase } from '../supabaseClient' // 👈 استيراد مكتبة Supabase (تأكدي من صحة المسار)

function Pgsearch() {

    const [loading, setloading] = useState(true)
    const [results, setresults] = useState([])
    const query = new URLSearchParams(useLocation().search).get("query")

    useEffect(() => {
        const fetchResults = async () => {
            setloading(true)
            try {
                // 👈 البحث عن كلمة البحث داخل جدول المنتجات في Supabase
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('title', `%${query}%`)

                if (error) {
                    console.error("خطأ أثناء البحث في سوبابيز:", error)
                    setresults([])
                } else {
                    setresults(data || [])
                }

            } catch (error) {
                console.error("search error", error)
                setresults([])
            } finally {
                setloading(false)
            }
        } 

        if (query) fetchResults()
            
    }, [query])

    return (
        <div>
            <TopHeader />
            <BtmHeader />
    
            <PageTransition key={query}>
                <div className="page-category">
                    {loading ? (
                        <ProductLoading key={query} />
                    ) : results.length > 0 ? (
                        <div className="prodact">
                            <Prodact products={results} title={`نتائج البحث عن: ${query}`} />
                        </div>
                    ) : <h3 className="no-data-text container">لا توجد منتجات مطابقة للبحث</h3>}
                </div>
                <Footertwo/>
            </PageTransition>
        </div>
    )
}

export default Pgsearch