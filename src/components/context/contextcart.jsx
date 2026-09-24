
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const ContextCart = createContext();

export default function CartProvider({ children }) {

  // ------------------ Data Sanitizer Helper ------------------

  const sanitizeItem = (item) => {
    if (!item || typeof item !== "object") return null;
  
    return {
      ...item,
      id: item.id ?? item._id,
      title: String(item.title || item.name || "").trim(),
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      selectedSize: String(
        item.selectedSize || item.size || ""
      ).trim(),
      selectedColor: String(
        item.selectedColor || item.color || ""
      ).trim(),
    };
  };

  // ------------------ Safe localStorage Reader ------------------

  const getSafeLocalStorage = (key) => {
    try {
      const saved = localStorage.getItem(key);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(sanitizeItem)
        .filter(Boolean);
    } catch (error) {
      console.error(`خطأ في قراءة ${key} من localStorage:`, error);
      return [];
    }
  };

  // ------------------ LIKE ITEMS ------------------

  const [likeItems, setlikeItems] = useState(() =>
    getSafeLocalStorage("likeItems")
  );

  const AddToLike = useCallback((product) => {
    const cleanProduct = sanitizeItem(product);

    if (!cleanProduct?.id) return;
    setlikeItems((prev) => {
      const exists = prev.some((i) => i.id === cleanProduct.id);
      if (exists) return prev;
      return [...prev, cleanProduct];
    });
  }, []);

  const removelike = useCallback((target) => {
    // قبول id مباشرة أو كائن كامل — بنستخرج id بس، والمقارنة دايماً بالـ id فقط
    const targetId = typeof target === 'object' ? target.id : target;

    setlikeItems((prev) => prev.filter((i) => i.id !== targetId));
  }, []);

  useEffect(() => {
    try {
      const safeLikeItems = likeItems
        .map(sanitizeItem)
        .filter(Boolean);

      localStorage.setItem(
        "likeItems",
        JSON.stringify(safeLikeItems)
      );
    } catch (error) {
      console.error("فشل حفظ البيانات المفضلة:", error);
    }
  }, [likeItems]);

  // ------------------ CART ITEMS ------------------

  const [cartItems, setcartItems] = useState(() =>
    getSafeLocalStorage("cartItems")
  );

  const increaseQuantity = (item) => {
    if (!item?.id) return;

    const targetSize = String(item.selectedSize || "").trim();
    const targetColor = String(item.selectedColor || "").trim();

    setcartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id &&
        (i.selectedSize || "") === targetSize &&
        (i.selectedColor || "") === targetColor
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decreaseQuantity = (item) => {
    if (!item?.id) return;

    const targetSize = String(item.selectedSize || "").trim();
    const targetColor = String(item.selectedColor || "").trim();

    setcartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id &&
        (i.selectedSize || "") === targetSize &&
        (i.selectedColor || "") === targetColor
          ? {
              ...i,
              quantity: Math.max(1, i.quantity - 1),
            }
          : i
      )
    );
  };

  const delet = (item) => {
    if (!item?.id) return;

    const targetSize = String(item.selectedSize || "").trim();
    const targetColor = String(item.selectedColor || "").trim();

    setcartItems((prevItems) =>
      prevItems.filter(
        (i) =>
          !(
            i.id === item.id &&
            (i.selectedSize || "") === targetSize &&
            (i.selectedColor || "") === targetColor
          )
      )
    );
  };

  const AddToCart = (item) => {
    const cleanItem = sanitizeItem(item);
  
    if (!cleanItem?.id) return;
  
    setcartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) =>
          i.id === cleanItem.id &&
          (i.selectedSize || "") === cleanItem.selectedSize &&
          (i.selectedColor || "") === cleanItem.selectedColor
      );
  
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === cleanItem.id &&
          (i.selectedSize || "") === cleanItem.selectedSize &&
          (i.selectedColor || "") === cleanItem.selectedColor
            ? {
                ...i,
                ...cleanItem,
                quantity: i.quantity + cleanItem.quantity,
              }
            : i
        );
      }
  
      return [...prevItems, cleanItem];
    });
  };

  useEffect(() => {
    try {
      const safeCartItems = cartItems
        .map(sanitizeItem)
        .filter(Boolean);

      localStorage.setItem(
        "cartItems",
        JSON.stringify(safeCartItems)
      );
    } catch (error) {
      console.error("فشل حفظ بيانات العربة:", error);
    }
  }, [cartItems]);

  // ------------------ Size & Color Change ------------------

  const onSizeChange = (id, newSize, oldColor = "") => {
    setcartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        (item.selectedColor || "") === oldColor
          ? {
              ...item,
              selectedSize: String(newSize).trim(),
            }
          : item
      )
    );
  };

  const onColorChange = (id, newColor, oldSize = "") => {
    setcartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        (item.selectedSize || "") === oldSize
          ? {
              ...item,
              selectedColor: String(newColor).trim(),
            }
          : item
      )
    );
  };

  // ------------------ Context Value ------------------

  const contextValue = useMemo(
    () => ({
      cartItems,
      AddToCart,
      increaseQuantity,
      decreaseQuantity,
      delet,
      likeItems,
      AddToLike,
      removelike,
      onSizeChange,
      onColorChange,
    }),
    [
      cartItems,
      AddToCart,
      increaseQuantity,
      decreaseQuantity,
      delet,
      likeItems,
      AddToLike,
      removelike,
      onSizeChange,
      onColorChange,
    ]
  );

  return (
    <ContextCart.Provider value={contextValue}>
      {children}
    </ContextCart.Provider>
  );
}
