import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavant");

  // Toggle Category
  const toggleCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Toggle SubCategory
  const toggleSubCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // APPLY FILTER FIXED
  const applyFilter = () => {
    let copy = [...products];

    // Apply search
    if (showSearch && search) {
      copy = copy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category.length > 0) {
      copy = copy.filter((item) =>
        category.includes(item.category.toLowerCase())
      );
    }

    // Apply subcategory filter
    if (subCategory.length > 0) {
      copy = copy.filter((item) =>
        subCategory.includes(item.subCategory.toLowerCase())
      );
    }

    setFilterProducts(copy);
  };

  // SORT FUNCTION FIXED
  const sortProducts = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "relavant":
      default:
        sorted.sort((a, b) => a._id.localeCompare(b._id));
        break;
    }

    setFilterProducts(sorted);
  };

  // When filters change → reapply filter
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  // When sortType changes → re-sort
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">

      {/* LEFT FILTER SECTION */}
      <div className="w-60 flex-shrink-0">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform duration-200 ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* CATEGORY FILTER */}
        <div
          className={`border border-gray-300 w-fit p-5 mt-4 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <label className="flex gap-2 items-center">
              <input type="checkbox" value="women" onChange={toggleCategory} />
              Women
            </label>

            <label className="flex gap-2 items-center">
              <input type="checkbox" value="men" onChange={toggleCategory} />
              Men
            </label>

            <label className="flex gap-2 items-center">
              <input type="checkbox" value="kids" onChange={toggleCategory} />
              Kids
            </label>
          </div>
        </div>

        {/* TYPE FILTER */}
        <div className="mt-3 w-fit">
          <div
            className={`border border-gray-300 w-fit p-5 mt-2 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>

            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <label className="flex gap-2 items-center">
                <input type="checkbox" value="topwear" onChange={toggleSubCategory} />
                Topwear
              </label>

              <label className="flex gap-2 items-center">
                <input type="checkbox" value="bottomwear" onChange={toggleSubCategory} />
                Bottomwear
              </label>

              <label className="flex gap-2 items-center">
                <input type="checkbox" value="winterwear" onChange={toggleSubCategory} />
                Winterwear
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PRODUCT SECTION */}
      <div className="flex-1">

        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">

          {filterProducts.length === 0 && (
            <p className="text-gray-500">No products found.</p>
          )}

          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
