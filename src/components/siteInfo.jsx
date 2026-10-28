//بيانات النواصل و السوشل ميديا 
export const siteInfo = {
   //اكتب قبل الرقم 20 كود الدوله 
    whatsappNumber: "",
    social: {
      instagram: "www.dsfd.com",
      telegram: "www.dsfd.com",
      tiktok: "www.dsfd.com",
    },

    // طرق الدفع. الدفع عند الاستلام شغال دايماً
    payment: {
      // true بيظهر خيار الفيزا، بس لازم بوابة دفع حقيقية و'visa' ترجع في دالة القاعدة
      visa: false,
      // true بيظهر خانة كود الخصم، بس مش هتشتغل لحد ما نعمل جدول coupons ونربطه بالدالة
      coupons: false,
    },
  };