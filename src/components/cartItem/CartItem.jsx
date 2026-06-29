import { useContext, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { TbShoppingCart } from "react-icons/tb";
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
  removelike, 
  AddToLike,  
  toast,
  layout = "cart",
}) {
  const { 
    AddToLike: AddToLikeCtx, 
    removelike: removelikeCtx 
  } = useContext(ContextCart);

  // ====== الـ State المحلية لمزامنة الاختيار الفوري ======
  const [localColor, setLocalColor] = useState(item.color || "");
  const [localSize, setLocalSize] = useState(item.size || "");

  // الـ Fallbacks الافتراضية
  const defaultSize = localSize || item.availableSizes?.[0] || "";
  const selectedColor = localColor || item.availableColors?.[0] || "";

  const hasColors = item.colors && item.colors.length > 0;
  const hasSizes = item.sizes && item.sizes.length > 0;

  const handleColorClick = (color) => {
    setLocalColor(color);
    if (onColorChange) onColorChange(item.id, color);
  };

  const handleSizeClick = (size) => {
    setLocalSize(size);
    if (onSizeChange) onSizeChange(item.id, size);
  };

  const handleAddToLike = () => {
    const product = item; 
    const finalRemoveLike = removelike || removelikeCtx;
    const finalAddToLike = AddToLike || AddToLikeCtx;

    if (inlike) {
      if (finalRemoveLike) finalRemoveLike(product.id);
      toast.error(`تم حذف ${product.title} من المفضل `);
    } else {
      if (finalAddToLike) finalAddToLike(product);
      toast.success(` تم اضافة ${product.title} الي المفضل`);
    }
  };

  return (
    <div className="item-cart" key={item.id}>
      {/* ====== صورة المنتج ====== */}
      <div className="img-name">
        <Link to={`/products/${item.id}`}>
          {/* كود الصورة يدار من الملف الخارجي لديكِ */}
        </Link>
      </div>

      <div className="Content">
        <div className="prudact-details">
          <h3 className="name-prudact">{item.title}</h3>
          
          {layout === "prodact" && item.description && <p>{item.description}</p>}
          {layout === "prodact" && item.availability && (
            <h4>الحاله:<span className="stock">{item.availability}</span></h4>
          )}

          {/* ====== قسم الألوان ====== */}
          {layout === "prodact" && hasColors && (
            <div className="colors-box">
              <h3>اللون : <span>{selectedColor || "اختر لوناً"}</span></h3>
              <div className="colors">
                {item.colors.map((color) => {
                  const isColorActive = selectedColor === color;
                  return (
                    <label 
                      key={color} 
                      className={`color-square-option ${isColorActive ? "active" : ""}`}
                      onClick={() => handleColorClick(color)}
                    >
                      <span className="color-square" >
                        {color}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {(layout === "cart" || layout === "details-ordar") && hasColors && selectedColor && (
            <p className="color-item">اللون: <strong>{selectedColor}</strong></p>
          )}

          {/* ====== قسم المقاسات لصفحة المنتج ====== */}
          {layout === "prodact" && hasSizes && (
            <div className="size-options">
              <h3>المقاس : <span>{defaultSize || "اختر مقاساً"}</span></h3>
              <div className="sizes">
                {item.sizes.map((size) => {
                  const isSizeActive = defaultSize === size;
                  return (
                    <label 
                      key={size} 
                      className={`size-box ${isSizeActive ? "active" : ""}`}
                      onClick={() => handleSizeClick(size)}
                    >
                      <span className="span-size">{size}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====== قسم المقاسات داخل العربة (تم التعديل ليقرأ من الباك إند) ====== */}
          {layout === "cart" && hasSizes && (
            <div className="size">
              <select
                value={defaultSize}
                onChange={(e) => handleSizeClick(e.target.value)}
              >
                {/* هنا نقوم بعمل الخيارات بناءً على مصفوفة المقاسات القادمة من السيرفر حظراً */}
                {item.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* تفاصيل الطلب */}
          {layout === "details-ordar" && (
            <div className="size-and-num">
              {hasSizes && (
                <p className="size">
                  المقاس: <strong>{defaultSize}</strong>
                </p>
              )}
              <p className="quantity">
                <span className="num">عدد : {item.quantity}</span>
              </p>
            </div>
          )}

          <p className="price"><span>EGP</span>{item.price}</p>
        </div>

        {/* ====== أزرار التحكم والعدد ====== */}
        <div className="plus-and-mynas">
          {(layout === "prodact" || layout === "cart") && (
            <div className="quantity">
              <button className="minus" onClick={() => onDecrease(item.id)}>-</button>
              <span className="num">{item.quantity}</span>
              <button className="plus" onClick={() => onIncrease(item.id)}>+</button>
            </div>
          )}

          <div className="btn-and-icon">
            {layout === "prodact" && (
              <div className="con">
                <button className={`btn ${encart ? "encart" : ""}`} onClick={HandleAddToCart}>
                  <span>{encart ? "تمت الإضافة إلى العربة" : "اضف الي العربه"}</span>
                  <TbShoppingCart />
                </button>
                <div className="icon-hert">
                  <div className={`like ${inlike ? "inlike" : ""}`} onClick={handleAddToLike}>
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