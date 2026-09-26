
//import TopHeader from "../components/header/topHeader"
//import BtmHeader from "../components/header/btmHeader"
import Home from "./Home"
import { Route, Routes } from "react-router-dom"
import Cart from "../page/cart/cart"
import { Toaster } from "react-hot-toast"
import ScrollToTop from "../components/ScrollToTop"
import { AnimatePresence } from "framer-motion"
import Pgcategory from "../page/pg-category/pg-category"
import Pgsearch from "../page/pg-search"
import Like from "../page/like/like"
import UserAccount from "../page/account/UserAccount"
import OrderDetails from "../page/OrderDetails/Order-details"
import Payment from "../page/payment/payment"
import OrderDone from "../page/orderDone/OrderDone"
import AboutUs from "../page/About-This-Site/AboutUs"
import Privacypolicy from "../page/About-This-Site/privacy-policy"
import Return from "../page/About-This-Site/Return"
import ShippingDelivery from "../page/About-This-Site/ShippingDelivery"
import Temsconditions from "./About-This-Site/terms-conditions"
import Termsofuse from "../page/About-This-Site/Termsofuse"
import SearchPage from "../components/SearchPage/SearchPage"
import LoadingBtmHeader from "../components/header/LoadingBtmhader"
import Pgproduct from "../components/product/Pg-product"

function App() {


  return (
    <>


      {/* <header>
      <TopHeader />
      <BtmHeader />
</header> */}


      <Toaster position="bottom-center" toastOptions={{
        style: {
          color: "#000",
          padding: "5px"                                                                                                                                                                                                                                        
        }
      }
      }

      />
      <ScrollToTop />


      <AnimatePresence mode="wait">
        <Routes>


          <Route path="/" element={<Home />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/like" element={<Like />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-done" element={<OrderDone />} />
          <Route path="/user-account" element={<UserAccount />} />

          <Route path="/search" element={<Pgsearch />} />

          <Route path="/products/:id" element={<Pgproduct />} />
          <Route path="/category/:category" element={<Pgcategory />} />


          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Privacypolicy" element={<Privacypolicy />} />
          <Route path="/Return" element={<Return />} />
          <Route path="/ShippingDelivery" element={<ShippingDelivery />} />
          <Route path="/Temsconditions" element={<Temsconditions />} />
          <Route path="/Termsofuse" element={<Termsofuse />} />
          <Route path="/search-page" element={<SearchPage />} />

            {/* لازم تفضل دايماً آخر Route في الليستة */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2>404 - الصفحة غير موجودة</h2>
              </div>
            } />

            </Routes >
      </AnimatePresence>



    </>
  )
}

export default App;

