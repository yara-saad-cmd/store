import React, { createContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../supabaseClient'

export const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: false,
})

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // بنحفظ نتيجة الفحص مع id صاحبها، عشان نعرف إنها تخص المستخدم الحالي
  const [adminState, setAdminState] = useState({ userId: null, isAdmin: false })

  const userId = user?.id ?? null

  useEffect(() => {
    let isMounted = true

    // قراءة الجلسة المحفوظة عند فتح الموقع
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (isMounted) setUser(data.session?.user ?? null)
      } catch (error) {
        console.error('خطأ في قراءة الجلسة:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSession()

    // متابعة أي دخول أو خروج بعد كده
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // فحص الأدمن في effect منفصل، لأن استدعاء Supabase جوه onAuthStateChange ممكن يعلّق
  useEffect(() => {
    if (!userId) {
      setAdminState({ userId: null, isAdmin: false })
      return
    }

    let cancelled = false

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin')
        if (cancelled) return

        if (error) {
          console.error('خطأ في فحص صلاحية الأدمن:', error)
          setAdminState({ userId, isAdmin: false })
          return
        }

        setAdminState({ userId, isAdmin: data === true })
      } catch (error) {
        console.error('خطأ غير متوقع في فحص الأدمن:', error)
        if (!cancelled) setAdminState({ userId, isAdmin: false })
      }
    }

    checkAdmin()

    return () => {
      cancelled = true
    }
  }, [userId])

  const value = useMemo(() => {
    const checked = Boolean(userId) && adminState.userId === userId
    return {
      user,
      loading,
      isAdmin: checked && adminState.isAdmin,
      adminLoading: Boolean(userId) && !checked,
    }
  }, [user, loading, userId, adminState])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}