import React from 'react'

import HeaderTwo from '../../components/header/header-2'
import PageTransition from '../../components/PageTransaction'
import Footertwo from '../../components/footer/footer2'

function CreateAccount() {
  return (
    <div className='pg-create-account'>
      <HeaderTwo />
      <PageTransition>

 <div className="container cont-iogin">

            <div className="all-content-pag">

                <h3 className="titel-create-account">
                    انشاء حساب جديد
                </h3>
                  <div className="inputs-arya">

                  <input type="text" className='inp-data name' placeholder='الاسم' />
                  <input type="tel" className='inp-data number' placeholder='(20+) رقمالهاتف '  />
                  <input type="password" className='inp-data password' placeholder='كلمت المرور' />
                  <input type="password" className='inp-data password2' placeholder='تأكيد كلمت المرور' />

                            



                 </div>

                 <button className='put-create-account'>انشاء</button>

                 <p>او</p>
                 <h4>استخدام جوجل</h4>

            </div>
           

        </div>
        <Footertwo/>
      </PageTransition>
       
    </div>
  )
}

export default CreateAccount