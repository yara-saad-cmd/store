import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import './AdminProducts.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import AdminNav from './AdminNav'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [filter, setFilter] = useState('all') // all | visible | hidden
  const [updatingId, setUpdatingId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('id, title, price, availability, images, is_hidden, category_id')
          .order('id', { ascending: false })
          .limit(200),
        supabase.from('categories').select('id, name'),
      ])

      if (productsRes.error || categoriesRes.error) {
        console.error('خطأ في جلب المنتجات:', productsRes.error || categoriesRes.error)
        setLoadError(true)
        return
      }

      setProducts(productsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('خطأ غير متوقع في جلب المنتجات:', error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const categoryNames = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  )

  const handleToggleHidden = async (product) => {
    if (updatingId) return
    setUpdatingId(product.id)

    const nextHidden = !product.is_hidden

    try {
      // .select() بيرجّع الصف المتعدّل، فنعرف لو التعديل ما حصلش فعلاً
      const { data, error } = await supabase
        .from('products')
        .update({ is_hidden: nextHidden })
        .eq('id', product.id)
        .select('id')

      if (error || !data?.length) {
        console.error('خطأ في تعديل ظهور المنتج:', error)
        toast.error('تعذر تعديل المنتج، حاولي مرة تانية')
        return
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_hidden: nextHidden } : p))
      )
      toast.success(nextHidden ? 'تم إخفاء المنتج' : 'تم إظهار المنتج')
    } catch (error) {
      console.error('خطأ غير متوقع في تعديل المنتج:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setUpdatingId(null)
    }
  }

  const visibleCount = products.filter((p) => !p.is_hidden).length
  const hiddenCount = products.length - visibleCount

  const shownProducts = products.filter((p) => {
    if (filter === 'visible') return !p.is_hidden
    if (filter === 'hidden') return p.is_hidden
    return true
  })

  return (
    <div className="pg-admin-products">
      <HeaderTwo />
      <PageTransition>
        <div className="container admin-products-content">
          <AdminNav />

          <div className="admin-products-head">
            <h2 className="admin-products-title">المنتجات</h2>
            <Link to="/admin/products/new" className="admin-add-product">+ إضافة منتج</Link>
          </div>

          <div className="admin-products-filters" role="group" aria-label="تصفية المنتجات">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              الكل ({products.length})
            </button>
            <button
              type="button"
              className={filter === 'visible' ? 'active' : ''}
              onClick={() => setFilter('visible')}
            >
              ظاهر ({visibleCount})
            </button>
            <button
              type="button"
              className={filter === 'hidden' ? 'active' : ''}
              onClick={() => setFilter('hidden')}
            >
              مخفي ({hiddenCount})
            </button>
          </div>

          {loading && <p className="admin-products-message">جاري تحميل المنتجات...</p>}

          {!loading && loadError && (
            <div className="admin-products-message">
              <p>تعذر تحميل المنتجات</p>
              <button type="button" className="admin-retry" onClick={fetchData}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !loadError && shownProducts.length === 0 && (
            <p className="admin-products-message">لا توجد منتجات</p>
          )}

          {!loading && !loadError && shownProducts.map((product) => (
            <article
              className={`admin-product ${product.is_hidden ? 'is-hidden' : ''}`}
              key={product.id}
            >
              <div className="admin-product-img">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.title} loading="lazy" />
                )}
              </div>

              <div className="admin-product-info">
                <h3>{product.title}</h3>
                <p>{categoryNames[product.category_id] || 'بدون قسم'}</p>
                <p>
                  {product.price} EGP - {product.availability}
                </p>
              </div>

              <div className="admin-product-actions">
              {product.is_hidden && <span className="admin-product-badge">مخفي</span>}
                <Link to={`/admin/products/${product.id}`} className="admin-product-edit">تعديل</Link>
                <button
                  type="button"
                  className="admin-product-toggle"
                  disabled={updatingId === product.id}
                  onClick={() => handleToggleHidden(product)}
                >
                  {product.is_hidden ? 'إظهار' : 'إخفاء'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <Footer />
      </PageTransition>
    </div>
  )
}

export default AdminProducts