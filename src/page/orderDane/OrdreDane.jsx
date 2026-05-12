import React from 'react'
import "./orderDane.css"
import { Link } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai'
import HedarTwo from '../../components/heder/heder-2'
import PadgTranschan from '../../components/padgTranschan'
import Footer from '../../components/footer/footer'



function OrdreDane() {
  return (
    <>
    <div className='pg-orderdane'>
        <HedarTwo/>
        <PadgTranschan>

           <div className="icon-and-content">
            <div className="icon">
            <AiFillCheckCircle />
            </div>

            <h4>تم الطلب</h4>

            <Link to="/">
            <button>الذهاب للصفحه الرسية</button>
            </Link>
            
        </div>
      
        </PadgTranschan>
       
        
    </div>
      <Footer/>
    </>
    
  )
}

export default OrdreDane