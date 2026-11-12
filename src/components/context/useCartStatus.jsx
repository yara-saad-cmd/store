import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

// بيرجّع { [productId]: 'removed' | 'out_of_stock' | 'price_changed' } للمنتجات اللي فيها مشكلة
// وكمان live: الأسعار والخصومات الحالية من القاعدة
export default function useCartStatus(cartItems) {
  const [problems, setProblems] = useState({})
  const [live, setLive] = useState({})
  const [checking, setChecking] = useState(false)

  // مفتاح ثابت بيتغير بس لو المنتجات أو أسعارها وخصوماتها المحفوظة اتغيرت، مش مع كل تغيير في الكمية
   // مفتاح ثابت بيتغير بس لو المنتجات اتغيرت، مش مع كل تغيير في الكمية
   const key = [...new Set(cartItems.map((item) => item.id))].sort().join(',')

  useEffect(() => {
    const ids = [...new Set(cartItems.map((item) => item.id))]
    if (ids.length === 0) {
      setProblems({})
      setLive({})
      return
    }

    let cancelled = false

    const check = async () => {
      setChecking(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, price, availability, discount_percent')
          .in('id', ids)
          .eq('is_hidden', false)

        if (cancelled) return

        if (error) {
          console.error('خطأ في فحص حالة منتجات العربة:', error)
          setProblems({})
          setLive({})
          return
        }

        const current = Object.fromEntries((data || []).map((p) => [p.id, p]))
        const result = {}

        cartItems.forEach((item) => {
          const product = current[item.id]
          if (!product) {
            result[item.id] = 'removed'
          } else if (product.availability !== 'متوفر') {
            result[item.id] = 'out_of_stock'
          }
        })

        setProblems(result)
        setLive(current)
      } catch (error) {
        console.error('خطأ غير متوقع في فحص العربة:', error)
        if (!cancelled) {
          setProblems({})
          setLive({})
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    check()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { problems, checking, live }
}