
import React, { useContext, useState } from "react";

import toast from "react-hot-toast";
import PageLocation from "../../components/pageLocationFolder/pageLocation";

import HeaderTwo from "../../components/header/header-2";

import "./payment.css";

import imgVISA from "../../img/1764260377009.png";

import { useNavigate } from "react-router-dom";

import PageTransition from "../../components/PageTransaction";

import Footer from "../../components/footer/footer";

import { supabase } from "../../supabaseClient";

import { ContextCart } from "../../components/context/contextcart";



function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cartItems, clearCart } = useContext(ContextCart);
  const navigate = useNavigate();

 
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
        toast.error("حصلت مشكلة أثناء إرسال طلبك، من فضلك حاولي مرة تانية");
        return;
      }
      try {
        localStorage.removeItem("orderNote");
      } catch (error) {
        console.error("فشل مسح الملاحظة:", error);
      }

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
                  </div>
                </div>
              <div className="Coupon">
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

                {selectedMethod ? (
                                    <button
                                    type="button"
                                    className="btn-submit-order"
                                    onClick={handleSubmitOrder}
                                    disabled={isSubmitting}
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
              </div> </div>

             
            </div>
          </div>

          <Footer />
        </div>
      </PageTransition>
    </>
  );
}

export default Payment;