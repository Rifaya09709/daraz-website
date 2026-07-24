import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchProducts } from "../store/productSlice";
import ProductCard from "../components/product/ProductCard";
import FilterCheckboxGroup from "../components/product/FilterCheckboxGroup";
import { CATEGORY_LABELS, CATEGORY_SUBCATEGORIES } from "../constants/categories";

const getPageNumbers = (current: number, total: number): (number | string)[] => {
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if ((i as number) - l === 2) {
        rangeWithDots.push(l + 1);
      } else if ((i as number) - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  }

  return rangeWithDots;
};

const COLOR_OPTIONS = [
  "Multicolor", "Silver", "Black", "White", "Blue", "Green",
  "Brown", "Red", "Grey", "Yellow", "Pink", "Gold", "Orange", "Purple",
];

const MATERIAL_OPTIONS = [
  "Stainless Steel", "Silicone", "Wood", "Aluminium", "Ceramic",
  "Cast Iron", "Plastic", "Copper", "Cotton", "Leather", "Glass", "Rubber",
];

const CAPACITY_OPTIONS = ["1 to 10 LTR", "One Size", "S", "M", "L", "XL", "500ml", "1L", "2L"];

const WARRANTY_PERIOD_OPTIONS = [
  "No Warranty", "1 Month", "3 Months", "6 Months", "1 Year", "2 Years", "5 Years", "Life Time Warranty",
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const { products, loading, totalPages, currentPage } = useAppSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "All";
  const subCategory = searchParams.get("subCategory") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedWarranty, setSelectedWarranty] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [selectedWarrantyPeriods, setSelectedWarrantyPeriods] = useState<string[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const subCategoriesForCategory = CATEGORY_SUBCATEGORIES[category] || [];

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit: 12,
        search: searchParams.get("search") || undefined,
        category: category !== "All" ? category : undefined,
        subCategory: subCategory || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: selectedRating || undefined,
        warranty: selectedWarranty.length ? selectedWarranty.join(",") : undefined,
        color: selectedColors.length ? selectedColors.join(",") : undefined,
        material: selectedMaterials.length ? selectedMaterials.join(",") : undefined,
        capacity: selectedCapacities.length ? selectedCapacities.join(",") : undefined,
        warrantyPeriod: selectedWarrantyPeriods.length
          ? selectedWarrantyPeriods.join(",")
          : undefined,
      })
    );
  }, [
    searchParams,
    dispatch,
    minPrice,
    maxPrice,
    selectedRating,
    selectedWarranty,
    selectedColors,
    selectedMaterials,
    selectedCapacities,
    selectedWarrantyPeriods,
  ]);

  const handleSearch = () => {
    const params: Record<string, string> = { page: "1" };
    if (search.trim()) params.search = search.trim();
    if (category !== "All") params.category = category;
    if (subCategory) params.subCategory = subCategory;
    setSearchParams(params);
  };

  const handleCategoryClick = (cat: string) => {
    const params: Record<string, string> = { page: "1" };
    if (search.trim()) params.search = search.trim();
    if (cat !== "All") params.category = cat;
    setSearchParams(params);
  };

  const handleCategorySubCategoryClick = (cat: string, subCat: string) => {
    const params: Record<string, string> = { page: "1" };
    if (search.trim()) params.search = search.trim();
    if (cat !== "All") params.category = cat;
    params.subCategory = subCat;
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = { page: newPage.toString() };
    if (search.trim()) params.search = search.trim();
    if (category !== "All") params.category = category;
    if (subCategory) params.subCategory = subCategory;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFromList = (
    value: string,
    checked: boolean,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating(null);
    setSelectedWarranty([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCapacities([]);
    setSelectedWarrantyPeriods([]);
  };

  const pageHeading = subCategory || (category !== "All" ? category : "All Products");
  const showingResultsText =
    category !== "All"
      ? `Showing results for ${[category, subCategory].filter(Boolean).join(", ")}`
      : null;

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="flex">
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border rounded-l-lg p-3 outline-none"
            />
            <button onClick={handleSearch} className="bg-primary text-white px-4 rounded-r-lg">
              Go
            </button>
          </div>

          {/* Category list with hover flyout */}
          <div>
            <h3 className="font-bold mb-3 text-sm">Category</h3>
            <div className="space-y-1">
              {CATEGORY_LABELS.map((cat) => {
                const subCats = CATEGORY_SUBCATEGORIES[cat] || [];
                return (
                  <div
                    key={cat}
                    className="relative"
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        category === cat
                          ? "text-primary font-semibold bg-secondary"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {subCats.length > 0 && <span className="text-xs text-gray-400">›</span>}
                    </button>

                    {subCats.length > 0 && hoveredCategory === cat && (
                      <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                        {subCats.map((subCat) => (
                          <button
                            key={subCat}
                            onClick={() => handleCategorySubCategoryClick(cat, subCat)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              category === cat && subCategory === subCat
                                ? "text-primary font-semibold bg-secondary"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {subCat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-3 text-sm">Price</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border rounded-lg px-2 py-2 text-sm outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border rounded-lg px-2 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-3 text-sm">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(r)}
                  />
                  <span className="flex text-yellow-400">
                    {"★".repeat(r)}
                    <span className="text-gray-300">{"★".repeat(5 - r)}</span>
                  </span>
                  <span className="text-gray-500">And Up</span>
                </label>
              ))}
            </div>
          </div>

          <FilterCheckboxGroup
            title="Color Family"
            options={COLOR_OPTIONS}
            selected={selectedColors}
            onChange={(v, c) => toggleFromList(v, c, setSelectedColors)}
          />

          <FilterCheckboxGroup
            title="Material"
            options={MATERIAL_OPTIONS}
            selected={selectedMaterials}
            onChange={(v, c) => toggleFromList(v, c, setSelectedMaterials)}
          />

          <FilterCheckboxGroup
            title="Capacity / Size"
            options={CAPACITY_OPTIONS}
            selected={selectedCapacities}
            onChange={(v, c) => toggleFromList(v, c, setSelectedCapacities)}
          />

          <FilterCheckboxGroup
            title="Warranty Period"
            options={WARRANTY_PERIOD_OPTIONS}
            selected={selectedWarrantyPeriods}
            onChange={(v, c) => toggleFromList(v, c, setSelectedWarrantyPeriods)}
          />

          <button onClick={clearFilters} className="text-sm text-primary underline">
            Clear filters
          </button>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{pageHeading} Price</h1>
            {showingResultsText && (
              <p className="text-gray-500 text-sm mt-1">{showingResultsText}</p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-96 rounded-xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold">No Products Found</h3>
              <p className="text-gray-500 mt-3">Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ‹
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium ${
                          currentPage === p
                            ? "bg-primary text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;