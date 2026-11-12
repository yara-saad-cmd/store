import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './AdminShipping.css'
import HeaderTwo from '../header/header-2'
import PageTransition from '../PageTransaction'
import Footer from '../footer/footer'
import AdminNav from './AdminNav'
import { supabase } from '../../supabaseClient'
import './AdminShared.css'

const MAX_FEE = 10000

function AdminShipping() {
  const [rates, setRates] = useState([])
  const [fees, setFees] = useState({}) // القيم اللي بتتكتب في الحقول: { [governorate]: 'نص' }
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [savingGov, setSavingGov] = useState(null)

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const { data, error } = await supabase
        .from('shipping_rates')
        .select('governorate, fee')
        .order('governorate')

      if (error) {
        console.error('خطأ في جلب أسعار الشحن:', error)
        setLoadError(true)
        return
      }

      setRates(data || [])
      setFees(Object.fromEntries((data || []).map((r) => [r.governorate, String(r.fee)])))
    } catch (error) {
      console.error('خطأ غير متوقع في جلب أسعار الشحن:', error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  const handleChange = (governorate, value) => {
    setFees((prev) => ({ ...prev, [governorate]: value }))
  }

  const handleSave = async (rate) => {
    if (savingGov) return

    const fee = Number(fees[rate.governorate])

    if (!Number.isInteger(fee) || fee < 0 || fee > MAX_FEE) {
      toast.error(`السعر لازم يكون رقم صحيح من 0 إلى ${MAX_FEE}`)
      return
    }

    setSavingGov(rate.governorate)

    try {
      // .select() بيرجّع الصف، فنعرف لو الحفظ ما حصلش فعلاً (RLS بترفض من غير خطأ ظاهر)
      const { data, error } = await supabase
        .from('shipping_rates')
        .update({ fee })
        .eq('governorate', rate.governorate)
        .select('governorate')

      if (error || !data?.length) {
        console.error('خطأ في حفظ سعر الشحن:', error)
        toast.error('تعذر حفظ السعر، حاولي مرة تانية')
        return
      }

      setRates((prev) =>
        prev.map((r) => (r.governorate === rate.governorate ? { ...r, fee } : r))
      )
      toast.success(`تم حفظ سعر ${rate.governorate}`)
    } catch (error) {
      console.error('خطأ غير متوقع أثناء حفظ سعر الشحن:', error)
      toast.error('تعذر الاتصال بالخادم، حاولي تاني')
    } finally {
      setSavingGov(null)
    }
  }

  return (
    <div className="pg-admin-shipping">
      <HeaderTwo />
      <PageTransition>
        <div className="container admin-shipping-content">
          <AdminNav />

          <h2 className="admin-shipping-title">أسعار الشحن</h2>

          {loading && <p className="admin-shipping-message">جاري تحميل الأسعار...</p>}

          {!loading && loadError && (
            <div className="admin-shipping-message">
              <p>تعذر تحميل الأسعار</p>
              <button type="button" className="admin-retry" onClick={fetchRates}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !loadError && rates.length === 0 && (
            <p className="admin-shipping-message">لا توجد محافظات</p>
          )}

          {!loading && !loadError && rates.map((rate) => {
            const changed = String(rate.fee) !== (fees[rate.governorate] ?? '')

            return (
              <div className="admin-shipping-row" key={rate.governorate}>
                <label htmlFor={`ship-${rate.governorate}`}>{rate.governorate}</label>
                <input
                  id={`ship-${rate.governorate}`}
                  type="number"
                  min="0"
                  max={MAX_FEE}
                  step="1"
                  inputMode="numeric"
                  value={fees[rate.governorate] ?? ''}
                  onChange={(e) => handleChange(rate.governorate, e.target.value)}
                  disabled={Boolean(savingGov)}
                />
                <span className="admin-shipping-unit">جنيه</span>
                <button
                  type="button"
                  className="admin-shipping-save"
                  onClick={() => handleSave(rate)}
                  disabled={!changed || Boolean(savingGov)}
                >
                  {savingGov === rate.governorate ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            )
          })}
        </div>

        <Footer />
      </PageTransition>
    </div>
  )
}

export default AdminShipping