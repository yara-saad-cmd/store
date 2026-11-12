import React, { useContext, useState } from "react";

import toast from "react-hot-toast";
import PageLocation from "../../components/pageLocationFolder/pageLocation";

import HeaderTwo from "../../components/header/header-2";

import "./payment.css";

import imgVISA from "../../img/1764260377009.png";

import { Navigate, useNavigate } from "react-router-dom";
import PageTransition from "../../components/PageTransaction";

import Footer from "../../components/footer/footer";

import { supabase } from "../../supabaseClient";
import { ContextCart } from "../../components/context/contextcart";
import useCartStatus from "../../components/context/useCartStatus";
import { siteInfo } from "../../components/siteInfo";
const { visa: visaEnabled, coupons: couponsEnabled } = siteInfo.payment;


// القاعدة بترجّع كود ثابت، والرسالة اللي بتظهر للعميلة بتتكتب هنا ونقدر نغيّرها براحتنا
const ORDER_ERRORS = {
  limit_phone: "وصلتِ للحد الأقصى من الطلبات، حاولي لاحقا",
  limit_total: "حدث مشكله حاولي بعد قليل",
  item_unavailable: "احد المنتجات التي طلبتها غبر متاحه",
  item_out_of_stock: "أحد المنتجات التي طلبتها غير متوفر حالياً",
};

const getOrderErrorMessage = (error) => {
  const code = error?.hint || error?.message || "";
  return ORDER_ERRORS[code] || "حصلت مشكلة أثناء إرسال طلبك، من فضلك حاولي مرة تانية";
};

// لو العميلة مجتش من صفحة التفاصيل (فتحت الرابط مباشرة) نرجّعها للعربة
const cameFromDetails = () => {
  try {
    return sessionStorage.getItem("stepPayment") === "1";
  } catch (error) {
    console.error("خطأ في قراءة علامة الخطوة:", error);
    return true; // لو التخزين مش شغال منقفلش عليها الطريق
  }
};

function Payment() {
   // لو الفيزا مقفولة، الدفع عند الاستلام بيتحدد تلقائياً
   const [selectedMethod, setSelectedMethod] = useState(visaEnabled ? "" : "cash");
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { cartItems, clearCart } = useContext(ContextCart);
  const { problems, checking } = useCartStatus(cartItems);
  const navigate = useNavigate();

  const hasBlockingProblem = Object.keys(problems).length > 0;

  // قراءة بيانات العميل المحفوظة من فورم الشحن (UserData.jsx)
  const getSavedUserData = () => {
    try {
      const saved = localStorage.getItem("userData");
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object") return null;

      return parsed;
    } catch (error) {
      console.error("خطأ في قراءة بيانات العميل:", error);
      return null;
    }
  };

  // قراءة الملاحظة اللي العميلة كتبتها في صفحة تفاصيل الطلب
  const getSavedNote = () => {
    try {
      return localStorage.getItem("orderNote") || "";
    } catch (error) {
      console.error("خطأ في قراءة الملاحظة:", error);
      return "";
    }
  };


  // إرسال الطلب لقاعدة البيانات عند الضغط على "متابعة"
  const handleSubmitOrder = async () => {
    if (isSubmitting) return;

    const userData = getSavedUserData();

    if (
      !userData ||
      !userData.name?.trim() ||
      !userData.phone?.trim() ||
      !userData.governorate?.trim() ||
      !userData.address?.trim()
    ) {
      toast.error("من فضلك أكملي بيانات الشحن في صفحة تفاصيل الطلب");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("العربة فارغة");
      return;
    }

    if (hasBlockingProblem) {
      toast.error("في منتج في العربة غير متاح، راجعي العربة الأول");
      return;
    }

    setIsSubmitting(true);

    try {
      // بنبعت بس اختيارات العميلة، والأسعار بتتحسب في قاعدة البيانات
      const orderItemsPayload = cartItems.map((item) => ({
        product_id: item.id,
        selected_size: item.selectedSize || null,
        selected_color: item.selectedColor || null,
        quantity: item.quantity,
      }));

      // استدعاء واحد: الطلب ومنتجاته بيتسجلوا مع بعض أو مفيش حاجة بتتسجل
      const { data: newOrderId, error: orderError } = await supabase.rpc(
        "create_order_with_items",
        {
          order_data: {
            customer_name: userData.name,
            customer_phone: userData.phone,
            customer_phone2: userData.phone2 || null,
            governorate: userData.governorate,
            address: userData.address,
            payment_method: selectedMethod,
            note: getSavedNote().trim() || null,
          },
          items: orderItemsPayload,
        }
      );

      if (orderError) {
        console.error("خطأ في إنشاء الطلب:", orderError);
        toast.error(getOrderErrorMessage(orderError), { duration: 4000 });

        // منتج اتخفى أو خلص: نرجّعها للعربة عشان الفحص هناك يوريها أنهي منتج
        const code = orderError?.hint || orderError?.message || "";
        if (code === "item_unavailable" || code === "item_out_of_stock") {
          navigate("/cart", { replace: true });
        }
        return;
      }
      try {
        localStorage.removeItem("orderNote");
      } catch (error) {
        console.error("فشل مسح الملاحظة:", error);
      }
      try {
        sessionStorage.removeItem("stepDetails");
        sessionStorage.removeItem("stepPayment");
      } catch (error) {
        console.error("فشل مسح علامات الخطوات:", error);
      }

      setOrderPlaced(true);
      clearCart();
      navigate("/order-done", {
        state: { orderId: newOrderId },
        replace: true,
      });

    } catch (error) {
      console.error("خطأ غير متوقع أثناء إرسال الطلب:", error);
      toast.error("تعذر الاتصال بالخادم، تأكدي من الإنترنت وحاولي تاني");
    } finally {
      setIsSubmitting(false);
    }
  };

   // لو العربة فاضية (فتح الصفحة بالرابط مثلاً) نرجّعها للعربة
   if ((cartItems.length === 0 || !cameFromDetails()) && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  if (hasBlockingProblem && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <>
      <HeaderTwo />

      <PageTransition>
        <div className="pg-cash">
          <div className="all-payment">
            <div className="container">
              <div className="pg-title">
                <PageLocation />
              </div>

              <div className="all-content">
                <div className="payment-methods">
                  <div className="radio-group">
                    <h3 className="text-title">
                      اختر طريقة الدفع
                    </h3>

                    <label
                      className="radio-card"
                      htmlFor="cash-payment"
                    >
                      <input
                        id="cash-payment"
                        type="radio"
                        name="pay"
                        value="cash"
                        checked={selectedMethod === "cash"}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                      />

                      <span className="custom-radio"></span>

                      <div className="radio-content">
                        <span className="text">
                          الدفع عند الاستلام
                        </span>

                        <p className="desc">
                          معلومات حول الدفع عند الاستلام
                        </p>
                      </div>
                    </label>

                    {visaEnabled && (
                    <label
                      className="radio-card"
                      htmlFor="visa-payment"
                    >
                      <input
                        id="visa-payment"
                        type="radio"
                        name="pay"
                        value="visa"
                        checked={selectedMethod === "visa"}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                      />

                      <span className="custom-radio"></span>

                      <div className="radio-content">
                        <span className="text">
                          الدفع بالفيزا
                        </span>

                        <p className="desc">
                          معلومات حول الدفع باستخدام البطاقة البنكية
                        </p>

                        <div className="more-details">
                          <button type="button">
                            اضف بطاقه بنكيه
                          </button>

                          <div className="visa">
                            <p>طرق الدفع المتاحة</p>

                            <span>
                              <img src={imgVISA} alt="Visa" />
                            </span>

                            <span>
                              <img src={imgVISA} alt="Visa" />
                            </span>

                            <span>
                              <img src={imgVISA} alt="Visa" />
                            </span>
                          </div>
                          </div>
                      </div>
                    </label>
                    )}
                  </div>
                </div>

                <div className="Coupon">
                {couponsEnabled && (
                    <>
                      <p className="text">
                        كود الخصم الخاص بك
                      </p>

                      <div className="coupon-input">
                        <input placeholder="كود الخصم" />

                        <button
                          type="button"
                          className="add"
                        >
                          تطبيق
                        </button>
                      </div>
                    </>
                  )}
                  {selectedMethod ? (
                    <button
                      type="button"
                      className="btn-submit-order"
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting || checking}
                      >
                        {isSubmitting ? "جاري إرسال الطلب..." : "متابعة"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-submit-order btn-disabled"
                      disabled
                    >
                      اختر طريقة الدف للمتابع
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </PageTransition>
    </>
  );
}

export default Payment;