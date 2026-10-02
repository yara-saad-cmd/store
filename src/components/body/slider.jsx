import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "./slider.css"
import 'swiper/css/pagination';
import { Autoplay,Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import slayd1 from '../../img/slayd1.jpg';
import slayd2 from '../../img/slayd2.jpg';
import slayd3 from '../../img/slayd3 (1).jpg';

function Slider() {
  return (

<div className="slider">
    


      
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


      <div className="Content">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='btn'>تسوق الآن</Link>
      </div>
      <img src={slayd1} alt='slide'/>

    </SwiperSlide>

    <SwiperSlide>


      <div className="Content">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='btn'>تسوق الآن</Link>
      </div>
      <img src={slayd2} alt='slide' loading="lazy" />


    </SwiperSlide>

    <SwiperSlide>


      <div className="Content">

      <h4>عروض و خصمات</h4>
      <p>عروض او خصمات او ترويج مننتج معين</p>
      <Link to="/" className='btn'>تسوق الآن</Link>
      </div>
      <img src={slayd3} alt='slide' loading="lazy" />

    </SwiperSlide>

  </Swiper>

    



</div>
    
   
  )
}

export default Slider