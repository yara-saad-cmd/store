import React, { useContext, useEffect, useState } from 'react'
import { ContextCart } from '../context/contextcart';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import "./invoice.css"

// علامة بتتسجل لما العميلة تتقدم خطوة، عشان الصفحة اللي بعدها تتأكد إنها جت بالتسلسل
const markStep = (key) => {
  try {
    sessionStorage.setItem(key, "1")
  } catch (error) {
    console.error("فشل حفظ علامة الخطوة:", error)
  }
}

// محافظة العميلة من بيانات الشحن المحفوظة (UserData.jsx)
const getSavedGovernorate = () => {
  try {
    const saved = localStorage.getItem("userData")
    if (!saved) return ""
    const parsed = JSON.parse(saved)
    return typeof parsed?.governorate === "string" ? parsed.governorate.trim() : ""
  } catch (error) {
    console.error("خطأ في قراءة المحافظة:", error)
    return ""
  }
}

// نفس معادلة دالة القاعدة: تقريب سعر الوحدة بعد الخصم
const unitPrice = (price, discount) =>
  Math.round((Number(price) * (100 - Number(discount || 0))) / 100)

function Invoice({ layout, blocked = false }) {
  const { cartItems } = useContext(ContextCart)

  // الأسعار والخصومات الحالية من القاعدة: { [productId]: { price, discount } }
  const [live, setLive] = useState({})
  const [shippingFee, setShippingFee] = useState(null)
  const [governorate, setGovernorate] = useState(getSavedGovernorate)

  // لما العميلة تحفظ بيانات الشحن (UserData.jsx) نقرا المحافظة من جديد
  useEffect(() => {
    const handleUserDataChanged = () => setGovernorate(getSavedGovernorate())
    window.addEventListener("userDataChanged", handleUserDataChanged)
    return () => window.removeEventListener("userDataChanged", handleUserDataChanged)
  }, [])
  // مفتاح ثابت بيتغير بس لو المنتجات اتغيرت، مش مع الكمية
  const idsKey = [...new Set(cartItems.map((item) => item.id))].sort().join(',')

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',').map(Number) : []
    if (ids.length === 0) return

    let cancelled = false

    const loadPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, price, discount_percent')
          .in('id', ids)

        if (cancelled) return

        if (error) {
          console.error('خطأ في جلب أسعار الفاتورة:', error)
          return
        }

        setLive(
          Object.fromEntries(
            (data || []).map((p) => [p.id, { price: p.price, discount: p.discount_percent }])
          )
        )
      } catch (error) {
        console.error('خطأ غير متوقع في جلب أسعار الفاتورة:', error)
      }
    }

    loadPrices()

    return () => {
      cancelled = true
    }
  }, [idsKey])

  useEffect(() => {
    if (!governorate) {
      setShippingFee(null)
      return
    }

    let cancelled = false

    const loadShipping = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_rates')
          .select('fee')
          .eq('governorate', governorate)
          .maybeSingle()

        if (cancelled) return

        if (error) {
          console.error('خطأ في جلب سعر الشحن:', error)
          return
        }

        setShippingFee(data ? Number(data.fee) : null)
      } catch (error) {
        console.error('خطأ غير متوقع في جلب سعر الشحن:', error)
      }
    }

    loadShipping()

    return () => {
      cancelled = true
    }
  }, [governorate])

  // لو سعر المنتج لسه

  // لو سعر المنتج لسه ما اتجابش من القاعدة، بنستخدم المخزّن في العربة مؤقتاً
  const lines = cartItems.map((item) => {
    const current = live[item.id]
    const price = current ? current.price : item.price
    const discount = current ? current.discount : 0
    return {
      original: price * item.quantity,
      paid: unitPrice(price, discount) * item.quantity,
    }
  })

  const total = lines.reduce((acc, line) => acc + line.original, 0)
  const subtotal = lines.reduce((acc, line) => acc + line.paid, 0)
  const discountAmount = total - subtotal
  const hasDiscount = discountAmount > 0

  const hasShipping = shippingFee !== null
  const totalPrice = subtotal + (hasShipping ? shippingFee : 0)

  return (
    <div className="invoice">
      <p className="title">الفاتوره</p>
      <div className="the-invoice">
        <h4>
          اجمالي المنتجات:<span>{total.toFixed(2)}</span>
        </h4>

        {hasDiscount && (
          <>
            <h4 className="pordr">
              الخصم:<span>- {discountAmount.toFixed(2)}</span>
            </h4>
            <h4>
              الاجمالي الفرعي:<span>{subtotal.toFixed(2)}</span>
            </h4>
          </>
        )}

        <h4>
          الشحن:
          {hasShipping ? (
            <span>{shippingFee}</span>
          ) : (
            <span className="shipping-pending">يتحدد بعد إدخال بيانات الشحن</span>
          )}
        </h4>
        <h4>
          السعر الكلي:<span>{totalPrice.toFixed(2)}</span>
        </h4>

        <div className="button">
          {blocked ? (
            <button type="button" disabled>
              احذفي المنتجات غير المتاحة للمتابعة
            </button>
          ) : (
            <Link
              to={layout === "cart" ? "/order-details" : "/payment"}
              onClick={() => markStep(layout === "cart" ? "stepDetails" : "stepPayment")}
            >
              <button>
                {layout === "cart" ? "تابع الشراء" : "اتمام الطلب"} (
                <span>{cartItems.length}</span>)
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Invoice;