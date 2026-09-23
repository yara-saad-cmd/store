import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ContextCart } from "../context/contextcart";
import CartItem from "../cartItem/CartItem";
import "./titel-pg-product.css";

function TitleProductPage({ prodact }) {
  const {
    cartItems = [],
    AddToCart,
    AddToLike,
    likeItems,
    removelike,
    onColorChange: onColorChangeCart,
  } = useContext(ContextCart);

  // =========================
  // المقاسات
  // =========================
  const availableSizes =
  (Array.isArray(prodact?.sizes) && prodact.sizes.length > 0
    ? prodact.sizes
    : prodact?.available_sizes) || [];

const [selectedSize, setSelectedSize] = useState(
  prodact?.selectedSize || availableSizes[0] || ""
);

  // =========================
  // الألوان
  // =========================
  const availableColors =
    prodact?.colors ||
    prodact?.available_colors ||
    [];

  const [selectedColor, setSelectedColor] = useState(
    prodact?.selectedColor || availableColors[0] || ""
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
    onColorChangeCart?.(id, color);
  };

  // =========================
  // إضافة للعربة
  // =========================
  const HandleAddToCart = () => {
    const productWithDetails = {
      ...prodact,
      selectedSize,
      selectedColor,
      quantity,
    };

    AddToCart(productWithDetails);

    toast.success(
      <div className="msg">
        <strong>{prodact.title}</strong>{" "}
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
      i.id === prodact.id &&
      (i.selectedSize || "") === selectedSize &&
      (i.selectedColor || "") === selectedColor
  );

  // =========================
  // هل بالمفضلة؟
  // =========================
  const inlike = likeItems.some((i) => i.id === prodact.id);

  const handleAddToLike = () => {
    if (inlike) {
      removelike(prodact.id);
      toast.error(`تم حذف ${prodact.title} من المفضل`);
    } else {
      AddToLike(prodact);
      toast.success(`تم إضافة ${prodact.title} إلى المفضل`);
    }
  };

  return (
    <div className="title-items">
      <CartItem
        item={{
          ...prodact,
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
        layout="prodact"
      />
    </div>
  );
}

export default TitleProductPage;