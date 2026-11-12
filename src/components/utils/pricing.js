// سعر الوحدة بعد الخصم، بنفس معادلة دالة القاعدة: round(price * (100 - discount) / 100)
export const unitPrice = (price, discount) =>
    Math.round((Number(price) * (100 - Number(discount || 0))) / 100)
  
  // بيدمج السعر والخصم الحاليين من القاعدة فوق المنتج المخزّن في العربة (للعرض بس)
  export const withLivePrice = (item, current) =>
    current
      ? { ...item, price: current.price, discount_percent: current.discount_percent }
      : item