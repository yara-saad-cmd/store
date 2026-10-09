import React from "react";
import { Link } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
import { TbShoppingCartPlus } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import ProductLayout from "../body/ProductLayout";
import ProductLoading from "../body/product-loading";

function RelatedProducts({ 
  loadingrelatedProducts, 
  relatedProducts, 
  visibleCount, 
  setVisibleCount, // 👈 استلام الدالة بنجاح
  goods, 
  cartItems, 
  AddToCart 
}) {
  
  // تصفية المصفوفة أولاً لاستبعاد المنتج المفتوح حالياً قبل حساب الطول أو التقطيع
  const filteredProducts = relatedProducts.filter((item) => item.id !== goods.id);

  return (
    <div className="mor-product">
      {loadingrelatedProducts ? (
        <ProductLoading />
      ) : (
        <>
          <ProductLayout title={"مقترحات من نفس الفئة"}>
            {filteredProducts.slice(0, visibleCount).map((item) => {
              const incart = cartItems.some((i) => i.id === item.id);

              const handleAddToCart = () => {
                AddToCart(item);
                toast.success(
                  <div className="msg">
                    <strong>{item.title}</strong>{" "}
                    تمت الإضافة إلى العربة
                  </div>,
                  { duration: 3000 }
                );
              };

              return (
                <div className={`card ${incart ? "incart" : ""}`} key={item.id}>
                  <Link to={`/products/${item.id}`}>
                    <div className="img">
                    <img src={item.images?.[0] || ""} alt={item.title} />
                    </div>

                    <div className="content">
                      <div className="text">
                        <h3>{item.title}</h3>
                      </div>

                      <div className="StarsAndPrice">
                        <div className="stars">
                          <span>{item.rating != null ? Number(item.rating).toFixed(1) : "0.0"}</span>{" "}
                          <IoIosStar />
                        </div>
                        <h5 className="price">
                          <span>EGP </span>
                          {item.price}
                        </h5>
                      </div>
                    </div>
                  </Link>
                  <div className="btm-card">

                  <button
                  type="button"
                  className="cart-icon"
                  onClick={handleAddToCart}
                >
                  <TbShoppingCartPlus />
                </button>
                   

                    <div className="in-cart">
                      {incart && (
                        <span className="in-cart-label">
                          في العربة <FaCheck />{" "}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </ProductLayout>

          {/* 🌟 مكان زر "عرض المزيد" النظيف والصحيح تماماً هنا 🌟 */}
          {visibleCount < filteredProducts.length && (
            <div style={{ textAlign: "center", marginTop: "20px", width: "100%" }}>
              <button className="load-more" onClick={() => setVisibleCount(prev => prev + 12)}>
                ... عرض المزيد 
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RelatedProducts;