import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ContextCart } from "../context/contextcart";
import CartItem from "../cartItem/CartItem";
import "./titel-pg-product.css";

function TitleProductPage({ goods }) {
  const {
    cartItems = [],
    AddToCart,
    AddToLike,
    likeItems,
    removelike,
  } = useContext(ContextCart);
  // =========================
  // المقاسات
  // =========================
  const availableSizes =
  (Array.isArray(goods?.sizes) && goods.sizes.length > 0
    ? goods.sizes
    : goods?.available_sizes) || [];

const [selectedSize, setSelectedSize] = useState(
  goods?.selectedSize || availableSizes[0] || ""
);

  // =========================
  // الألوان
  // =========================
  const availableColors =
    goods?.colors ||
    goods?.available_colors ||
    [];

  const [selectedColor, setSelectedColor] = useState(
    goods?.selectedColor || availableColors[0] || ""
  );

  // =========================
  // الكمية
  // =========================
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // =========================
  // تغيير المقاس
  // =========================
  const handleSizeChange = (id, newSize) => {
    setSelectedSize(newSize);
  };

  // =========================
  // تغيير اللون
  // =========================
  const handleColorChange = (id, color) => {
    setSelectedColor(color);
  };
  // =========================
  // إضافة للعربة
  // =========================
  const HandleAddToCart = () => {
    const productWithDetails = {
      ...goods,
      selectedSize,
      selectedColor,
      quantity,
    };

    AddToCart(productWithDetails);

    toast.success(
      <div className="msg">
        <strong>{goods.title}</strong>{" "}
        تمت الإضافة إلى العربة
      </div>,
      {
        duration: 3000,
      }
    );
  };

  // =========================
  // هل المنتج موجود بالعربة؟
  // =========================
  const encart = cartItems.some(
    (i) =>
      i.id === goods.id &&
      (i.selectedSize || "") === selectedSize &&
      (i.selectedColor || "") === selectedColor
  );

  // =========================
  // هل بالمفضلة؟
  // =========================
  const inlike = likeItems.some((i) => i.id === goods.id);

  const handleAddToLike = () => {
    if (inlike) {
      removelike(goods.id);
      toast.error(`تم حذف ${goods.title} من المفضل`);
    } else {
      AddToLike(goods);
      toast.success(`تم إضافة ${goods.title} إلى المفضل`);
    }
  };

  return (
    <div className="title-items">
      <CartItem
        item={{
          ...goods,
          selectedSize,
          selectedColor,
          quantity,
        }}
        inlike={inlike}
        encart={encart}
        HandleAddToCart={HandleAddToCart}
        onLike={handleAddToLike}
        onSizeChange={handleSizeChange}
        onColorChange={handleColorChange}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        toast={toast}
        layout="goods"
      />
    </div>
  );
}

export default TitleProductPage;