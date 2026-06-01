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
  prodact, 
  cartItems, 
  AddToCart 
}) {
  return (
    <div className="mor-product">
      {loadingrelatedProducts ? (
        <ProductLoading />
      ) : (
        <ProductLayout title={"مقترحات من نفس الفئة"}>
          {relatedProducts
            .slice(0, visibleCount)
            .filter((item) => item.id !== prodact.id)
            .map((item) => {
              const incart = cartItems.some((i) => i.id === item.id);

              const handleAddToCart = () => {
                AddToCart(item);
                toast.success(
                  <div className="msg">
                    <strong>{item.title}</strong>
                    تمت الإضافة إلى العربة
                  </div>,
                  { duration: 3000 }
                );
              };

              return (
                <div
                  className={`card ${incart ? "incart" : ""}`}
                  key={item.id}
                >
                  <Link key={item.id} to={`/products/${item.id}`}>
                    <div className="img">
                      <img src={item.images[0]} alt={item.title} />
                    </div>

                    <div className="content">
                      <div className="text">
                        <h3>{item.title}</h3>
                      </div>

                      <div className="StarsAndPrice">
                        <div className="stars">
                          <span>{item.rating.toFixed(1)}</span>{" "}
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
                    <div className="cart-icon" onClick={handleAddToCart}>
                      <TbShoppingCartPlus />
                    </div>

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
      )}
    </div>
  );
}

export default RelatedProducts;