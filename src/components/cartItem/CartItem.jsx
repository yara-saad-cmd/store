import { useContext, useEffect, useMemo, useState } from "react";
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
  const context = useContext(ContextCart) || {};

  const {
    AddToLike: AddToLikeCtx,
    removelike: removelikeCtx,
  } = context;

  // =========================================================
  // ID
  // =========================================================
  const productId = item?.id ?? item?._id;

  // =========================================================
  // دالة تحويل أي قيمة إلى نص
  // =========================================================
  const getValue = (value, type) => {
    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value).trim();
    }

    if (!value || typeof value !== "object") {
      return "";
    }

    if (type === "size") {
      return String(
        value.size ??
        value.name ??
        value.value ??
        value.label ??
        value.title ??
        ""
      ).trim();
    }

    return String(
      value.color ??
      value.colour ??
      value.name ??
      value.value ??
      value.label ??
      value.title ??
      ""
    ).trim();
  };

  // =========================================================
  // استخراج المقاسات
  // =========================================================
  const sizesList = useMemo(() => {
    const result = [];

    const addSize = (value) => {
      if (value === null || value === undefined) {
        return;
      }

      // Array
      if (Array.isArray(value)) {
        value.forEach(addSize);
        return;
      }

      // Object
      if (typeof value === "object") {
        const directValue = getValue(value, "size");

        if (directValue) {
          if (!result.includes(directValue)) {
            result.push(directValue);
          }
          return;
        }

        // بعض الـ APIs ترجع:
        // { values: ["S", "M", "L"] }
        // أو { options: [...] }
        if (Array.isArray(value.values)) {
          value.values.forEach(addSize);
        }

        if (Array.isArray(value.options)) {
          value.options.forEach(addSize);
        }

        if (Array.isArray(value.sizes)) {
          value.sizes.forEach(addSize);
        }

        return;
      }

      const finalValue = String(value).trim();

      if (
        finalValue &&
        !result.includes(finalValue)
      ) {
        result.push(finalValue);
      }
    };

    // =======================================================
    // الأسماء المحتملة للمقاسات
    // =======================================================

    addSize(item?.sizes);

    // =======================================================
    // لو المقاس موجود كـ options
    // =======================================================
    if (Array.isArray(item?.options)) {
      item.options.forEach((option) => {
        const name = String(
          option?.name ??
          option?.title ??
          option?.type ??
          ""
        ).toLowerCase();

        if (
          name === "size" ||
          name === "sizes" ||
          name === "المقاس" ||
          name === "المقاسات"
        ) {
          addSize(option?.values);
          addSize(option?.options);
          addSize(option?.sizes);
        }
      });
    }

    // =======================================================
    // لو المقاسات موجودة داخل attributes
    // =======================================================
    if (item?.attributes) {
      addSize(item.attributes.sizes);
      addSize(item.attributes.size);

      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((attribute) => {
          const name = String(
            attribute?.name ??
            attribute?.title ??
            attribute?.type ??
            ""
          ).toLowerCase();

          if (
            name === "size" ||
            name === "sizes" ||
            name === "المقاس" ||
            name === "المقاسات"
          ) {
            addSize(attribute?.values);
            addSize(attribute?.options);
          }
        });
      }
    }

    // =======================================================
    // لو المنتج يحتوي variants
    // =======================================================
    if (Array.isArray(item?.variants)) {
      item.variants.forEach((variant) => {
        addSize(variant?.size);
        addSize(variant?.sizes);
      });
    }

    return result;
  }, [item]);

  // =========================================================
  // استخراج الألوان
  // =========================================================
  const colorsList = useMemo(() => {
    const result = [];

    const addColor = (value) => {
      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(addColor);
        return;
      }

      if (typeof value === "object") {
        const directValue = getValue(value, "color");

        if (directValue) {
          if (!result.includes(directValue)) {
            result.push(directValue);
          }
          return;
        }

        if (Array.isArray(value.values)) {
          value.values.forEach(addColor);
        }

        if (Array.isArray(value.options)) {
          value.options.forEach(addColor);
        }

        if (Array.isArray(value.colors)) {
          value.colors.forEach(addColor);
        }

        return;
      }

      const finalValue = String(value).trim();

      if (
        finalValue &&
        !result.includes(finalValue)
      ) {
        result.push(finalValue);
      }
    };

    addColor(item?.colors);
    addColor(item?.availableColors);
    addColor(item?.available_colors);
    addColor(item?.color_options);
    addColor(item?.colorOptions);

    // options
    if (Array.isArray(item?.options)) {
      item.options.forEach((option) => {
        const name = String(
          option?.name ??
          option?.title ??
          option?.type ??
          ""
        ).toLowerCase();

        if (
          name === "color" ||
          name === "colors" ||
          name === "colour" ||
          name === "اللون" ||
          name === "الألوان"
        ) {
          addColor(option?.values);
          addColor(option?.options);
          addColor(option?.colors);
        }
      });
    }

    // attributes
    if (item?.attributes) {
      addColor(item.attributes.colors);
      addColor(item.attributes.color);

      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((attribute) => {
          const name = String(
            attribute?.name ??
            attribute?.title ??
            attribute?.type ??
            ""
          ).toLowerCase();

          if (
            name === "color" ||
            name === "colors" ||
            name === "colour" ||
            name === "اللون" ||
            name === "الألوان"
          ) {
            addColor(attribute?.values);
            addColor(attribute?.options);
          }
        });
      }
    }

    // variants
    if (Array.isArray(item?.variants)) {
      item.variants.forEach((variant) => {
        addColor(variant?.color);
        addColor(variant?.colour);
        addColor(variant?.colors);
      });
    }

    return result;
  }, [item]);

  // =========================================================
  // القيم الافتراضية
  //
  // لو فيه اختيار محفوظ نستخدمه
  // ولو مفيش نستخدم أول اختيار
  // =========================================================
  const defaultSize = useMemo(() => {
    const savedSize =
      item?.selectedSize ||
      item?.size;

    if (savedSize) {
      const value = getValue(savedSize, "size");

      if (value) {
        return value;
      }
    }

    return sizesList[0] || "";
  }, [item, sizesList]);

  const defaultColor = useMemo(() => {
    const savedColor =
      item?.selectedColor ||
      item?.color;

    if (savedColor) {
      const value = getValue(savedColor, "color");

      if (value) {
        return value;
      }
    }

    return colorsList[0] || "";
  }, [item, colorsList]);

  // =========================================================
  // Local State
  // =========================================================
  const [localSize, setLocalSize] = useState(defaultSize);
  const [localColor, setLocalColor] = useState(defaultColor);

  // =========================================================
  // مهم جدًا:
  // لو بيانات المنتج وصلت بعد أول Render
  // نحدث الاختيار الافتراضي
  // =========================================================
  useEffect(() => {
    setLocalSize(defaultSize);
  }, [defaultSize]);

  useEffect(() => {
    setLocalColor(defaultColor);
  }, [defaultColor]);

  // =========================================================
  // الاختيار النهائي
  // =========================================================
  const selectedSize =
    localSize || defaultSize || "";

  const selectedColor =
    localColor || defaultColor || "";

  const hasSizes =
    sizesList.length > 0;

  const hasColors =
    colorsList.length > 0;

  // =========================================================
  // تغيير المقاس
  // =========================================================
  const handleSizeClick = (size) => {
    setLocalSize(size);

    if (onSizeChange && productId) {
      onSizeChange(productId, size, selectedColor);
    }
  };

  // =========================================================
  // تغيير اللون
  // =========================================================
  const handleColorClick = (color) => {
    setLocalColor(color);

    if (onColorChange && productId) {
      onColorChange(productId, color);
    }
  };
  // =========================================================
  // Like
  // =========================================================
  const handleAddToLike = () => {
    if (!productId) return;

    const product = {
      ...item,
      id: productId,

      selectedSize,
      selectedColor,

      size: selectedSize,
      color: selectedColor,
    };

    const finalRemoveLike =
      removelike || removelikeCtx;

    const finalAddToLike =
      AddToLike || AddToLikeCtx;

    if (inlike) {
      finalRemoveLike?.(productId);

      toast?.error?.(
        `تم حذف ${item?.title || "المنتج"
        } من المفضل`
      );
    } else {
      finalAddToLike?.(product);

      toast?.success?.(
        `تم إضافة ${item?.title || "المنتج"
        } إلى المفضل`
      );
    }
  };

  // =========================================================
  // الصورة
  // =========================================================
  const productImage =
    item?.image ||
    item?.image_url ||
    item?.thumbnail ||
    (
      Array.isArray(item?.images) &&
        item.images.length > 0
        ? item.images[0]
        : ""
    );

  return (
    <div className="item-cart">

      {/* =====================================================
          IMAGE
      ===================================================== */}
      <div
        className={`img-name ${layout === "prodact"
            ? "hide-in-product"
            : ""
          }`}
      >
        {layout !== "prodact" && (
          <Link to={`/products/${productId}`}>
            {productImage && (
              <img
                src={productImage}
                alt={
                  item?.title ||
                  "صورة المنتج"
                }
              />
            )}
          </Link>
        )}
      </div>

      <div className="Content">

        <div className="prudact-details">

          {/* =================================================
              PRODUCT NAME
          ================================================= */}
          <h3 className="name-prudact">
            {item?.title}
          </h3>

          {/* =================================================
              DESCRIPTION
          ================================================= */}
          {layout === "prodact" &&
            item?.description && (
              <p>
                {item.description}
              </p>
            )}

          {/* =================================================
              AVAILABILITY
          ================================================= */}
          {layout === "prodact" &&
            item?.availability && (
              <h4>
                الحاله:
                <span className="stock">
                  {item.availability}
                </span>
              </h4>
            )}

          {/* =================================================
              COLORS - PRODUCT
          ================================================= */}
          {layout === "prodact" &&
            hasColors && (
              <div className="colors-box">

                <h3>
                  اللون :
                  <span>
                    {selectedColor}
                  </span>
                </h3>

                <div className="colors">

                  {colorsList.map(
                    (color) => {
                      const active =
                        selectedColor ===
                        color;

                      return (
                        <label
                          key={color}
                          className={`color-square-option ${active
                              ? "active"
                              : ""
                            }`}
                          onClick={() =>
                            handleColorClick(
                              color
                            )
                          }
                        >
                          <span className="color-square">
                            {color}
                          </span>
                        </label>
                      );
                    }
                  )}

                </div>
              </div>
            )}

          {/* =================================================
              COLOR - CART / ORDER
          ================================================= */}
          {(layout === "cart" ||
            layout ===
            "details-ordar") &&
            hasColors && (
              <p className="color-item">
                اللون:
                <strong>
                  {selectedColor}
                </strong>
              </p>
            )}

          {/* =================================================
              SIZES - PRODUCT
          ================================================= */}
          {layout === "prodact" &&
            hasSizes && (
              <div className="size-options">

                <h3>
                  المقاس :
                  <span>
                    {selectedSize}
                  </span>
                </h3>

                <div className="sizes">

                  {sizesList.map(
                    (size) => {
                      const active =
                        selectedSize ===
                        size;

                      return (
                        <label
                          key={size}
                          className={`size-box ${active
                              ? "active"
                              : ""
                            }`}
                          onClick={() =>
                            handleSizeClick(
                              size
                            )
                          }
                        >
                          <span className="span-size">
                            {size}
                          </span>
                        </label>
                      );
                    }
                  )}

                </div>
              </div>
            )}

          {/* =================================================
              SIZES - CART
          ================================================= */}
          {layout === "cart" &&
            hasSizes && (
              <div className="size">

                <select
                  value={selectedSize}
                  onChange={(e) =>
                    handleSizeClick(
                      e.target.value
                    )
                  }
                >
                  {sizesList.map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    )
                  )}
                </select>

              </div>
            )}



          {/* =================================================
              ORDER DETAILS
          ================================================= */}
          {layout === "details-ordar" && (
            <div className="size-and-num">

              {selectedSize && (
                <p className="size">
                  المقاس:
                  <strong>
                    {selectedSize}
                  </strong>
                </p>
              )}

              <p className="quantity">
                <span className="num">
                  عدد :{" "}
                  {item?.quantity || 1}
                </span>
              </p>

            </div>
          )}

          {/* =================================================
              PRICE
          ================================================= */}
          <p className="price">
            <span>EGP</span>
            {item?.price || 0}
          </p>

        </div>

        {/* ===================================================
            QUANTITY
        =================================================== */}
        <div className="plus-and-mynas">

          {(layout === "prodact" ||
            layout === "cart") && (
              <div className="quantity">

                <button
                  className="minus"
                  onClick={() =>
                    onDecrease?.({
                      id: productId,
                      selectedSize,
                      selectedColor,
                    })
                  }
                >
                  -
                </button>

                <span className="num">
                  {item?.quantity || 1}
                </span>

                <button
                  className="plus"
                  onClick={() =>
                    onIncrease?.({
                      id: productId,
                      selectedSize,
                      selectedColor,
                    })
                  }
                >
                  +
                </button>

              </div>
            )}

          {/* =================================================
              BUTTONS
          ================================================= */}
          <div className="btn-and-icon">

            {/* PRODUCT */}
            {layout === "prodact" && (
              <div className="con">

                <button
                  className={`btn ${encart
                      ? "encart"
                      : ""
                    }`}
                  onClick={
                    HandleAddToCart
                  }
                >
                  <span>
                    {encart
                      ? "تمت الإضافة إلى العربة"
                      : "اضف الي العربه"}
                  </span>

                  <TbShoppingCart />
                </button>

                <div className="icon-hert">

                  <div
                    className={`like ${inlike
                        ? "inlike"
                        : ""
                      }`}
                    onClick={
                      handleAddToLike
                    }
                  >
                    {inlike ? (
                      <FaHeart
                        color="red"
                      />
                    ) : (
                      <FiHeart />
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* CART */}
            {layout === "cart" && (
              <div className="icons">

                <div
                  className="like"
                  onClick={() =>
                    onLike?.({
                      ...item,
                      selectedSize,
                      selectedColor,
                      size: selectedSize,
                      color: selectedColor,
                    })
                  }
                >
                  {inlike ? (
                    <FaHeart
                      color="red"
                    />
                  ) : (
                    <FaRegHeart />
                  )}
                </div>

                <div
                  className="delete"
                  onClick={() =>
                    productId &&
                    onDelete?.({
                      id: productId,
                      selectedSize,
                      selectedColor,
                    })
                  }
                >
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
