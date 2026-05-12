import React from 'react'

//import React, { useRef, useState } from 'react';
// Import Swiper React componants
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "./slider.css"
import 'swiper/css/pagination';
import { Autoplay,Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

function Slider() {
  return (

<div className="slidr">
    


      
  <Swiper 
  loop={true}
  autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
  pagination={{clickable:true}}
  modules={[Autoplay,Pagination]}
   className="mySwiper">

    <SwiperSlide >


      <div className="contnt">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='ptmm'>تسوق الان</Link>
      </div>
      <img src='/src/img/slayd1.jpg' alt='img non'/>

    </SwiperSlide>

    <SwiperSlide>


      <div className="contnt">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='ptmm'>تسوق الان</Link>
      </div>
      <img src='/src/img/slayd2.jpg' alt='img non'/>


    </SwiperSlide>

    <SwiperSlide>


      <div className="contnt">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='ptmm'>تسوق الان</Link>
      </div>
     <img src='/src/img/slayd3.jpg' alt='img non'/>

    </SwiperSlide>

  </Swiper>

    



</div>
    
   
  )
}

export default Slider