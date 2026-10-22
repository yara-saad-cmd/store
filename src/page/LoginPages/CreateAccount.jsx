import React, { useContext, useState } from 'react'
import "./LoginPages.css"
import { Link, Navigate } from 'react-router-dom'
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'
// رسائل عربية بدل رسائل الخطأ التقنية الجاية من Supabase
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'over_email_send_rate_limit':
      return 'تم إرسال عدد كبير من الرسائل، حاولي بعد قليل'
    case 'email_address_not_authorized':
      return 'هذا البريد غير مسموح له بالتسجيل حالياً'
    case 'weak_password':
      return 'كلمة المرور ضعيفة، جربي كلمة أطول وأصعب'
    default:
      return 'حصلت مشكلة أثناء إنشاء الحساب، حاولي مرة تانية'
  }
}

function CreateAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error' | 'success', text }
  const { user, loading } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    // لازم نحفظ الفورم قبل أي await، لأن e.currentTarget بيتفضّى بعده
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name').trim()
    const email = formData.get('email').trim().toLowerCase()
    const phone = formData.get('phone').trim()
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone: phone || null },
          // بنرجّع العميلة للصفحة الرئيسية بعد ما تدوس رابط التأكيد
          emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      })

      if (error) {
        console.error('خطأ في إنشاء الحساب:', error)
        setMessage({ type: 'error', text: getErrorMessage(error) })
        return
      }

      // لو البريد مسجّل قبل كده، Supabase بيرجّع نجاح شكلي من غير ما يبعت حاجة
      if (data.user?.identities?.length === 0) {
        setMessage({ type: 'error', text: 'هذا البريد مسجّل بالفعل، جربي تسجيل الدخول' })
        return
      }

      form.reset()
      setMessage({
        type: 'success',
        text: 'تم إنشاء الحساب. بعتنا رابط تأكيد على بريدك، افتحيه لتفعيل الحساب.',
      })
    } catch (error) {
      console.error('خطأ غير متوقع أثناء إنشاء الحساب:', error)
      setMessage({
        type: 'error',
        text: 'تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي تاني',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  if (!loading && user) {
    return <Navigate to="/" replace />
  }
  return (
    <div className="pg-create-account">
      <HeaderTwo />
      <PageTransition>
        <div className="container cont-iogin">
          <form className="all-content-pag" onSubmit={handleSubmit}>
            <h3 className="titel-create-account">انشاء حساب جديد</h3>

            <div className="inputs-arya">
              <input
                type="text"
                name="name"
                className="inp-data"
                placeholder="الاسم"
                aria-label="الاسم"
                autoComplete="name"
                required
              />
              <input
                type="email"
                name="email"
                className="inp-data"
                placeholder="البريد الإلكتروني"
                aria-label="البريد الإلكتروني"
                autoComplete="email"
                required
              />
              <input
                type="tel"
                name="phone"
                className="inp-data"
                placeholder="رقم الهاتف (مثال: 01012345678)"
                aria-label="رقم الهاتف"
                autoComplete="tel"
                inputMode="numeric"
                pattern="01[0-9]{9}"
                title="رقم هاتف مصري من 11 رقم يبدأ بـ 01"
              />
              <input
                type="password"
                name="password"
                className="inp-data"
                placeholder="كلمة المرور"
                aria-label="كلمة المرور"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                className="inp-data"
                placeholder="تأكيد كلمة المرور"
                aria-label="تأكيد كلمة المرور"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {message && (
              <p
                className={`form-message form-message-${message.type}`}
                role={message.type === 'error' ? 'alert' : 'status'}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              className="put-create-account"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'انشاء الحساب'}
            </button>

            <Link to="/login" className="create-account-puttom">
              لدي حساب بالفعل
            </Link>
          </form>
        </div>

        <Footertwo />
      </PageTransition>
    </div>
  )
}

export default CreateAccount