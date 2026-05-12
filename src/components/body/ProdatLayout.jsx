// ProductLayout.jsx
import React from 'react'
import "./prodact.css"

function ProductLayout({ title, children }) {
  return (
    <div className="product">
      <div className="continar">
        <div className="txet-product">
          <h3>{title}</h3>
        </div>
        <div className="cards-wrapper">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ProductLayout