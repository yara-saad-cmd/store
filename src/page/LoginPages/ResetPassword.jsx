
import React, { useContext, useState } from 'react'
import "./LoginPages.css"
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'

function ResetPassword() {
  const navigate = useNavigate()
  const { user, loading } = useContext(AuthContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error', text }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('خطأ في تغيير كلمة المرور:', error)

        if (error.code === 'weak_password') {
          setMessage({ type: 'error', text: 'كلمة المرور ضعيفة، جربي كلمة أطول وأصعب' })
        } else if (error.code === 'same_password') {
          setMessage({ type: 'error', text: 'اختاري كلمة مرور مختلفة عن القديمة' })
        } else {
          setMessage({ type: 'error', text: 'حصلت مشكلة أثناء تغيير كلمة المرور، حاولي مرة تانية' })
        }
        return
      }

      toast.success('تم تغيير كلمة المرور')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('خطأ غير متوقع أثناء تغيير كلمة المرور:', error)
      setMessage({
        type: 'error',
        text: 'تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي تاني',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // الرابط بيسجّل العميلة بجلسة مؤقتة. لو مفيش جلسة، الرابط منتهي أو اتفتح غلط
  let content

  if (loading) {
    content = null
  } else if (!user) {
    content = (
      <div className="login-arya">
        <h3 className="titel-pg-login">الرابط غير صالح</h3>
        <p className="form-message form-message-error" role="alert">
          الرابط منتهي أو غير صحيح، اطلبي رابط جديد.
        </p>
        <Link to="/forgot-password" className="create-account-puttom">
          طلب رابط جديد
        </Link>
      </div>
    )
  } else {
    content = (
      <form className="login-arya" onSubmit={handleSubmit}>
        <h3 className="titel-pg-login">كلمة مرور جديدة</h3>

        <div className="inputs">
          <input
            type="password"
            name="password"
            className="inp-data"
            placeholder="كلمة المرور الجديدة"
            aria-label="كلمة المرور الجديدة"
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
          <p className={`form-message form-message-${message.type}`} role="alert">
            {message.text}
          </p>
        )}

        <button
          type="submit"
          className="log-in-puttom"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
        </button>
      </form>
    )
  }

  return (
    <div className="pg-login">
      <HeaderTwo />
      <PageTransition>
        <div className="container cont-iogin">{content}</div>
        <Footertwo />
      </PageTransition>
    </div>
  )
}

export default ResetPassword