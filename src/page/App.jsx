
 import TopHeader from "../components/header/topHeader"
import BtmHeader from "../components/header/btmHeader"
import Home from "./Home"
import PageProduct from "./pageProdact"
import { Route, Routes } from "react-router-dom"
 import Cart from "../page/cart/cart"
import { Toaster } from "react-hot-toast"
import ScrolTop from "../components/ScrolTop"
 import { AnimatePresence } from "framer-motion"
import Pgcategory from "../page/pg-category/pg-category"
 import Pgsearch from "../page/pg-search"
 import Like from "../page/like/like"
 import UserAccount from "../page/account/UserAccount"
 import OrdarDetails from "../page/OrderDetails/Order-details"
 import Payment from "../page/payment/payment"
 import OrderDone from "../page/orderDone/OrderDone"
 import AboutUs from "../page/About-This-Site/AboutUs"
 import Privacypolicy from "../page/About-This-Site/privacy-policy"
import Return from "../page/About-This-Site/Return"
 import SnippingDelivery from "../page/About-This-Site/SnippingDelivery"
import Temsconditions from "../page/About-This-Site/tems-conditions"
import Termsofuse from "../page/About-This-Site/Termsofuse"
 import SearchPage from "../components/SearchPage/SearchPage"
import LoadingBtmhedat from "../components/header/LoadingBtmhedat"

 function App() {
 

    return (
     <>

   
      {/* <header>
      <TopHeader />
      <BtmHeader />
</header> */}


      <Toaster  position="bottom-center" toastOptions={{
        style:{
          background : "#46655",
          color:"#000",
          padding:"5px"
        }}
      }

       /> 
      <ScrolTop />


       <AnimatePresence mode="wait">
      <Routes>


          <Route path="/" element={<Home/>}/>
        <Route path="/order-details" element={<OrdarDetails/>}/>
        <Route path="/like" element={<Like/>}/>
             <Route path="/cart" element={<Cart/>}/>
          <Route path="/payment" element={<Payment/>}/>
            <Route path="/OrderDone" element={<OrderDone/>}/>
         <Route path="/useraccount" element={<UserAccount/>}/>
         
           <Route path="/search" element={<Pgsearch/>}/>
          
           <Route path="/products/:id" element={<PageProduct/>}/>
         <Route path="/category/:category" element={<Pgcategory/>}/>


           <Route path="/AboutUs" element={<AboutUs/>}/>
           <Route path="/Privacypolicy" element={<Privacypolicy/>}/>
          <Route path="/Return" element={<Return/>}/>
           <Route path="/SnippingDelivery" element={<SnippingDelivery/>}/>
           <Route path="/Temsconditions" element={<Temsconditions/>}/>
           <Route path="/Termsofuse" element={<Termsofuse/>}/>
          <Route path="/search-page" element={<SearchPage />} />
           <Route path="/LoadingBtmhedat" element={<LoadingBtmhedat />} />
           
         
         </Routes >
       </AnimatePresence> 
    

     
    </>
   )
 }

export default App;

