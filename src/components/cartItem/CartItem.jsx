import { useContext, useMemo, useState } from "react";
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
  const { AddToLike: AddToLikeCtx, removelike: removelikeCtx } = context;

  const productId = item?.id ?? item?._id;

  // تحويل القيمة لنص نظيف
  const getValue = (value, type) => {
    if (typeof value === "string" || typeof value === "number") {
      return String(value).trim();
    }
    if (!value || typeof value !== "object") return "";

    if (type === "size") {
      return String(value.size ?? value.name ?? value.value ?? value.label ?? value.title ?? "").trim();
    }

    return String(value.color ?? value.colour ?? value.name ?? value.value ?? value.label ?? value.title ?? "").trim();
  };

  // استخراج المقاسات
  const sizesList = useMemo(() => {
    const result = new Set();

    const addSize = (val) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach(addSize);
        return;
      }
      if (typeof val === "object") {
        const direct = getValue(val, "size");
        if (direct) {
          result.add(direct);
          return;
        }
        if (Array.isArray(val.values)) val.values.forEach(addSize);
        if (Array.isArray(val.options)) val.options.forEach(addSize);
        if (Array.isArray(val.sizes)) val.sizes.forEach(addSize);
        return;
      }
      const str = String(val).trim();
      if (str) result.add(str);
    };

    addSize(item?.sizes);

    if (Array.isArray(item?.options)) {
      item.options.forEach((opt) => {
        const name = String(opt?.name ?? opt?.title ?? opt?.type ?? "").toLowerCase();
        if (["size", "sizes", "المقاس", "المقاسات"].includes(name)) {
          addSize(opt?.values);
          addSize(opt?.options);
          addSize(opt?.sizes);
        }
      });
    }

    if (item?.attributes) {
      addSize(item.attributes.sizes);
      addSize(item.attributes.size);
      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((attr) => {
          const name = String(attr?.name ?? attr?.title ?? attr?.type ?? "").toLowerCase();
          if (["size", "sizes", "المقاس", "المقاسات"].includes(name)) {
            addSize(attr?.values);
            addSize(attr?.options);
          }
        });
      }
    }

    if (Array.isArray(item?.variants)) {
      item.variants.forEach((v) => {
        addSize(v?.size);
        addSize(v?.sizes);
      });
    }

    return Array.from(result);
  }, [item]);

  // استخراج الألوان
  const colorsList = useMemo(() => {
    const result = new Set();

    const addColor = (val) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach(addColor);
        return;
      }
      if (typeof val === "object") {
        const direct = getValue(val, "color");
        if (direct) {
          result.add(direct);
          return;
        }
        if (Array.isArray(val.values)) val.values.forEach(addColor);
        if (Array.isArray(val.options)) val.options.forEach(addColor);
        if (Array.isArray(val.colors)) val.colors.forEach(addColor);
        return;
      }
      const str = String(val).trim();
      if (str) result.add(str);
    };

    addColor(item?.colors);
    addColor(item?.availableColors);
    addColor(item?.available_colors);
    addColor(item?.color_options);
    addColor(item?.colorOptions);

    if (Array.isArray(item?.options)) {
      item.options.forEach((opt) => {
        const name = String(opt?.name ?? opt?.title ?? opt?.type ?? "").toLowerCase();
        if (["color", "colors", "colour", "اللون", "الألوان"].includes(name)) {
          addColor(opt?.values);
          addColor(opt?.options);
          addColor(opt?.colors);
        }
      });
    }

    if (item?.attributes) {
      addColor(item.attributes.colors);
      addColor(item.attributes.color);
      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((attr) => {
          const name = String(attr?.name ?? attr?.title ?? attr?.type ?? "").toLowerCase();
          if (["color", "colors", "colour", "اللون", "الألوان"].includes(name)) {
            addColor(attr?.values);
            addColor(attr?.options);
          }
        });
      }
    }

    if (Array.isArray(item?.variants)) {
      item.variants.forEach((v) => {
        addColor(v?.color);
        addColor(v?.colour);
        addColor(v?.colors);
      });
    }

    return Array.from(result);
  }, [item]);

  // القيم الافتراضية
  const defaultSize = useMemo(() => {
    const saved = item?.selectedSize || item?.size;
    return saved ? getValue(saved, "size") : sizesList[0] || "";
  }, [item, sizesList]);

  const defaultColor = useMemo(() => {
    const saved = item?.selectedColor || item?.color;
    return saved ? getValue(saved, "color") : colorsList[0] || "";
  }, [item, colorsList]);

  // استخدام القيم المحلية مباشرة مع دعم القيمة الافتراضية
  const [localSize, setLocalSize] = useState(null);
  const [localColor, setLocalColor] = useState(null);

  const selectedSize = localSize ?? defaultSize;
  const selectedColor = localColor ?? defaultColor;

  const hasSizes = sizesList.length > 0 || Boolean(selectedSize);
const hasColors = colorsList.length > 0 || Boolean(selectedColor);

  const handleSizeClick = (size) => {
    setLocalSize(size);
    if (onSizeChange && productId) {
      onSizeChange(productId, size, selectedColor);
    }
  };

  const handleColorClick = (color) => {
    setLocalColor(color);
    if (onColorChange && productId) {
      onColorChange(productId, color);
    }
  };

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

    const finalRemoveLike = removelike || removelikeCtx;
    const finalAddToLike = AddToLike || AddToLikeCtx;

    if (inlike) {
      finalRemoveLike?.(productId);
      toast?.error?.(`تم حذف ${item?.title || "المنتج"} من المفضل`);
    } else {
      finalAddToLike?.(product);
      toast?.success?.(`تم إضافة ${item?.title || "المنتج"} إلى المفضل`);
    }
  };

  const productImage =
  Array.isArray(item?.images) && item.images.length > 0
    ? item.images[0]
    : item?.image || item?.image_url || item?.thumbnail || "";

  return (
    <div className="item-cart">
      <div className={`img-name ${layout === "prodact" ? "hide-in-product" : ""}`}>
        {layout !== "prodact" && (
          <Link to={`/products/${productId}`}>
            {productImage && <img src={productImage} alt={item?.title || "صورة المنتج"} />}
          </Link>
        )}
      </div>

      <div className="Content">
        <div className="prudact-details">
          <h3 className="name-prudact">{item?.title}</h3>

          {layout === "prodact" && item?.description && <p>{item.description}</p>}

          {layout === "prodact" && item?.availability && (
            <h4>
              الحاله: <span className="stock">{item.availability}</span>
            </h4>
          )}

          {/* الألوان - صفحة المنتج */}
          {layout === "prodact" && hasColors && (
            <div className="colors-box">
              <h3>
                اللون : <span>{selectedColor}</span>
              </h3>
              <div className="colors">
                {colorsList.map((color) => {
                  const active = selectedColor === color;
                  return (
                    <button
                      type="button"
                      key={color}
                      aria-label={`إختيار اللون ${color}`}
                      className={`color-square-option ${active ? "active" : ""}`}
                      onClick={() => handleColorClick(color)}
                    >
                      <span className="color-square">{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* الألوان - العربة والطلبات */}
          {(layout === "cart" || layout === "details-ordar") && hasColors && (
            <p className="color-item">
              اللون: <strong>{selectedColor}</strong>
            </p>
          )}

          {/* المقاسات - صفحة المنتج */}
          {layout === "prodact" && hasSizes && (
            <div className="size-options">
              <h3>
                المقاس : <span>{selectedSize}</span>
              </h3>
              <div className="sizes">
                {sizesList.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      type="button"
                      key={size}
                      aria-label={`إختيار المقاس ${size}`}
                      className={`size-box ${active ? "active" : ""}`}
                      onClick={() => handleSizeClick(size)}
                    >
                      <span className="span-size">{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* المقاسات - العربة */}
          {layout === "cart" && hasSizes && (
            <div className="size">
              <select value={selectedSize} onChange={(e) => handleSizeClick(e.target.value)}>
                {sizesList.map((size) => (
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
              {selectedSize && (
                <p className="size">
                  المقاس: <strong>{selectedSize}</strong>
                </p>
              )}
              <p className="quantity">
                <span className="num">عدد : {item?.quantity || 1}</span>
              </p>
            </div>
          )}

          <p className="price">
            <span>EGP</span>
            {item?.price || 0}
          </p>
        </div>

        <div className="plus-and-mynas">
          {(layout === "prodact" || layout === "cart") && (
            <div className="quantity">
              <button
                type="button"
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
              <span className="num">{item?.quantity || 1}</span>
              <button
                type="button"
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

          <div className="btn-and-icon">
            {layout === "prodact" && (
              <div className="con">
                <button
                  type="button"
                  className={`btn ${encart ? "encart" : ""}`}
                  onClick={HandleAddToCart}
                >
                  <span>{encart ? "تمت الإضافة إلى العربة" : "اضف الي العربه"}</span>
                  <TbShoppingCart />
                </button>

                <div className="icon-hert">
                  <button
                    type="button"
                    aria-label="إضافة للمفضلة"
                    className={`like ${inlike ? "inlike" : ""}`}
                    onClick={handleAddToLike}
                  >
                    {inlike ? <FaHeart color="red" /> : <FiHeart />}
                  </button>
                </div>
              </div>
            )}

            {layout === "cart" && (
              <div className="icons">
                <button
                  type="button"
                  aria-label="إضافة للمفضلة"
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
                  {inlike ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>

                <button
                  type="button"
                  aria-label="حذف من العربة"
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
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}