// نفس تطبيع دالة normalize_ar في القاعدة: بيشيل التشكيل ويوحّد الحروف
export const normalizeAr = (text) =>
    String(text ?? '')
      .replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .toLowerCase()