import React, { useEffect, useState } from "react";
import "./userdata.css";
import { FaPen } from "react-icons/fa";

export default function UserData() {
  const [inModify, setInModify] = useState(false);
  const [errors, setErrors] = useState({});
  const [numError, setNumError] = useState("");

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

        if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
          setUserData(parsedData);
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

    if (!/^[0-9]*$/.test(value)) {
      setNumError("مسموح بالأرقام فقط");
      return;
    }

    setNumError("");

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

    if (!userData.name || !userData.name.trim()) err.name = "الاسم مطلوب";

    if (!userData.phone || !userData.phone.trim())
      err.phone = "رقم الهاتف مطلوب";
    else if (userData.phone.trim().length !== 11)
      err.phone = "رقم الهاتف يجب أن يكون 11 رقم";

    if (userData.phone2 && userData.phone2.trim().length > 0 && userData.phone2.trim().length !== 11)
      err.phone2 = "رقم الهاتف الثاني يجب أن يكون 11 رقم";

    if (!userData.governorate || !userData.governorate.trim())
      err.governorate = "المحافظة مطلوبة";

    if (!userData.address || !userData.address.trim())
      err.address = "العنوان مطلوب";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleUpdateData() {
    if (!validateOnSave()) return;

    // تطهير صريح وتنظيف كامل لكل الحقول النصية قبل الحفظ
    const cleanUserData = {
      name: (userData.name || "").trim(),
      phone: (userData.phone || "").trim(),
      phone2: (userData.phone2 || "").trim(),
      governorate: (userData.governorate || "").trim(),
      address: (userData.address || "").trim()
    };

    setUserData(cleanUserData);

    try {
      localStorage.setItem("userData", JSON.stringify(cleanUserData));
    } catch (error) {
      // Handle storage quota or write errors safely
    }

    setInModify(false);
    setErrors({});
  }

  function handleCancel() {
    setUserData(oldData);
    setInModify(false);
    setErrors({});
  }

  return (
    <>
      {!inModify ? (
        hasData ? (
          <div className="data-area">
            <h3 className="title-data-user">بيانات الشحن</h3>

            <p className="data">{userData.name}</p>
            <p className="data">{userData.phone}</p>
            <p className="data">{userData.phone2}</p>
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
        )
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

          {numError && <p className="error">{numError}</p>}
          {errors.phone && <p className="error">{errors.phone}</p>}
          <input
            className="input-data"
            name="phone"
            value={userData.phone}
            onChange={handleNumberChange}
            placeholder="رقم الهاتف"
          />

          {errors.phone2 && <p className="error">{errors.phone2}</p>}
          <input
            className="input-data"
            name="phone2"
            value={userData.phone2}
            onChange={handleNumberChange}
            placeholder="رقم هاتف إضافي (اختياري)"
          />

          {errors.governorate && <p className="error">{errors.governorate}</p>}
          <input
            className="input-data"
            name="governorate"
            value={userData.governorate}
            onChange={handleChange}
            placeholder="المحافظة"
          />

          {errors.address && <p className="error">{errors.address}</p>}
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