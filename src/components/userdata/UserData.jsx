import React, { useContext, useEffect, useState } from "react";
import "./userdata.css";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { AuthContext } from "../context/AuthContext";
// قائمة المحافظات المسموح بها لتطبيق مفهوم Whitelisting
const ALLOWED_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية",
  "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية",
  "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "المنيا", "أسيوط",
  "سوهاج", "قنا", "أسوان", "الأقصر", "البحر الأحمر", "الوادي الجديد",
  "مطروح", "شمال سيناء", "جنوب سيناء"
];
// رقم مصري: 010 أو 011 أو 012 وبعدها 8 أرقام (لازم يطابق القاعدة)
const PHONE_PATTERN = /^01[012][0-9]{8}$/;



// دالة تنظيف النص التجريبي وإزالة الرموز الخاصة كحماية ضد XSS/Injection
// React بيهرّب النصوص تلقائياً، فبنشيل بس الأقواس والاقتباس اللي ملهمش لازمة في الاسم والعنوان
const sanitizeText = (input, maxLength = 100) => {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>"]/g, "")
    .trim()
    .slice(0, maxLength);
};

// دالة تطهير أرقام الهواتف
const sanitizePhone = (input) => {
  if (typeof input !== "string" && typeof input !== "number") return "";

  return String(input).replace(/\D/g, "").slice(0, 11);
};

export default function UserData() {
  const { user } = useContext(AuthContext);
  const userId = user?.id ?? null;

  const [inModify, setInModify] = useState(false);
  const [errors, setErrors] = useState({});
  const [numError, setNumError] = useState({ phone: "", phone2: "" });

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    phone2: "",
    governorate: "",
    address: ""
  });

  const [oldData, setOldData] = useState({});

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("userData");

      if (typeof savedData === "string" && savedData.trim() !== "") {
        const parsedData = JSON.parse(savedData);

        if (
          parsedData &&
          typeof parsedData === "object" &&
          !Array.isArray(parsedData)
        ) {
          // تطهير البيانات المسترجعة من Storage قبل إسنادها للـ State
          setUserData({
            name: sanitizeText(parsedData.name, 50),
            phone: sanitizePhone(parsedData.phone),
            phone2: sanitizePhone(parsedData.phone2),
            governorate: ALLOWED_GOVERNORATES.includes(
              parsedData.governorate
            )
              ? parsedData.governorate
              : "",
            address: sanitizeText(parsedData.address, 150)
          });
        }
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, []);

   // لو العميلة مسجّلة، بياناتها المحفوظة في حسابها تتحمّل (وتفضل بعد الخروج والدخول)
   useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("shipping_profiles")
          .select("name, phone, phone2, governorate, address")
          .eq("user_id", userId)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("خطأ في جلب بيانات الشحن:", error);
          return;
        }

        if (!data) return;

        const profileData = {
          name: sanitizeText(data.name, 50),
          phone: sanitizePhone(data.phone),
          phone2: sanitizePhone(data.phone2),
          governorate: ALLOWED_GOVERNORATES.includes(data.governorate)
            ? data.governorate
            : "",
          address: sanitizeText(data.address, 150),
        };

        setUserData(profileData);

        try {
          localStorage.setItem("userData", JSON.stringify(profileData));
          window.dispatchEvent(new Event("userDataChanged"));
        } catch (storageError) {
          console.error("فشل الحفظ في Storage:", storageError);
        }
      } catch (error) {
        console.error("خطأ غير متوقع في جلب بيانات الشحن:", error);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const hasData = Boolean(
    userData.name ||
    userData.phone ||
    userData.phone2 ||
    userData.governorate ||
    userData.address
  );

  function handleNumberChange(e) {
    const { name, value } = e.target;

    if (!/^\d*$/.test(value)) {
      setNumError((prev) => ({ ...prev, [name]: "مسموح بالأرقام فقط" }));
      return;
    }

    setNumError((prev) => ({ ...prev, [name]: "" }));

    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function validateOnSave() {
    const err = {};

    if (!userData.name?.trim()) {
      err.name = "الاسم مطلوب";
    }

    if (!userData.phone?.trim()) {
      err.phone = "رقم الهاتف مطلوب";
    } else if (!PHONE_PATTERN.test(userData.phone.trim())) {
      err.phone = "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012";
    }

    if (userData.phone2 && !PHONE_PATTERN.test(userData.phone2.trim())) {
      err.phone2 = "رقم الهاتف الثاني يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012";
    }

    if (!userData.governorate?.trim()) {
      err.governorate = "المحافظة مطلوبة";
    } else if (
      !ALLOWED_GOVERNORATES.includes(userData.governorate.trim())
    ) {
      err.governorate = "يرجى اختيار محافظة صالحة من القائمة";
    }

    if (!userData.address || !userData.address.trim()) {
      err.address = "العنوان مطلوب";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleUpdateData() {
    if (!validateOnSave()) return;

    const safeName = sanitizeText(userData.name, 50);
    const safePhone = sanitizePhone(userData.phone);
    const safePhone2 = sanitizePhone(userData.phone2);

    const safeGovernorate = ALLOWED_GOVERNORATES.includes(
      userData.governorate
    )
      ? userData.governorate
      : "";

    const safeAddress = sanitizeText(userData.address, 150);

    const cleanUserData = {
      name: safeName,
      phone: safePhone,
      phone2: safePhone2,
      governorate: safeGovernorate,
      address: safeAddress
    };

    // تطبيق Whitelisting وتنظيف صارم مطابق لمتطلبات SonarQube
    setUserData(cleanUserData);

    try {
      localStorage.setItem("userData", JSON.stringify(cleanUserData));
      // نبلّغ الفاتورة إن بيانات الشحن اتغيرت، عشان تحدّث سعر الشحن من غير Refresh
      window.dispatchEvent(new Event("userDataChanged"));
    } catch (error) {
      console.error("فشل الحفظ في Storage:", error);
    }

    setInModify(false);
    setErrors({});

    // العميلة المسجّلة: نحفظ في حسابها كمان. لو فشل، البيانات لسه محفوظة في المتصفح
    if (userId) {
      try {
        const { error } = await supabase.from("shipping_profiles").upsert(
          {
            user_id: userId,
            name: cleanUserData.name,
            phone: cleanUserData.phone,
            phone2: cleanUserData.phone2 || null,
            governorate: cleanUserData.governorate,
            address: cleanUserData.address,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error("خطأ في حفظ بيانات الشحن في الحساب:", error);
          toast.error("اتحفظت على الجهاز بس، تعذر حفظها في حسابك");
        }
      } catch (error) {
        console.error("خطأ غير متوقع في حفظ بيانات الشحن:", error);
        toast.error("اتحفظت على الجهاز بس، تعذر حفظها في حسابك");
      }
    }
  }

  function handleCancel() {
    setUserData(oldData);
    setInModify(false);
    setErrors({});
  }

  // فصل الـ nested ternary عن JSX لحل مشكلة Sonar S3358
  const userDataContent = hasData ? (
    <div className="data-area">
      <h3 className="title-data-user">بيانات الشحن</h3>

      <p className="data">{userData.name}</p>
      <p className="data">{userData.phone}</p>

      {userData.phone2 && (
        <p className="data">{userData.phone2}</p>
      )}

      <p className="data">{userData.governorate}</p>
      <p className="data">{userData.address}</p>

      <div className="btn-add-area">
        <button
          type="button"
          className="btn-amendment"
          onClick={() => {
            setOldData(userData);
            setInModify(true);
          }}
        >
          تعديل
          <FaPen />
        </button>
      </div>
    </div>
  ) : (
    <div className="no-data">
      <p className="no-data-text">لا توجد بيانات</p>

      <button
        type="button"
        className="btn-add-data"
        onClick={() => {
          setOldData(userData);
          setInModify(true);
        }}
      >
        إضافة بيانات
      </button>
    </div>
  );

  return (
    <>
      {!inModify ? (
        userDataContent
      ) : (
        <div className="modify-data">
          <h3 className="title-data-user">بيانات الشحن</h3>

          {errors.name && <p className="error">{errors.name}</p>}

          <input
            className="input-data"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="الاسم ثلاثي"
          />

{numError.phone && <p className="error">{numError.phone}</p>}

{errors.phone && (
  <p className="error">{errors.phone}</p>
)}

<input
  className="input-data"
  name="phone"
  value={userData.phone}
  onChange={handleNumberChange}
  placeholder="رقم الهاتف"
/>

{numError.phone2 && <p className="error">{numError.phone2}</p>}

{errors.phone2 && (
  <p className="error">{errors.phone2}</p>
)}

<input
  className="input-data"
  name="phone2"
  value={userData.phone2}
  onChange={handleNumberChange}
  placeholder="رقم هاتف إضافي (اختياري)"
/>

          {errors.governorate && (
            <p className="error">{errors.governorate}</p>
          )}

          <select
            className="input-data"
            name="governorate"
            value={userData.governorate}
            onChange={handleChange}
          >
            <option value="">اختر المحافظة</option>

            {ALLOWED_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          {errors.address && (
            <p className="error">{errors.address}</p>
          )}

          <input
            className="input-data"
            name="address"
            value={userData.address}
            onChange={handleChange}
            placeholder="العنوان"
          />

          <div className="btns-add-and-handleCancel">
            <button
              type="button"
              className="btn-updat"
              onClick={handleUpdateData}
            >
              حفظ
            </button>

            <button
              type="button"
              className="btn-handleCancel"
              onClick={handleCancel}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </>
  );
}
