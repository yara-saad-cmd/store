import React, { useContext, useEffect, useMemo, useState } from 'react'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import { ContextCart } from '../../components/context/contextcart'
import PageTransition from '../../components/PageTransaction'
import Product from '../../components/body/product'
import "./like.css"
import likeimg from "../../img/like2.png"
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/footer'
import { supabase } from '../../supabaseClient'

function Like() {
  const { likeItems, removelike } = useContext(ContextCart)

  // الحالة الحالية من القاعدة: { [productId]: product }، و null لحد ما الجلب يخلص
  const [live, setLive] = useState(null)

  // مفتاح ثابت بيتغير بس لو المنتجات في المفضلة اتغيرت
  const idsKey = [...new Set(likeItems.map((item) => item.id))].sort((a, b) => a - b).join(',')

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',').map(Number) : []
    if (ids.length === 0) {
      setLive({})
      return
    }

    let cancelled = false

    const loadLive = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, discount_percent, availability, images')
          .in('id', ids)
          .eq('is_hidden', false)

        if (cancelled) return

        if (error) {
          console.error('خطأ في جلب منتجات المفضلة:', error)
          setLive(null)
          return
        }

        setLive(Object.fromEntries((data || []).map((p) => [p.id, p])))
      } catch (error) {
        console.error('خطأ غير متوقع في جلب منتجات المفضلة:', error)
        if (!cancelled) setLive(null)
      }
    }

    loadLive()

    return () => {
      cancelled = true
    }
  }, [idsKey])

   // نشيل من المخزّن أي منتج مش موجود في القاعدة (بس لو الجلب نجح)
   useEffect(() => {
    if (live === null) return
    likeItems.forEach((item) => {
      if (!live[item.id]) removelike(item.id)
    })
  }, [live, likeItems, removelike])

  // لو الجلب فشل (live = null) نعرض المخزّن زي ما هو، وإلا نعرض الموجود بس بالبيانات الحالية
  const displayItems = useMemo(() => {
    if (live === null) return likeItems

    return likeItems
      .filter((item) => live[item.id])
      .map((item) => ({ ...item, ...live[item.id] }))
  }, [likeItems, live])

  return (
    <div className="pg-like">
      <PageTransition>
        <TopHeader />
        <BtmHeader />
        <div className="all-like">
          <div className="like-pruda">
            <div className="fivrt-prudact">
              {displayItems.length === 0 ? (
                <div className="empty-state">
                  <img src={likeimg} alt='قائمة المفضلات' />
                  <p>لم يتم اضافة منتجات الي قائمة المفضلات</p>

                  <Link to="/"> <button className='btn-shop-now'> تصوق الان </button> </Link>
                </div>
              ) : (
                <div className="like">
                  <div className="title">
                    <h2>قائمة المفضل</h2>
                  </div>

                  <Product
                    products={displayItems}
                    isLikePage={true}
                    title={`المنتجات (${displayItems.length})`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </PageTransition>
    </div>
  )
}

export default Like