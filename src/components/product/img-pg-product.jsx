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
import React, { useState, useEffect, useRef } from 'react'
import "./img-pg-product.css"

function ImgPgProdact({ prodact }) {
  const [activeImg, setActiveImg] = useState(null);
  const containerRef = useRef(null);
  
  // حفظ بيانات السحب بالكامل
  const dragStart = useRef({ isDown: false, startY: 0, startX: 0, scrollTop: 0, scrollLeft: 0, moved: false });

  const allImages = prodact && prodact.images && prodact.images.length > 0 ? prodact.images : [];

  useEffect(() => {
    setActiveImg(null);
    const timeout = setTimeout(() => {
      if (allImages.length > 0) {
        setActiveImg(allImages[0]);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [prodact]);

  // دالة السنتر الدقيقة جداً بالملّي
  const centerImage = (imgElement) => {
    const container = containerRef.current;
    if (!container || !imgElement) return;

    const isMobile = window.innerWidth <= 966;
    const containerRect = container.getBoundingClientRect();
    const imgRect = imgElement.getBoundingClientRect();

    if (isMobile) {
      const currentScrollLeft = container.scrollLeft;
      const relativeLeft = imgRect.left - containerRect.left;
      const targetLeft = currentScrollLeft + relativeLeft - (containerRect.width / 2) + (imgRect.width / 2);
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      const currentScrollTop = container.scrollTop;
      const relativeTop = imgRect.top - containerRect.top;
      const targetTop = currentScrollTop + relativeTop - (containerRect.height / 2) + (imgRect.height / 2);
      container.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    if (!container) return;

    dragStart.current = {
      isDown: true,
      startY: e.pageY - container.offsetTop,
      startX: e.pageX - container.offsetLeft,
      scrollTop: container.scrollTop,
      scrollLeft: container.scrollLeft,
      moved: false
    };
  };

  const handleMouseMove = (e) => {
    if (!dragStart.current.isDown) return;
    
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 966;

    if (isMobile) {
      const x = e.pageX - container.offsetLeft;
      const walkX = (x - dragStart.current.startX) * 1.5;
      if (Math.abs(walkX) > 4) {
        dragStart.current.moved = true; 
        container.classList.add('dragging'); // إضافة الكلاس لمنع الـ Hover
        container.scrollLeft = dragStart.current.scrollLeft - walkX;
      }
    } else {
      const y = e.pageY - container.offsetTop;
      const walkY = (y - dragStart.current.startY) * 1.5;
      if (Math.abs(walkY) > 4) {
        dragStart.current.moved = true; 
        container.classList.add('dragging'); // إضافة الكلاس لمنع الـ Hover
        container.scrollTop = dragStart.current.scrollTop - walkY;
      }
    }
  };

  const handleMouseUpOrLeave = (e, img) => {
    if (!dragStart.current.isDown) return;

    const container = containerRef.current;
    if (container) {
      container.classList.remove('dragging'); // إزالة كلاس السحب فوراً
    }

    // كليك حقيقي (المستخدم لم يقم بالسحب)
    if (!dragStart.current.moved && img) {
      setActiveImg(img);
      centerImage(e.currentTarget);
    }

    dragStart.current.isDown = false;
  };

  if (!activeImg) {
    return <div className="imegs" style={{ minHeight: '500px' }}></div>;
  }

  return (
    <div className="imegs">
      <div 
        className="small-images"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={(e) => handleMouseUpOrLeave(e, null)}
      >
        <button
          type="button"
          className={img === activeImg ? "active-thumb" : ""}
          onMouseUp={(e) => handleMouseUpOrLeave(e, img)}
        >
          <img
            key={img}
            src={img}
            alt={prodact.title}
            draggable="false"
          />
        </button>
      </div>

      <div className="big-image">
        <img key={activeImg} src={activeImg} alt={prodact.title} />
      </div>
    </div>
  )
}

export default ImgPgProdact;