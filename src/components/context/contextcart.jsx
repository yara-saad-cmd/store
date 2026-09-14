import React, { createContext, useEffect, useState ,useMemo} from 'react';

export const ContextCart = createContext();

export default function CartProvider({ children }) {
  // دالة مساعدة لتطهير وقراءة البيانات بأمان من localStorage
  const getSafeLocalStorage = (key) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`خطأ في قراءة ${key} من localStorage:`, error);
      return [];
    }
  };

  // ------------------ Muted Data Sanitizer Helper ------------------
  const sanitizeItem = (item) => {
    if (!item || typeof item !== 'object') return null;
    return {
      ...item,
      id: item.id ?? item._id,
      selectedSize: String(item.selectedSize || item.size || '').trim(),
      selectedColor: String(item.selectedColor || item.color || '').trim(),
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Number(item.price) || 0,
      title: String(item.title || item.name || '').trim(),
    };
  };

  // ------------------ LIKE ITEMS ------------------
  const [likeItems, setlikeItems] = useState(() => getSafeLocalStorage("likeItems"));

  const AddToLike = (product) => {
    const cleanProduct = sanitizeItem(product);
    if (!cleanProduct || !cleanProduct.id) return;

    setlikeItems((prev) => {
      const exists = prev.some(
        (i) =>
          i.id === cleanProduct.id &&
          (i.selectedSize || "") === cleanProduct.selectedSize &&
          (i.selectedColor || "") === cleanProduct.selectedColor
      );
      if (exists) return prev;
      return [...prev, cleanProduct];
    });
  };

  const removelike = (target) => {
    // قبول id فقط أو كائن كامل يحتوي على المقاس واللون
    const targetId = typeof target === 'object' ? target.id : target;
    const targetSize = typeof target === 'object' ? String(target.selectedSize || target.size || '').trim() : null;
    const targetColor = typeof target === 'object' ? String(target.selectedColor || target.color || '').trim() : null;

    setlikeItems((prev) =>
      prev.filter((i) => {
        if (targetSize !== null && targetColor !== null) {
          return !(
            i.id === targetId &&
            (i.selectedSize || "") === targetSize &&
            (i.selectedColor || "") === targetColor
          );
        }
        return i.id !== targetId;
      })
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem("likeItems", JSON.stringify(likeItems));
    } catch (error) {
      console.error("فشل حفظ البيانات المفضلة:", error);
    }
  }, [likeItems]);


  // ------------------ CART ITEMS ------------------
  const [cartItems, setcartItems] = useState(() => getSafeLocalStorage("cartItems"));

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
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
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
    if (!cleanItem || !cleanItem.id) return;

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
            ? { ...i, quantity: i.quantity + cleanItem.quantity }
            : i
        );
      }

      return [...prevItems, cleanItem];
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("فشل حفظ بيانات العربة:", error);
    }
  }, [cartItems]);

  // ------------------ Size & Color Change ------------------
  const onSizeChange = (id, newSize, oldColor = "") => {
    setcartItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.selectedColor || "") === oldColor
          ? { ...item, selectedSize: String(newSize).trim() }
          : item
      )
    );
  };

  const onColorChange = (id, newColor, oldSize = "") => {
    setcartItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.selectedSize || "") === oldSize
          ? { ...item, selectedColor: String(newColor).trim() }
          : item
      )
    );
  };

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