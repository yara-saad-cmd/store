
import React, { useContext, useState } from "react";

import PageLocation from "../../components/pageLocationFolder/pageLocation";

import HeaderTwo from "../../components/header/header-2";

import "./payment.css";

import imgVISA from "../../img/1764260377009.png";

import { Link, useNavigate } from "react-router-dom";

import PageTransition from "../../components/PageTransaction";

import Footer from "../../components/footer/footer";

import { supabase } from "../../supabaseClient";

import { ContextCart } from "../../components/context/contextcart";


function Payment() {
  const [selectedMethod, setSelectedMethod] = useState("");

  const { cartItems } = useContext(ContextCart);
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

  // حساب الإجمالي بنفس منطق Invoice.jsx بالظبط
  const calculateOrderTotal = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const discount = 10;
    const discountAmount = (total * discount) / 100;
    const subtotal = total - discountAmount;
    const shipping = 60;
    const totalPrice = subtotal + shipping;

    return { subtotal, shipping, totalPrice };
  };

  // إرسال الطلب لقاعدة البيانات عند الضغط على "متابعة"
  const handleSubmitOrder = async () => {
    const userData = getSavedUserData();

    if (
      !userData ||
      !userData.name?.trim() ||
      !userData.phone?.trim() ||
      !userData.governorate?.trim() ||
      !userData.address?.trim()
    ) {
      console.log("بيانات العميل ناقصة");
      return;
    }

    if (cartItems.length === 0) {
      console.log("العربة فارغة");
      return;
    }

    const { subtotal, shipping, totalPrice } = calculateOrderTotal();

    const { data: newOrderId, error: orderError } = await supabase.rpc(
      "create_order",
      {
        order_data: {
          customer_name: userData.name,
          customer_phone: userData.phone,
          customer_phone2: userData.phone2 || null,
          governorate: userData.governorate,
          address: userData.address,
          payment_method: selectedMethod,
          subtotal: subtotal,
          shipping: shipping,
          total: totalPrice,
        },
      }
    );

    if (orderError) {
      console.error("خطأ في إنشاء الطلب:", orderError);
      return;
    }

    console.log("تم إنشاء الطلب بنجاح، رقم الطلب:", newOrderId);

    // تحويل منتجات العربة لشكل يطابق أعمدة جدول order_items
    const orderItemsPayload = cartItems.map((item) => ({
      order_id: newOrderId,
      product_id: item.id,
      product_title: item.title,
      selected_size: item.selectedSize || null,
      selected_color: item.selectedColor || null,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("خطأ في إضافة منتجات الطلب:", itemsError);
      return;
    }

    console.log("تم إضافة منتجات الطلب بنجاح");

    navigate("/order-done");
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
                  >
                    متابعة
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