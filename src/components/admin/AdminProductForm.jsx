import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import './AdminProductForm.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import AdminNav from './AdminNav'
import { supabase } from '../../supabaseClient'
import { compressImage, getImageErrorMessage } from '../utils/compressImage'

const BUCKET = 'product-images'
const MAX_IMAGES = 8
const MAX_PRICE = 1000000
const AVAILABILITY_OPTIONS = ['متوفر', 'غير متوفر']

// "S, M, L" أو "S، M، L" أو سطر لكل قيمة ← مصفوفة من غير تكرار
const parseList = (text) => [
  ...new Set(text.split(/[,،\n]/).map((value) => value.trim()).filter(Boolean)),
]

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  availability: 'متوفر',
  categoryId: '',
  colors: '',
  sizes: '',
  isHidden: false,
}

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const productId = Number(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [loadState, setLoadState] = useState('ok') // ok | notfound | error
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fileInputRef = useRef(null)
  const imagesRef = useRef([])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  // تنضيف روابط المعاينة المؤقتة لما نسيب الصفحة
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (isEdit && !Number.isInteger(productId)) {
        setLoadState('notfound')
        setLoading(false)
        return
      }

      try {
        const [categoriesRes, productRes] = await Promise.all([
          supabase.from('categories').select('id, name').order('id'),
          isEdit
            ? supabase.from('products').select('*').eq('id', productId).maybeSingle()
            : Promise.resolve({ data: null, error: null }),
        ])

        if (cancelled) return

        if (categoriesRes.error || productRes.error) {
          console.error('خطأ في تحميل البيانات:', categoriesRes.error || productRes.error)
          setLoadState('error')
          return
        }

        setCategories(categoriesRes.data || [])

        if (isEdit) {
          const product = productRes.data
          if (!product) {
            setLoadState('notfound')
            return
          }

          setForm({
            title: product.title || '',
            description: product.description || '',
            price: String(product.price ?? ''),
            availability: product.availability || 'متوفر',
            categoryId: product.category_id ? String(product.category_id) : '',
            colors: (product.colors || []).join(', '),
            sizes: (product.sizes || []).join(', '),
            isHidden: Boolean(product.is_hidden),
          })
          setImages((product.images || []).map((url, index) => ({ key: `existing-${index}`, url })))
        }
      } catch (error) {
        console.error('خطأ غير متوقع في تحميل البيانات:', error)
        if (!cancelled) setLoadState('error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [isEdit, productId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // عشان نقدر نختار نفس الملف تاني
    if (files.length === 0) return

    const room = MAX_IMAGES - imagesRef.current.length
    if (room <= 0) {
      toast.error(`الحد الأقصى ${MAX_IMAGES} صور`)
      return
    }
    if (files.length > room) {
      toast.error(`الحد الأقصى ${MAX_IMAGES} صور، هتتضاف أول ${room} فقط`)
    }

    setIsProcessing(true)
    const added = []
    let firstError = null

    for (const file of files.slice(0, room)) {
      try {
        const { blob, ext } = await compressImage(file)
        added.push({
          key: crypto.randomUUID(),
          blob,
          ext,
          previewUrl: URL.createObjectURL(blob),
        })
      } catch (error) {
        console.error('خطأ في معالجة الصورة:', error)
        if (!firstError) firstError = error
      }
    }

    setImages((prev) => [...prev, ...added])
    setIsProcessing(false)
    if (firstError) toast.error(getImageErrorMessage(firstError))
  }

  const removeImage = (key) => {
    const target = imagesRef.current.find((item) => item.key === key)
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
    setImages((prev) => prev.filter((item) => item.key !== key))
  }

  // الصورة الأولى هي اللي بتظهر في كارت المنتج
  const makeMainImage = (key) => {
    setImages((prev) => {
      const target = prev.find((item) => item.key === key)
      return target ? [target, ...prev.filter((item) => item.key !== key)] : prev
    })
  }

  const uploadImage = async (blob, ext) => {
    const path = `products/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type,
      cacheControl: '31536000', // الأسماء فريدة، فالمتصفح يقدر يحتفظ بالصورة سنة
    })
    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return { path, url: data.publicUrl }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || isProcessing) return

    const title = form.title.trim()
    const description = form.description.trim()
    const price = Number(form.price)

    if (!title) return setFormError('اسم المنتج مطلوب')
    if (!description) return setFormError('وصف المنتج مطلوب')
    if (!Number.isInteger(price) || price < 1 || price > MAX_PRICE) {
      return setFormError('السعر لازم يكون رقم صحيح أكبر من صفر')
    }
    if (images.length === 0) return setFormError('أضيفي صورة واحدة على الأقل')

    setFormError('')
    setIsSubmitting(true)

    const uploadedPaths = []
    let saved = false

    try {
      // الرفع الأول، ولو الحفظ فشل بعده نمسح اللي اترفع
      const finalUrls = []
      for (const item of images) {
        if (item.blob) {
          const { path, url } = await uploadImage(item.blob, item.ext)
          uploadedPaths.push(path)
          finalUrls.push(url)
        } else {
          finalUrls.push(item.url)
        }
      }

      const colors = parseList(form.colors)
      const sizes = parseList(form.sizes)

      const payload = {
        title,
        description,
        price,
        availability: form.availability,
        category_id: form.categoryId ? Number(form.categoryId) : null,
        colors: colors.length ? colors : null,
        sizes: sizes.length ? sizes : null,
        images: finalUrls,
        is_hidden: form.isHidden,
      }

      // .select() بيرجّع الصف، فنعرف لو الحفظ ما حصلش فعلاً (RLS بترفض من غير خطأ ظاهر)
      const { data, error } = isEdit
        ? await supabase.from('products').update(payload).eq('id', productId).select('id')
        : await supabase.from('products').insert(payload).select('id')

      if (error || !data?.length) {
        console.error('خطأ في حفظ المنتج:', error)
        setFormError('تعذر حفظ المنتج، حاولي مرة تانية')
        return
      }

      saved = true
      toast.success(isEdit ? 'تم تعديل المنتج' : 'تم إضافة المنتج')
      navigate('/admin/products')
    } catch (error) {
      console.error('خطأ غير متوقع أثناء الحفظ:', error)
      setFormError('حصلت مشكلة أثناء الحفظ أو رفع الصور، تأكدي من الإنترنت وحاولي تاني')
    } finally {
      if (!saved && uploadedPaths.length > 0) {
        supabase.storage
          .from(BUCKET)
          .remove(uploadedPaths)
          .catch((cleanupError) => console.error('فشل مسح الصور المرفوعة:', cleanupError))
      }
      setIsSubmitting(false)
    }
  }

  // لو المنتج له قيمة توفر غير المعروفة، نخليها ظاهرة في القايمة بدل ما تتغير بالغلط
  const availabilityOptions = AVAILABILITY_OPTIONS.includes(form.availability)
    ? AVAILABILITY_OPTIONS
    : [...AVAILABILITY_OPTIONS, form.availability]

  let content

  if (loading) {
    content = <p className="product-form-message">جاري التحميل...</p>
  } else if (loadState === 'notfound') {
    content = (
      <div className="product-form-message">
        <p>المنتج غير موجود</p>
        <Link to="/admin/products">العودة للمنتجات</Link>
      </div>
    )
  } else if (loadState === 'error') {
    content = (
      <div className="product-form-message">
        <p>تعذر تحميل البيانات</p>
        <Link to="/admin/products">العودة للمنتجات</Link>
      </div>
    )
  } else {
    content = (
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form-field">
          <label htmlFor="pf-title">اسم المنتج</label>
          <input
            id="pf-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            required
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="pf-description">الوصف</label>
          <textarea
            id="pf-description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            maxLength={2000}
            required
          />
        </div>

        <div className="product-form-row">
          <div className="product-form-field">
            <label htmlFor="pf-price">السعر (جنيه)</label>
            <input
              id="pf-price"
              type="number"
              name="price"
              min="1"
              step="1"
              inputMode="numeric"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="product-form-field">
            <label htmlFor="pf-availability">التوفر</label>
            <select
              id="pf-availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-form-field">
          <label htmlFor="pf-category">القسم</label>
          <select
            id="pf-category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">بدون قسم</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="product-form-row">
          <div className="product-form-field">
            <label htmlFor="pf-colors">الألوان</label>
            <input
              id="pf-colors"
              type="text"
              name="colors"
              value={form.colors}
              onChange={handleChange}
              placeholder="أبيض, أسود, بيج"
            />
            <span className="product-form-hint">افصلي بين الألوان بفاصلة. سيبيها فاضية لو المنتج من غير ألوان</span>
          </div>

          <div className="product-form-field">
            <label htmlFor="pf-sizes">المقاسات</label>
            <input
              id="pf-sizes"
              type="text"
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL"
            />
            <span className="product-form-hint">افصلي بين المقاسات بفاصلة. سيبيها فاضية لو المنتج من غير مقاسات</span>
          </div>
        </div>

        <div className="product-form-field">
          <span className="product-form-label">الصور ({images.length}/{MAX_IMAGES})</span>

          {images.length > 0 && (
            <ul className="product-form-images">
              {images.map((item, index) => (
                <li key={item.key}>
                  <img src={item.previewUrl || item.url} alt={`صورة المنتج ${index + 1}`} />
                  {index === 0 && <span className="product-form-main">الرئيسية</span>}
                  <div className="product-form-image-actions">
                    {index !== 0 && (
                      <button type="button" onClick={() => makeMainImage(item.key)}>
                        رئيسية
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(item.key)}>
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={handleFilesSelected}
          />
          <button
            type="button"
            className="product-form-upload"
            disabled={isProcessing || images.length >= MAX_IMAGES}
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessing ? 'جاري تجهيز الصور...' : '+ إضافة صور'}
          </button>
          <span className="product-form-hint">
            الصور بتتصغّر وتتحوّل لـ WebP تلقائياً قبل الرفع. الصورة الأولى هي اللي بتظهر في الكارت
          </span>
        </div>

        <label className="product-form-check">
          <input
            type="checkbox"
            name="isHidden"
            checked={form.isHidden}
            onChange={handleChange}
          />
          <span>إخفاء المنتج عن الزوار</span>
        </label>

        {formError && (
          <p className="product-form-error" role="alert">{formError}</p>
        )}

        <div className="product-form-actions">
          <button
            type="submit"
            className="product-form-save"
            disabled={isSubmitting || isProcessing}
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ المنتج'}
          </button>
          <Link to="/admin/products" className="product-form-cancel">إلغاء</Link>
        </div>
      </form>
    )
  }

  return (
    <div className="pg-admin-product-form">
      <HeaderTwo />
      <PageTransition>
        <div className="container product-form-content">
          <AdminNav />
          <h2 className="product-form-title">{isEdit ? 'تعديل منتج' : 'إضافة منتج'}</h2>
          {content}
        </div>
        <Footer />
      </PageTransition>
    </div>
  )
}

export default AdminProductForm