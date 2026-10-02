    import React from 'react'
    import "./footer.css"
    import { Link } from 'react-router-dom'
    import logo from "../../img/logo (1).png"
    import { AiFillInstagram } from 'react-icons/ai'
    import { FaTelegramPlane } from 'react-icons/fa'
    import { IoLogoWhatsapp } from 'react-icons/io5'
    import { FaTiktok } from 'react-icons/fa6'
    function Footertwo() {
    return (
        <div className='footerTwo'>
            <div className="container">
                <div className="logo-and-icon"> 

                
                <div className="logo">
                    <img src={logo} alt='logo'/>
                </div>

                <div className="icon">
                <AiFillInstagram />
                <FaTelegramPlane />
                <IoLogoWhatsapp />
                <FaTiktok />
                </div>

            
                </div>
                <div className="all-links">

                     <div className="legal">

                     <h4 className='title'>القوانين</h4>

                    <div className="links">
                        <Link to="/Privacypolicy">سياست الخصوصيه</Link>
                        <Link to="/Temsconditions">الشروط و الاحكام</Link>
                        <Link to="/Termsofuse">سياسة الاستخدام</Link>
                       
                    </div>

                </div>

                <div className="shipping-and-orders">

                    <h4 className='title'>الشحن و الطلبات</h4>

                    <div className="links">
                    
                        <Link to="/ShippingDelivery">سياسة الشحن و التوصيل</Link>
                        <Link to="/Return">سياست الاسترجاع و الاستبدال</Link>

                    </div>
                    
                </div>

                <div className="more-Links">

                    <h4 className='title'>اخر</h4>

                    <div className="links">
                    
                        <Link to="/AboutUs">من نحن</Link>
                        <Link to="/AboutUs">تواصل معنا</Link>

                    </div>

                </div>
                   
                </div>
               
              

            </div>
        
        </div>
    )
    }

    export default Footertwo