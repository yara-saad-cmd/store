
import React, { Suspense, lazy } from "react"
import Home from "./Home"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ScrollToTop from "../components/ScrollToTop"
import { AnimatePresence } from "framer-motion"

// الصفحات دي بتتحمل بس وقت الحاجة ليها، مش من أول زيارة للموقع
const Cart = lazy(() => import("../page/cart/cart"))
const Pgcategory = lazy(() => import("../page/pg-category/pg-category"))
const Pgsearch = lazy(() => import("../page/pg-search"))
const Like = lazy(() => import("../page/like/like"))
const UserAccount = lazy(() => import("../page/account/UserAccount"))
const OrderDetails = lazy(() => import("../page/OrderDetails/Order-details"))
const Payment = lazy(() => import("../page/payment/payment"))
const OrderDone = lazy(() => import("../page/orderDone/OrderDone"))
const AboutUs = lazy(() => import("../page/About-This-Site/AboutUs"))
const Privacypolicy = lazy(() => import("../page/About-This-Site/privacy-policy"))
const Return = lazy(() => import("../page/About-This-Site/Return"))
const ShippingDelivery = lazy(() => import("../page/About-This-Site/ShippingDelivery"))
const Temsconditions = lazy(() => import("./About-This-Site/terms-conditions"))
const Termsofuse = lazy(() => import("../page/About-This-Site/Termsofuse"))
const SearchPage = lazy(() => import("../components/SearchPage/SearchPage"))
const Pgproduct = lazy(() => import("../components/product/Pg-product"))

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
        <Suspense fallback={<div className="route-loading" aria-busy="true"></div>}>
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
        </Suspense>
      </AnimatePresence>


    </>
  )
}

export default App;

