import React from 'react'

function ProductLoading() {
  return (
    <div className="loading-product" aria-busy="true" aria-live="polite">
      <div className="product-content">
        <div className="container">
          {/* إضافة نص لقارئات الشاشة مع إخفاء عنصر الـ Skeleton عن القارئ */}
          <h1 className="skeleton" aria-hidden="true">
            <span></span>
          </h1>

          <div className="cards">
            <p className="skeleton a" aria-hidden="true"></p>
            <p className="skeleton b" aria-hidden="true"></p>
            <p className="skeleton c" aria-hidden="true"></p>
            <p className="skeleton d" aria-hidden="true"></p>
            <p className="skeleton e" aria-hidden="true"></p>
            <p className="skeleton f" aria-hidden="true"></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductLoading