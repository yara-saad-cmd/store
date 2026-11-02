import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

// بيرجّع { [productId]: 'removed' | 'out_of_stock' | 'price_changed' } للمنتجات اللي فيها مشكلة
export default function useCartStatus(cartItems) {
  const [problems, setProblems] = useState({})
  const [checking, setChecking] = useState(false)

  // مفتاح ثابت بيتغير بس لو المنتجات أو أسعارها المحفوظة اتغيرت، مش مع كل تغيير في الكمية
  const key = cartItems.map((item) => `${item.id}:${item.price}`).sort().join(',')

  useEffect(() => {
    const ids = [...new Set(cartItems.map((item) => item.id))]
    if (ids.length === 0) {
      setProblems({})
      return
    }

    let cancelled = false

    const check = async () => {
      setChecking(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, price, availability')
          .in('id', ids)

        if (cancelled) return

        if (error) {
          console.error('خطأ في فحص حالة منتجات العربة:', error)
          setProblems({})
          return
        }

        const current = Object.fromEntries((data || []).map((p) => [p.id, p]))
        const result = {}

        cartItems.forEach((item) => {
          const product = current[item.id]
          if (!product) result[item.id] = 'removed'
          else if (product.availability !== 'متوفر') result[item.id] = 'out_of_stock'
          else if (Number(product.price) !== Number(item.price)) result[item.id] = 'price_changed'
        })

        setProblems(result)
      } catch (error) {
        console.error('خطأ غير متوقع في فحص العربة:', error)
        if (!cancelled) setProblems({})
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

  return { problems, checking }
}