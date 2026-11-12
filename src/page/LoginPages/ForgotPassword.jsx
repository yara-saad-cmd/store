import React, { useContext, useState } from 'react'
import "./LoginPages.css"
import { Link, Navigate } from 'react-router-dom'
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'

function ForgotPassword() {
  const { user, loading } = useContext(AuthContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error' | 'success', text }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    // لازم نحفظ الفورم قبل أي await، لأن e.currentTarget بيتفضّى بعده
    const form = e.currentTarget
    const email = new FormData(form).get('email').trim().toLowerCase()

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}reset-password`,
      })

      if (error) {
        console.error('خطأ في طلب استرجاع كلمة المرور:', error)

        if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
          setMessage({ type: 'error', text: 'محاولات كتير، حاولي بعد قليل' })
          return
        }
        setMessage({ type: 'error', text: 'حصلت مشكلة، حاولي مرة تانية' })
        return
      }

      // نفس الرسالة سواء الإيميل مسجّل أو لأ، عشان محدش يعرف مين عندنا حساب
      form.reset()
      setMessage({
        type: 'success',
        text: 'لو البريد ده مسجّل عندنا، هيوصلك رابط لتغيير كلمة المرور.',
      })
    } catch (error) {
      console.error('خطأ غير متوقع في استرجاع كلمة المرور:', error)
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
    <div className="pg-login">
      <HeaderTwo />
      <PageTransition>
        <div className="container cont-iogin">
          <form className="login-arya" onSubmit={handleSubmit}>
            <h3 className="titel-pg-login">نسيت كلمة المرور</h3>

            <div className="inputs">
              <input
                type="email"
                name="email"
                className="inp-data"
                placeholder="البريد الإلكتروني"
                aria-label="البريد الإلكتروني"
                autoComplete="email"
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
              className="log-in-puttom"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال رابط الاسترجاع'}
            </button>

            <Link to="/login" className="create-account-puttom">
              العودة لتسجيل الدخول
            </Link>
          </form>
        </div>

        <Footertwo />
      </PageTransition>
    </div>
  )
}

export default ForgotPassword