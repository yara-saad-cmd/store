import { useContext, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb"; // تم إضافة الأيقونة
import { Link } from "react-router-dom";
import { ContextCart } from "../context/contextcart";

export default function CartItem({
  item,
  inlike,
  onLike,
  onDelete,
  onIncrease,
  onDecrease,
  onSizeChange,
  onColorChange,
  encart,
  HandleAddToCart,
  removelike, // قادمة من الـ Props
  AddToLike,  // قادمة من الـ Props
  toast,
  layout = "cart",
}) {
  // استخراج القيم من الـ Context مع تغيير اسم الوظائف محلياً لتجنب التصادم مع الـ Props
  const { 
    cartItems = [], 
    AddToCart, 
    AddToLike: AddToLikeCtx, 
    likeItems, 
    removelike: removelikeCtx 
  } = useContext(ContextCart);

  // ====== الاختيار الافتراضي للمقاس واللون ======
  const defaultSize = item.size || item.availableSizes?.[0] || "S";
  const selectedColor = item.color || item.availableColors?.[0] || "Default Color";

  const [color, setcolor] = useState({
    color1: "red",
    color2: "green",
    color3: "pink",
    color4: "white"
  });

  const HandelAddToLike = () => {
    const prodact = item; 
    // نتحقق أولاً إذا كانت الوظيفة قادمة من الـ Props، وإذا لم توجد نستخدم التي في الـ Context
    const finalRemoveLike = removelike || removelikeCtx;
    const finalAddToLike = AddToLike || AddToLikeCtx;

    if (inlike) {
      if (finalRemoveLike) finalRemoveLike(prodact.id);
      toast.error(`تم حذف ${prodact.title} من المفضل `);
    } else {
      if (finalAddToLike) finalAddToLike(prodact);
      toast.success(` تم اضافة ${prodact.title} الي المفضل`);
    }
  };

  return (
    <div className="item-cart" key={item.id}>
      {/* ====== صورة المنتج + الاسم ====== */}
      <div className="img-name">
        {(layout === "cart" || layout === "detalis-ordar") && (
          <Link key={item.id} to={`/products/${item.id}`}>
            <img src={item.images?.[0]} alt={item.title} />
          </Link>
        )}
      </div>

      <div className="Content">
        <div className="prudact-detalis">
          <h3 className="name-prudact">{item.title}</h3>
          
          {layout === "prodact" && (
            <p>{item.description}</p>
          )}

          {layout === "prodact" && (
            <h4>الحاله:<span className="stock">{item.availabilityStatus}</span></h4>
          )}

          {/* ====== اللون ====== */}
          {layout === "prodact" ? (
            <div className="colors-box">
              <h3>اللون : <span>red</span></h3>
              <div className="colors">
                {["gren", "red", "plie"]?.map((color) => (
                  <label key={color} className="color-square-option">
                    <input
                      type="radio"
                      name={`color_${item.id}`}
                      value={color}
                      checked={selectedColor === color}
                      onChange={(e) => onColorChange(item.id, e.target.value)}
                    />
                    <span
                      className="color-square"
                      style={{ backgroundColor: color }}
                    >red</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p className="color-item">اللون: <strong>{selectedColor}</strong></p>
          )}

          {/* ====== المقاس ====== */}
          {layout === "prodact" && (
            <div className="size-options">
              <h3>المقاسات : <span>M</span></h3>
              <div className="sizes">
                {["S", "M", "L", "XL"].map((size) => (
                  <label key={size} className="size-box">
                    <input
                      type="checkbox"
                      checked={item.size ? item.size === size : defaultSize === size}
                      onChange={() => onSizeChange(item.id, size)}
                    />
                    <span className="span-size">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {layout === "cart" && (
            <div className="size">
              <select
                value={item.size || defaultSize}
                onChange={(e) => onSizeChange(item.id, e.target.value)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          )}

          {layout === "detalis-ordar" && (
            <div className="prodact-details">
              <p className="size">
                المقاس: <strong>{item.size || defaultSize}</strong>
              </p>
              <p className="quantity">
                <span className="num">عدد : {item.quantity}</span>
              </p>
            </div>
          )}

          <p className="price"><span>EGP</span>{item.price}</p>

          
        </div>

        <div className="plus-and-mynas">
          {(layout === "prodact" || layout === "cart") && (
            <div className="quantity">
              <button className="minus" onClick={() => onDecrease(item.id)}>-</button>
              <span className="num">{item.quantity}</span>
              <button className="plus" onClick={() => onIncrease(item.id)}>+</button>
            </div>
          )}

          <div className="ptm-and-icon">
            {layout === "prodact" && (
              <div className="con">
                <button className={`ptm ${encart ? "encart" : ""}`} onClick={HandleAddToCart}>
                  <span>{encart ? "تمت الإضافة إلى العربة" : "اضف الي العربه"}</span>
                  <TbShoppingCart />
                </button>

                <div className="icon-hert">
                  <div className={`like ${inlike ? "inlike" : ""}`} onClick={HandelAddToLike}>
                    <FiHeart />
                  </div>
                </div>
              </div>
            )}

            {layout === "cart" && (
              <div className="icons">
                <div className="like" onClick={() => onLike(item)}>
                  {inlike ? <FaHeart color="red" /> : <FaRegHeart />}
                </div>
                <div className="delete" onClick={() => onDelete(item.id)}>
                  <FaRegTrashCan />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}