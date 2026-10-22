import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './AdminOrders.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import { supabase } from '../../supabaseClient'
import AdminNav from './AdminNav'


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

const formatDate = (value) =>
  new Date(value).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('خطأ في جلب الطلبات:', error)
        setLoadError(true)
        setOrders([])
        return
      }

      setOrders(data || [])
    } catch (error) {
      console.error('خطأ غير متوقع في جلب الطلبات:', error)
      setLoadError(true)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      toast.success('تم تحديث حالة الطلب')
    } catch (error) {
      console.error('خطأ غير متوقع في تعديل الحالة:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setUpdatingId(null)
    }
  }

  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length

  const visibleOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter)

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
              الكل ({orders.length})
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                {status} ({countByStatus(status)})
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

          {!loading && !loadError && visibleOrders.length === 0 && (
            <p className="admin-orders-message">لا توجد طلبات</p>
          )}

          {!loading && !loadError && visibleOrders.map((order) => (
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
        </div>

        <Footer />
      </PageTransition>
    </div>
  )
}

export default AdminOrders