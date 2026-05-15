// import { useState, useEffect } from "react";

// export default function UserDataForm() {
//   const [isEditing, setIsEditing] = useState(false);

//   const [userData, setUserData] = useState({
//     name: "",
//     phone2: "",
//     phone: "",
//     address: "",
//   });

//   // تحميل البيانات من localStorage عند فتح الصفحة
//   useEffect(() => {
//     const saved = localStorage.getItem("userData");
//     if (saved) {
//       setUserData(JSON.parse(saved));
//     }
//   }, []);

//   // هل يوجد بيانات؟
//   const hasData = userData.name || userData.phone2 || userData.phone || userData.address;

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     localStorage.setItem("userData", JSON.stringify(userData));
//     setIsEditing(false);
//   };

//   return (
//     <div className="user-data-box">
//       {!isEditing ? (
//         hasData ? (
//           <div>
//             <p><strong>الاسم:</strong> {userData.name}</p>
//             <p><strong>الإيميل:</strong> {userData.phone2}</p>
//             <p><strong>الهاتف:</strong> {userData.phone}</p>
//             <p><strong>العنوان:</strong> {userData.address}</p>

//             <button onClick={() => setIsEditing(true)}>
//               تعديل البيانات
//             </button>
//           </div>
//         ) : (
//           <div>
//             <p>لم تقم بإضافة بياناتك بعد.</p>
//             <button onClick={() => setIsEditing(true)}>
//               إضافة البيانات
//             </button>
//           </div>
//         )
//       ) : (
//         <div className="edit-form">
//           <label>الاسم</label>
//           <input
//             name="name"
//             value={userData.name}
//             onChange={handleChange}
//           />

//           <label>الإيميل</label>
//           <input
//             name="phone2"
//             value={userData.phone2}
//             onChange={handleChange}
//           />

//           <label>الهاتف</label>
//           <input
//             name="phone"
//             value={userData.phone}
//             onChange={handleChange}
//           />

//           <label>العنوان</label>
//           <input
//             name="address"
//             value={userData.address}
//             onChange={handleChange}
//           />

//           <button onClick={handleSave}>حفظ</button>
//           <button onClick={() => setIsEditing(false)}>إلغاء</button>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import "./userdata.css"
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
    const saved = localStorage.getItem("userData");
    if (saved) setUserData(JSON.parse(saved));
  }, []);

  const hasData =
    userData.name ||
    userData.phone ||
    userData.phone2 ||
    userData.governorate ||
    userData.address;

  
  function handleNumberChange(e) {
    const value = e.target.value;

    if (!/^[0-9]*$/.test(value)) {
      setNumError("مسموح بالأرقام فقط");
      return;
    }

    setNumError("");
    setUserData({ ...userData, [e.target.name]: value });
  }

  
  function handleChange(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  
  function validateOnSave() {
    const err = {};

    if (!userData.name.trim())
      err.name = "الاسم مطلوب";

    if (!userData.phone.trim())
      err.phone = "رقم الهاتف مطلوب";
    else if (userData.phone.length !== 11)
      err.phone = "رقم الهاتف يجب أن يكون 11 رقم";

    if (userData.phone2 && userData.phone2.length !== 11)
      err.phone2 = "رقم الهاتف الثاني يجب أن يكون 11 رقم";

    if (!userData.governorate.trim())
      err.governorate = "المحافظة مطلوبة";

    if (!userData.address.trim())
      err.address = "العنوان مطلوب";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  
  function UpdateData() {
    if (!validateOnSave()) return;

    localStorage.setItem("userData", JSON.stringify(userData));
    setInModify(false);
    setErrors({});
  }

  function cancel() {
    setUserData(oldData);
    setInModify(false);
    setErrors({});
  }

  return (
    <>
      {!inModify ? (
        hasData ? (
          <div className="data-arya">
            <h3 className="titel-data-user">بيانات الشحن</h3>

            <p className="data">{userData.name}</p>
            <p className="data">{userData.phone}</p>
            <p className="data">{userData.phone2}</p>
            <p className="data">{userData.governorate}</p>
            <p className="data">{userData.address}</p>
            <div className="ptm-add-arya">
               <button
            className="ptm-amendment"
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
            className="ptm-add-data"
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
          <h3 className="titel-data-user">بيانات الشحن</h3>

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
       
          <div className="ptums-add-and-cancel">

          <button className="ptm-updat"  onClick={UpdateData}>حفظ</button>
          <button className="ptm-cancel" onClick={cancel}>إلغاء</button>

          </div>
         
        </div>
      )}
    </>
  );
}
