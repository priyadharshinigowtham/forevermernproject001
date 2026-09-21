import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const AiCompleteLook = ({ currentProduct }) => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const [bundleItems, setBundleItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    if (!currentProduct || !products.length) return;

    // Smart complementary matching logic:
    // If current is Topwear -> find Bottomwear or Winterwear in same category (Men/Women)
    // If current is Bottomwear -> find Topwear
    // Plus one trending accessory / complementary item
    const currentCat = currentProduct.category;
    const currentSub = currentProduct.subCategory;

    let complementary = products.filter(
      (p) =>
        p._id !== currentProduct._id &&
        p.category === currentCat &&
        p.subCategory !== currentSub
    );

    // If not enough complementary, fallback to general category items
    if (complementary.length < 2) {
      complementary = products.filter((p) => p._id !== currentProduct._id);
    }

    // Pick 2 best complementary items
    const selected = complementary.slice(0, 2);
    setBundleItems(selected);

    // Initialize default sizes
    const initialSizes = {};
    if (currentProduct.sizes?.length) initialSizes[currentProduct._id] = currentProduct.sizes[0];
    selected.forEach((item) => {
      if (item.sizes?.length) initialSizes[item._id] = item.sizes[0];
    });
    setSelectedSizes(initialSizes);
  }, [currentProduct, products]);

  if (!bundleItems.length) return null;

  const allLookProducts = [currentProduct, ...bundleItems];
  const totalPrice = allLookProducts.reduce((sum, item) => sum + item.price, 0);
  const discountRate = 0.10; // 10% AI bundle discount
  const discountedPrice = Math.round(totalPrice * (1 - discountRate));
  const savings = totalPrice - discountedPrice;

  const handleAddBundleToCart = () => {
    allLookProducts.forEach((item) => {
      const size = selectedSizes[item._id] || item.sizes?.[0] || "M";
      addToCart(item._id, size);
    });
    toast.success("✨ Complete Look bundle added to cart with 10% bundle savings!");
  };

  return (
    <div className="my-14 p-6 sm:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-200/90 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 mb-2">
            <span>✨</span>
            <span>AI Stylist Lookbook</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Complete The Look & Bundle
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Hand-curated pieces that naturally complement this item with an exclusive 10% bundle discount.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Bundle Savings: {currency}{savings} (10% OFF)
          </span>
        </div>
      </div>

      {/* Grid of Bundle Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {allLookProducts.map((item, index) => {
          const isCurrent = index === 0;
          return (
            <div
              key={item._id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? "border-black/30 bg-white shadow-xs"
                  : "border-gray-200/80 bg-white/70"
              }`}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {isCurrent ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white">
                        This Item
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        AI Matched
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {currency}{item.price}
                  </p>

                  {/* Size selector */}
                  {item.sizes?.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-400">Size:</span>
                      <select
                        value={selectedSizes[item._id] || item.sizes[0]}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        }
                        className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50"
                      >
                        {item.sizes.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-sm text-gray-500">Bundle Total (3 items):</span>
          <span className="text-gray-400 line-through text-base font-medium">
            {currency}{totalPrice}
          </span>
          <span className="text-2xl font-extrabold text-gray-900">
            {currency}{discountedPrice}
          </span>
        </div>

        <button
          onClick={handleAddBundleToCart}
          className="w-full sm:w-auto px-8 py-3 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>ADD COMPLETE LOOK TO CART</span>
        </button>
      </div>
    </div>
  );
};

export default AiCompleteLook;
