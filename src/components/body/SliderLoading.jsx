import React from 'react'
import "./SliderLoading.css"
function SliderLoading() {
  return (
    <div className="slider-loading" aria-busy="true">
      <div className="skeleton slider-loading-box" aria-hidden="true"></div>
    </div>
  )
}

export default SliderLoading