
import React, { useEffect, useState } from "react";
import "./userdata.css";
import { FaPen } from "react-icons/fa";

// قائمة المحافظات المسموح بها لتطبيق مفهوم Whitelisting
const ALLOWED_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية",
  "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية",
  "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "المنيا", "أسيوط",
  "سوهاج", "قنا", "أسوان", "الأقصر", "البحر الأحمر", "الوادي الجديد",
  "مطروح", "شمال سيناء", "جنوب سيناء"
];

// دالة تنظيف النص التجريبي وإزالة الرموز الخاصة كحماية ضد XSS/Injection
const sanitizeText = (input, maxLength = 100) => {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>/'"&]/g, "")
    .trim()
    .slice(0, maxLength);
};

// دالة تطهير أرقام الهواتف
const sanitizePhone = (input) => {
  if (typeof input !== "string" && typeof input !== "number") return "";

  return String(input).replace(/\D/g, "").slice(0, 11);
};

export default function UserData() {
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
    } else if (userData.phone.trim().length !== 11) {
      err.phone = "رقم الهاتف يجب أن يكون 11 رقم";
    }

    if (
      userData.phone2 &&
      userData.phone2.trim().length > 0 &&
      userData.phone2.trim().length !== 11
    ) {
      err.phone2 = "رقم الهاتف الثاني يجب أن يكون 11 رقم";
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

  function handleUpdateData() {
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
    } catch (error) {
      console.error("فشل الحفظ في Storage:", error);
    }

    setInModify(false);
    setErrors({});
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
