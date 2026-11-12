import React, { useContext, useState } from 'react'
import "./LoginPages.css"
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'

// رسائل عربية بدل رسائل الخطأ التقنية الجاية من Supabase
const getErrorMessage = (error) => {
  switch (error.code) {
    case 'invalid_credentials':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    case 'email_not_confirmed':
      return 'لازم تأكدي بريدك الإلكتروني الأول، افتحي الرابط اللي وصلك'
    case 'over_request_rate_limit':
      return 'محاولات كتير، حاولي بعد شوية'
    default:
      return 'حصلت مشكلة أثناء تسجيل الدخول، حاولي مرة تانية'
  }
}

function Login() {
  const navigate = useNavigate()
  const { user, loading } = useContext(AuthContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error', text }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email').trim().toLowerCase()
    const password = formData.get('password')

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('خطأ في تسجيل الدخول:', error)
        setMessage({ type: 'error', text: getErrorMessage(error) })
        return
      }

      navigate('/', { replace: true })
    } catch (error) {
      console.error('خطأ غير متوقع أثناء تسجيل الدخول:', error)
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
            <h3 className="titel-pg-login">تسجيل الدخول</h3>

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
              <input
                type="password"
                name="password"
                className="inp-data"
                placeholder="كلمة المرور"
                aria-label="كلمة المرور"
                autoComplete="current-password"
                required
              />
            </div>

            {message && (
              <p
                className={`form-message form-message-${message.type}`}
                role="alert"
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              className="log-in-puttom"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <Link to="/forgot-password" className="create-account-puttom">
              نسيت كلمة المرور؟
            </Link>

            <Link to="/CreateAccount" className="create-account-puttom">
              انشاء حساب جديد
            </Link>
          </form>
        </div>

        <Footertwo />
      </PageTransition>
    </div>
  )
}

export default Login