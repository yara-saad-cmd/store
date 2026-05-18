// ProductLayout.jsx
import React from 'react'
import "./product.css"

function ProductLayout({ title, children }) {
  return (
    <div className="product">
      <div className="container">
        <div className="textproduct">
          <h3>{title}</h3>
        </div>
        <div className="cards-wrapper">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ProductLayout;