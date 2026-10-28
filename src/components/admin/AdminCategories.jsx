import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './AdminCategories.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import AdminNav from './AdminNav'
import { supabase } from '../../supabaseClient'

// حروف إنجليزية صغيرة وأرقام وشرطات بينهم، مثال: men-shirts
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const EMPTY_FORM = { name: '', slug: '' }

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null) // null = إضافة قسم جديد
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('id')

      if (error) {
        console.error('خطأ في جلب الأقسام:', error)
        setLoadError(true)
        return
      }

      setCategories(data || [])
    } catch (error) {
      console.error('خطأ غير متوقع في جلب الأقسام:', error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setForm({ name: category.name || '', slug: category.slug || '' })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSaving || deletingId) return

    const name = form.name.trim()
    const slug = form.slug.trim().toLowerCase()

    if (!name) return setFormError('اسم القسم مطلوب')
    if (!SLUG_PATTERN.test(slug) || slug.length > 50) {
      return setFormError('الرابط لازم يكون حروف إنجليزية صغيرة وأرقام و _ فقط، مثال: men_shirts')
    }
    if (categories.some((c) => c.id !== editingId && c.slug === slug)) {
      return setFormError('الرابط ده مستخدم في قسم تاني')
    }

    setFormError('')
    setIsSaving(true)

    try {
      const payload = { name, slug }

      // .select() بيرجّع الصف، فنعرف لو الحفظ ما حصلش فعلاً (RLS بترفض من غير خطأ ظاهر)
      const { data, error } = editingId
        ? await supabase.from('categories').update(payload).eq('id', editingId).select('id')
        : await supabase.from('categories').insert(payload).select('id')

      if (error || !data?.length) {
        console.error('خطأ في حفظ القسم:', error)
        setFormError(
          error?.code === '23505'
            ? 'الرابط ده مستخدم في قسم تاني'
            : 'تعذر حفظ القسم، حاولي مرة تانية'
        )
        return
      }

      toast.success(editingId ? 'تم تعديل القسم' : 'تم إضافة القسم')
      resetForm()
      await fetchCategories()
    } catch (error) {
      console.error('خطأ غير متوقع أثناء حفظ القسم:', error)
      setFormError('تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي تاني')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category) => {
    if (isSaving || deletingId) return

    setDeletingId(category.id)

    try {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id)

      if (countError) {
        console.error('خطأ في عدّ منتجات القسم:', countError)
        toast.error('تعذر حذف القسم، حاولي مرة تانية')
        return
      }

      const message = count > 0
        ? `القسم "${category.name}" فيه ${count} منتج، هيفضلوا من غير قسم. متأكدة من الحذف؟`
        : `حذف القسم "${category.name}"؟`

      if (!window.confirm(message)) return

      // فصل المنتجات عن القسم الأول، فمفيش احتمال إنها تتمسح معاه مهما كان إعداد الـ foreign key
      if (count > 0) {
        const { error: detachError } = await supabase
          .from('products')
          .update({ category_id: null })
          .eq('category_id', category.id)

        if (detachError) {
          console.error('خطأ في فصل المنتجات عن القسم:', detachError)
          toast.error('تعذر حذف القسم، حاولي مرة تانية')
          return
        }
      }

      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)
        .select('id')

      if (error || !data?.length) {
        console.error('خطأ في حذف القسم:', error)
        toast.error('تعذر حذف القسم، حاولي مرة تانية')
        return
      }

      if (editingId === category.id) resetForm()
      toast.success('تم حذف القسم')
      await fetchCategories()
    } catch (error) {
      console.error('خطأ غير متوقع أثناء حذف القسم:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="pg-admin-categories">
      <HeaderTwo />
      <PageTransition>
        <div className="container admin-categories-content">
          <AdminNav />

          <h2 className="admin-categories-title">الأقسام</h2>

          <form className="category-form" onSubmit={handleSubmit}>
            <h3 className="category-form-title">
              {editingId ? 'تعديل قسم' : 'إضافة قسم'}
            </h3>

            <div className="category-form-field">
              <label htmlFor="cf-name">اسم القسم</label>
              <input
                id="cf-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={50}
                placeholder="قمصان رجالي"
                required
              />
            </div>

            <div className="category-form-field">
              <label htmlFor="cf-slug"> slug </label>
              <input
                id="cf-slug"
                type="text"
                name="slug"
                className="category-slug-input"
                value={form.slug}
                onChange={handleChange}
                maxLength={50}
                placeholder="men-shirts"
                dir="ltr"
                autoComplete="off"
                required
              />
              <span className="category-form-hint">
    حروف إنجليزية صغيرة وأرقام  مثل category1 _ category-1
              </span>
            </div>

            {formError && (
              <p className="category-form-error" role="alert">{formError}</p>
            )}

            <div className="category-form-actions">
              <button type="submit" className="category-form-save" disabled={isSaving}>
                {isSaving ? 'جاري الحفظ...' : (editingId ? 'حفظ التعديل' : 'إضافة')}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="category-form-cancel"
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>

          {loading && <p className="admin-categories-message">جاري تحميل الأقسام...</p>}

          {!loading && loadError && (
            <div className="admin-categories-message">
              <p>تعذر تحميل الأقسام</p>
              <button type="button" className="admin-retry" onClick={fetchCategories}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !loadError && categories.length === 0 && (
            <p className="admin-categories-message">لا توجد أقسام</p>
          )}

          {!loading && !loadError && categories.map((category) => (
            <article className="admin-category" key={category.id}>
              <div className="admin-category-info">
                <h3>{category.name}</h3>
                {category.slug ? (
                  <p className="admin-category-slug" dir="ltr">/category/{category.slug}</p>
                ) : (
                  <p className="admin-category-noslug">بدون رابط، عدّليه عشان القسم يشتغل</p>
                )}
              </div>

              <div className="admin-category-actions">
                <button
                  type="button"
                  className="admin-category-edit"
                  onClick={() => startEdit(category)}
                  disabled={isSaving || Boolean(deletingId)}
                >
                  تعديل
                </button>
                <button
                  type="button"
                  className="admin-category-delete"
                  onClick={() => handleDelete(category)}
                  disabled={isSaving || Boolean(deletingId)}
                >
                  {deletingId === category.id ? 'جاري الحذف...' : 'حذف'}
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

export default AdminCategories