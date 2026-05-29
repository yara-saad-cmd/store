import React from 'react'
import TopHeader from '../../components/header/topHeader'
import BtmHeader from '../../components/header/btmHeader'
import "./UserAccount.css"
import PageTransaction from "../../components/pageTransaction"
import { FiHeart } from 'react-icons/fi'
import { TbShoppingCart } from 'react-icons/tb'
import { LuUserRound } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { FaUserCircle, FaWhatsapp } from 'react-icons/fa'
import UserDataForm from '../../components/userdata/UserData'
import Visa from "../../components/visa/visa"
import Footertwo from '../../components/footer/footer2'
function UserAccount() {
  return (
    <div className='all-pg-account'>
        <TopHeader/>
        <BtmHeader/>
       <PageTransaction>

          <div className="pg-account">
            <div className="container">

                      <div className="LogOut">
                        <button className='btn-logout'>تسجيل الخروج</button>
                      </div>   

                <div className="pg-body">

                    <div className="pagse">
                      
                      <div className="user-name">
                    
                     
                      <h3> <FaUserCircle /> user name</h3>
                      </div>

                      <div className="mor-pedges">

                      <Link to="/user-account" className='pg-user'> <LuUserRound /> <span>الملف الشخصي</span></Link>
                      <Link to="/like" className='pg-favorite'>  <FiHeart /><span>قائمة المفضل</span></Link>
                      <Link to="/cart" className='pg-cart-icon'>  <TbShoppingCart /><span>سلة المشتريات</span></Link>
                      <p className='msge'><FaWhatsapp/><span>الرسائل</span></p>

                      </div>
                     
                    </div>


                    <div className="data-user-and-orders">

                      <div className="usar-data">
                        
                       <div className="data">
                       

                        <UserDataForm />

                       </div>
                      </div>

                      <div className="cash-visa">
                        
                        <Visa/>

                      </div>

                    </div>
                  


                </div>

            </div>
        </div>
        <Footertwo/>
       </PageTransaction>
      

    </div>
  )
}

export default UserAccount