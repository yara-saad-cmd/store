import React, { useContext } from 'react'
import { FaShare } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { ContxetCart } from '../context/contextcart'
import { TbShoppingCart } from 'react-icons/tb'
import toast from 'react-hot-toast'
import CartItem from '../cartItem/CartTtem'

function TitekPpgPprodact({prodact}) {

  const { cartitems = [], AddToCart ,AddToLike ,liketitems ,removelike} = useContext(ContxetCart)

  const Handladdtocart = () => {

  
    AddToCart(prodact)
    toast.success(
      <div className="masg">
      <strong>{prodact.title}</strong>

      تم الاضافه الي العربه  

      </div>
      ,{duration : 3000}
    )
  }

 

  const encart = cartitems.some(i => i.id === prodact.id)
  const inlike = liketitems.some(i => i.id === prodact.id)


  const HandelAddToLike = ()=>{
    if(inlike){
      removelike(prodact.id)
      toast.error(`تم حذف${prodact.title}من المفضل `)
    }else{
      AddToLike(prodact)
      toast.success(`  تم اضافة${prodact.title}الي المفضل`)
    }
   
  }
  const {
    onColorChange,
    onSizeChange,
  } = useContext(ContxetCart);

 
  

  return (
    <div className="titel-ietme">


                  <CartItem
                   key={prodact.id}
                   item={prodact}
                   inlike={inlike}
                   encart={encart} // مرر حالة الوجود في العربة
                   Handladdtocart={Handladdtocart} // مرر دالة الإضافة هنا ✅
                   onLike={HandelAddToLike}
                   onSizeChange={onSizeChange}
                   onColorChange={onColorChange}
                   toast={toast} // تأكد من تمرير الـ toast أيضاً
                   layout="prodact"
                  />

                   
            {/* <h2>{prodact.title}</h2>
            <p>{prodact.description}</p>
            
            <div className="stars">
                <p>5.2</p>
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
            </div>

            <div className="prica">
                 <h4><span>EGP</span>{prodact.price}</h4>
            </div>
           
            <h4><span className='stock'>{prodact.availabilityStatus}</span>:الحاله</h4>

            <div className="colors">
                <h3>اللون : <span>احمر</span></h3>

                <label>
                <input type="radio" name="color" value="red" />
                <span className="circle" style={{ background: "red" }}></span>
                </label>

                <label>
                <input type="radio" name="color" value="blue" />
                <span className="circle" style={{ background: "blue" }}></span>
                </label>

                <label>
                <input type="radio" name="color" value="green" />
                <span className="circle" style={{ background: "green" }}></span>
                </label>

                <label>
                <input type="radio" name="color" value="black" />
                <span className="circle" style={{ background: "black" }}></span>
                </label>
            </div>

            
            <div className="size">
                <h3>المقاس : <span>20</span></h3>

                <label>
                <input type="radio" name="size" value="20" />
                <span className="circle size-box">20</span>
                </label>

                <label>
                <input type="radio" name="size" value="25" />
                <span className="circle size-box">25</span>
                </label>

                <label>
                <input type="radio" name="size" value="30" />
                <span className="circle size-box">30</span>
                </label>

                <label>
                <input type="radio" name="size" value="35" />
                <span className="circle size-box">35</span>
                </label>
           </div> */}
            
           {/* <div className='ptm-and-icon'>

                
                
                <button className= {`ptm ${encart ? "encart" : ""}`} onClick={Handladdtocart}> <span>{ encart ? "تم الاضافه الي العربه":"اضف الي العربه"}</span> <TbShoppingCart  /></button>
                
                <div className="icon-hert">
                  <div className={`like ${inlike ? "inlike" : ""}`} onClick={HandelAddToLike}>
                     <FiHeart/>
                  </div> */}

                  {/* share */}
                  

                    {/* <div className="share">
                       <FaShare />
                    </div> */}

                    
                   {/* share */}
                    {/* </div>
              */}
           {/* </div>
            */}
          
           

            </div>
  )
}

export default TitekPpgPprodact;