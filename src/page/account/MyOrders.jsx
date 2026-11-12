import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './MyOrders.css'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'

const PAGE_SIZE = 10

const STATUS_CLASS = {
  'قيد الانتظار': 'pending',
  'تم التأكيد': 'confirmed',
  'تم الشحن': 'shipped',
  'ملغي': 'cancelled',
}

const PAYMENT_LABELS = {
  cash: 'الدفع عند الاستلام',
  visa: 'فيزا',
}

const formatDate = (value) =>
  new Date(value).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })

function MyOrders() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const userId = user?.id ?? null

  const [orders, setOrders] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const buildQuery = useCallback(
    (from) =>
      supabase
        .from('orders')
        .select('id, created_at, status, payment_method, subtotal, shipping, total, order_items(id, product_title, selected_size, selected_color, quantity, price)', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1),
    [userId]
  )

  const fetchOrders = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setLoadError(false)

    try {
      const { data, error, count } = await buildQuery(0)

      if (error) {
        console.error('خطأ في جلب طلباتي:', error)
        setLoadError(true)
        return
      }

      setOrders(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('خطأ غير متوقع في جلب طلباتي:', error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [userId, buildQuery])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const fetchMore = async () => {
    if (loadingMore) return
    setLoadingMore(true)

    try {
      const { data, error, count } = await buildQuery(orders.length)

      if (error) {
        console.error('خطأ في جلب المزيد من طلباتي:', error)
        toast.error('تعذر تحميل المزيد، حاولي مرة تانية')
        return
      }

      setOrders((prev) => {
        const known = new Set(prev.map((order) => order.id))
        return [...prev, ...(data || []).filter((order) => !known.has(order.id))]
      })
      setTotalCount(count || 0)
    } catch (error) {
      console.error('خطأ غير متوقع في جلب المزيد:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setLoadingMore(false)
    }
  }

  if (authLoading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="pg-my-orders">
      <PageTransition>
        <TopHeader />
        <BtmHeader />

        <div className="container my-orders-content">
          <div className="my-orders-head">
            <h2 className="my-orders-title">طلباتي</h2>
            <Link to="/user-account" className="my-orders-back">العودة للحساب</Link>
          </div>

          {loading && <p className="my-orders-message">جاري تحميل طلباتك...</p>}

          {!loading && loadError && (
            <div className="my-orders-message">
              <p>تعذر تحميل طلباتك</p>
              <button type="button" className="my-orders-retry" onClick={fetchOrders}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !loadError && orders.length === 0 && (
            <div className="my-orders-message">
              <p>لا توجد طلبات حتى الآن</p>
              <Link to="/" className="my-orders-back">تسوقي الآن</Link>
            </div>
          )}

          {!loading && !loadError && orders.map((order) => (
            <article className="my-order" key={order.id}>
              <header className="my-order-head">
                <h3>طلب #{order.id}</h3>
                <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
                <span className={`my-order-status status-${STATUS_CLASS[order.status] || 'pending'}`}>
                  {order.status}
                </span>
              </header>

              <ul className="my-order-items">
                {(order.order_items || []).map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.product_title}
                      {item.selected_size && ` - ${item.selected_size}`}
                      {item.selected_color && ` - ${item.selected_color}`}
                    </span>
                    <span>{item.quantity} × {item.price}</span>
                  </li>
                ))}
              </ul>

              <footer className="my-order-foot">
                <span>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                <span>
                  الشحن: {order.shipping} | الإجمالي: <strong>{Number(order.total).toFixed(2)} EGP</strong>
                </span>
              </footer>
            </article>
          ))}

          {!loading && !loadError && orders.length < totalCount && (
            <button
              type="button"
              className="my-orders-more"
              onClick={fetchMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'جاري التحميل...' : `عرض المزيد (${totalCount - orders.length})`}
            </button>
          )}
        </div>

        <Footertwo />
      </PageTransition>
    </div>
  )
}

export default MyOrders