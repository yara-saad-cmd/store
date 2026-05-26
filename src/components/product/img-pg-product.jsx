// import React, { useState, useEffect } from 'react' // 1. أضف useEffect

// function ImgPgProdact({ prodact }) {
//   const [activeImg, setActiveImg] = useState(prodact.images[0]);

//   // 2. مراقبة تغير المنتج
//   useEffect(() => {
//     // عندما يتغير الـ prodact، اجعل الصورة النشطة هي أول صورة للمنتج الجديد
//     setActiveImg(prodact.images[0]);
//   }, [prodact]); // هذه المصفوفة تعني: "نفذ هذا الكود كلما تغير كائن prodact"

//   return (
//     <div className="imegs">
//       <div className="small-images">
//         {prodact.images.map((img, index) => (
//           <img
//             key={index}
//             src={img}
//             className={img === activeImg ? "active-thumb" : ""}
//             onClick={() => setActiveImg(img)}
//             alt={prodact.title}
//           />
//         ))}
//       </div>

//       <div className="big-image">
//         <img src={activeImg} alt={prodact.title} />
//       </div>
//     </div>
//   )
// }

// export default ImgPgProdact;



// حوات u الي   a   في product



import React, { useState, useEffect } from 'react'

function ImgPgProdact({ prodact }) {
  // 1. نجعل الحالة الابتدائية فارغة تماماً
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    // 2. بمجرد تغير المنتج، نمسح الصورة النشطة القديمة أولاً
    setActiveImg(null);

    // 3. نضع الصورة الجديدة بعد "تأخير" بسيط جداً لضمان المسح
    const timeout = setTimeout(() => {
      if (prodact && prodact.images) {
        setActiveImg(prodact.images[0]);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [prodact]);

  // 4. إذا كانت الصورة النشطة لا تنتمي للمنتج الحالي، لا تعرض شيئاً (اترك المكان فارغاً)
  if (!activeImg || !prodact.images.includes(activeImg)) {
    return <div className="imegs" style={{ minHeight: '500px' }}></div>;
  }

  return (
    <div className="imegs">
      <div className="small-images">
        {prodact.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={prodact.title}
            className={img === activeImg ? "active-thumb" : ""}
            onClick={() => setActiveImg(img)}
          />
        ))}
      </div>

      <div className="big-image">
        <img key={activeImg} src={activeImg} alt={prodact.title} />
      </div>
    </div>
  )
}

export default ImgPgProdact;