import React from 'react'
import "./LoginPages.css"
import HeaderTwo from '../../components/header/header-2'

import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'
import { Link } from 'react-router-dom'
function Login() {
  return (
    <div className="pg-login ">
         <HeaderTwo />
<PageTransition>
  <div className="container cont-iogin">
        <div className="login-arya">

          <h3 className="titel-pg-login">تسجيل الدخول</h3>

          <div className="inputs">
           
            <input type="gamil" className="gmail inp-data" placeholder='البريد الاكتروني'></input>


           
            <input type="password" className="pssword inp-data" placeholder='كلمة المرور'></input>
                 <p>نسيت كلمت المرور؟</p>
          </div>
          
           <button className='log-in-puttom'>تسجيل</button>

           <Link to="/CreateAccount" >
           <p className='create-account-puttom'>انشاء حساب جديد</p>
           
           </Link>
           

            <h3>او</h3>
            <h3>التسجيل بحساب جوجل</h3>
        </div>


      </div>



<Footertwo/>
</PageTransition>
    
    </div>
  )
}

export default Login