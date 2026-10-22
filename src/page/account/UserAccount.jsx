import React, { useContext, useState } from 'react'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import "./UserAccount.css"
import PageTransition from "../../components/PageTransaction"
import { FiHeart } from 'react-icons/fi'
import { TbShoppingCart } from 'react-icons/tb'
import { LuUserRound, LuLayoutDashboard } from 'react-icons/lu'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FaUserCircle, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import UserDataForm from '../../components/userdata/UserData'
import Visa from "../../components/visa/visa"
import Footertwo from '../../components/footer/footer2'
import { supabase } from '../../supabaseClient'
import { AuthContext } from '../../components/context/AuthContext'

function UserAccount() {
  const { user, loading, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('خطأ في تسجيل الخروج:', error)
        toast.error('حصلت مشكلة أثناء تسجيل الخروج، حاولي مرة تانية')
        return
      }

      // بيانات الشحن بيانات شخصية، فمنسيبهاش في المتصفح لو الجهاز مشترك
      try {
        localStorage.removeItem('userData')
        localStorage.removeItem('orderNote')
      } catch (storageError) {
        console.error('فشل مسح البيانات المحفوظة:', storageError)
      }

      navigate('/', { replace: true })
    } catch (error) {
      console.error('خطأ غير متوقع أثناء تسجيل الخروج:', error)
      toast.error('تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي تاني')
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) return null

  // لو مفيش مستخدم نرجّعه لصفحة الدخول، إلا لو إحنا في نص عملية الخروج نفسها
  if (!user) {
    return isSigningOut ? null : <Navigate to="/" replace />
  }

  const displayName = user.user_metadata?.name || user.email

  return (
    <div className='all-pg-account'>

      <PageTransition>
        <TopHeader />
        <BtmHeader />
        <div className="pg-account">
          <div className="container">

            <div className="log-out">
              <button
                type="button"
                className='btn-logout'
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </button>
            </div>

            <div className="pg-body">

              <div className="pages-sidebar">

                <div className="user-name">
                  <h3> <FaUserCircle /> {displayName}</h3>
                </div>

                <div className="more-pages">

                  <Link to="/user-account" className='pg-user'> <LuUserRound /> <span>الملف الشخصي</span></Link>
                  <Link to="/like" className='pg-favorite'>  <FiHeart /><span>قائمة المفضل</span></Link>
                  <Link to="/cart" className='pg-cart-icon'>  <TbShoppingCart /><span>سلة المشتريات</span></Link>
                  {isAdmin && (
                    <Link to="/admin" className='pg-admin'> <LuLayoutDashboard /> <span>لوحة التحكم</span></Link>
                  )}
                  <p className='message'><FaWhatsapp /><span>الرسائل</span></p>

                </div>

              </div>

              <div className="data-user-and-orders">

                <div className="usar-data">
                  <div className="data">
                    <UserDataForm />
                  </div>
                </div>

                <div className="cash-visa">
                  <Visa />
                </div>

              </div>

            </div>

          </div>
        </div>
        <Footertwo />
      </PageTransition>

    </div>
  )
}

export default UserAccount;