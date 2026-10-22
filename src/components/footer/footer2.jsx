import React from 'react'
import "./footer.css"
import { Link } from 'react-router-dom'
import logo from "../../img/logo (1).png"
import { AiFillInstagram } from 'react-icons/ai'
import { FaTelegramPlane } from 'react-icons/fa'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { FaTiktok } from 'react-icons/fa6'
import { siteInfo } from '../../components/siteInfo'

const whatsappLink = siteInfo.whatsappNumber
  ? `https://wa.me/${siteInfo.whatsappNumber}`
  : ""

// الأيقونة بتظهر بس لو رابطها مكتوب في siteInfo
const socialLinks = [
  { name: "Instagram", url: siteInfo.social.instagram, Icon: AiFillInstagram },
  { name: "Telegram", url: siteInfo.social.telegram, Icon: FaTelegramPlane },
  { name: "WhatsApp", url: whatsappLink, Icon: IoLogoWhatsapp },
  { name: "TikTok", url: siteInfo.social.tiktok, Icon: FaTiktok },
].filter((item) => item.url)

function Footertwo() {
  return (
    <div className='footerTwo'>
      <div className="container">
        <div className="logo-and-icon">
          <div className="logo">
            <img src={logo} alt='logo' />
          </div>

          <div className="icon">
            {socialLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
              >
                <Icon />
              </a>
            ))}
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
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  تواصل معنا
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footertwo