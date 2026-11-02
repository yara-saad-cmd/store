import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './AdminOrders.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import { supabase } from '../../supabaseClient'
import AdminNav from './AdminNav'
import "./AdminShared.css"

const STATUSES = ['قيد الانتظار', 'تم التأكيد', 'تم الشحن', 'ملغي']

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

const PAGE_SIZE = 20

const formatDate = (value) =>
  new Date(value).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [counts, setCounts] = useState({})

  // أرقام الأزرار من القاعدة، مش من الطلبات المحمّلة بس
  const fetchCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        STATUSES.map((status) =>
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('status', status)
        )
      )

      if (results.some((res) => res.error)) {
        console.error('خطأ في عدّ الطلبات:', results.find((res) => res.error)?.error)
        return
      }

      const next = {}
      STATUSES.forEach((status, index) => {
        next[status] = results[index].count || 0
      })
      setCounts(next)
    } catch (error) {
      console.error('خطأ غير متوقع في عدّ الطلبات:', error)
    }
  }, [])

  const buildQuery = useCallback(
    (from) => {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)

      if (filter !== 'all') query = query.eq('status', filter)
      return query
    },
    [filter]
  )

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const { data, error, count } = await buildQuery(0)

      if (error) {
        console.error('خطأ في جلب الطلبات:', error)
        setLoadError(true)
        setOrders([])
        return
      }

      setOrders(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('خطأ غير متوقع في جلب الطلبات:', error)
      setLoadError(true)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [buildQuery])

  const fetchMore = async () => {
    if (loadingMore) return
    setLoadingMore(true)

    try {
      const { data, error, count } = await buildQuery(orders.length)

      if (error) {
        console.error('خطأ في جلب المزيد من الطلبات:', error)
        toast.error('تعذر تحميل المزيد، حاولي مرة تانية')
        return
      }

      // نتجنب التكرار لو طلب جديد اتضاف وزحزح الترتيب
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

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingId) return
    setUpdatingId(orderId)

    try {
      // .select() بيرجّع الصف المتعدّل، فنعرف لو التعديل ما حصلش فعلاً
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select('id')

      if (error || !data?.length) {
        console.error('خطأ في تعديل حالة الطلب:', error)
        toast.error('تعذر تعديل حالة الطلب، حاولي مرة تانية')
        return
      }

      setOrders((prev) => {
        // لو في فلتر والطلب مبقاش مطابق له، يختفي من القائمة
        if (filter !== 'all' && filter !== newStatus) {
          setTotalCount((total) => Math.max(0, total - 1))
          return prev.filter((order) => order.id !== orderId)
        }
        return prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      })
      fetchCounts()
      toast.success('تم تحديث حالة الطلب')
    } catch (error) {
      console.error('خطأ غير متوقع في تعديل الحالة:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setUpdatingId(null)
    }
  }

  const allCount = Object.values(counts).reduce((sum, value) => sum + value, 0)
  return (
    <div className="pg-admin-orders">
      <HeaderTwo />
      <PageTransition>
      <div className="container admin-orders-content">
          <AdminNav />

          <h2 className="admin-orders-title">الطلبات</h2>
          <div className="admin-orders-filters" role="group" aria-label="تصفية الطلبات">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
                           الكل ({allCount})
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                                {status} ({counts[status] ?? 0})
              </button>
            ))}
          </div>

          {loading && <p className="admin-orders-message">جاري تحميل الطلبات...</p>}

          {!loading && loadError && (
            <div className="admin-orders-message">
              <p>تعذر تحميل الطلبات</p>
              <button type="button" className="admin-retry" onClick={fetchOrders}>
                إعادة المحاولة
              </button>
            </div>
          )}

{!loading && !loadError && orders.length === 0 && (
            <p className="admin-orders-message">لا توجد طلبات</p>
          )}

{!loading && !loadError && orders.map((order) => (
            <article className="admin-order" key={order.id}>
              <header className="admin-order-head">
                <h3>طلب #{order.id}</h3>
                <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
              </header>

              <div className="admin-order-body">
                <div className="admin-order-customer">
                  <p><strong>{order.customer_name}</strong></p>
                  <p><a href={`tel:${order.customer_phone}`}>{order.customer_phone}</a></p>
                  {order.customer_phone2 && (
                    <p><a href={`tel:${order.customer_phone2}`}>{order.customer_phone2}</a></p>
                  )}
                  <p>{order.governorate} - {order.address}</p>
                  {order.note && (
                    <p className="admin-order-note">ملاحظة: {order.note}</p>
                  )}
                </div>

                <ul className="admin-order-items">
                  {(order.order_items || []).map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.product_title}
                        {item.selected_size && ` - ${item.selected_size}`}
                        {item.selected_color && ` - ${item.selected_color}`}
                      </span>
                      <span>
                        {item.quantity} × {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className="admin-order-foot">
                <div className="admin-order-totals">
                  <span>{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                  <span>
                    الشحن: {order.shipping} | الإجمالي: <strong>{Number(order.total).toFixed(2)} EGP</strong>
                  </span>
                </div>

                <select
                  className={`admin-status status-${STATUS_CLASS[order.status] || 'pending'}`}
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  aria-label={`حالة الطلب رقم ${order.id}`}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </footer>
            </article>
          ))}


{!loading && !loadError && orders.length < totalCount && (
            <button
              type="button"
              className="admin-load-more"
              onClick={fetchMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'جاري التحميل...' : `عرض المزيد (${totalCount - orders.length})`}
            </button>
          )}
        </div>

        <Footer />
      </PageTransition>
    </div>
  )
}

export default AdminOrders