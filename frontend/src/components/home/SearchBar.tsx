import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSearch } from "react-icons/fa";
import { searchProductsByImage, getLatestProducts } from "../../services/product.service";

interface RotatingItem {
  id: string;
  name: string;
}

const ROTATE_SECONDS = 2.5; // how long each name stays before sliding to the next

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [rotatingItems, setRotatingItems] = useState<RotatingItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Pull a handful of real product names from the DB to rotate through
  useEffect(() => {
    getLatestProducts(20)
      .then((data) => {
        const items = (data.products || []).map((p: any) => ({ id: p._id, name: p.name }));
        setRotatingItems(items);
      })
      .catch(() => setRotatingItems([]));
  }, []);

  // Cycle to the next name every ROTATE_SECONDS
  useEffect(() => {
    if (rotatingItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % rotatingItems.length);
    }, ROTATE_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [rotatingItems]);

  const handleTextSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  // Tapping the rotating name jumps straight to that exact product
  const handleRotatingNameClick = () => {
    const current = rotatingItems[activeIndex];
    if (current) navigate(`/product/${current.id}`);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const results = await searchProductsByImage(file);
      navigate("/products?imageSearch=1", { state: { imageSearchResults: results } });
    } catch (err) {
      console.error("Image search failed:", err);
      alert("Couldn't search by that image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const showRotatingLabel = !isFocused && !keyword && rotatingItems.length > 0;

  return (
    <div className="flex w-full">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={showRotatingLabel ? "" : "Search in Daraz"}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
          className="w-full h-11 rounded-l-md pl-4 pr-2 outline-none border border-r-0 border-gray-300 text-sm relative z-0 bg-transparent"
        />

        {/* Rotating product-name overlay — sits visually where the
            placeholder would be, but is clickable and slides between names.
            Sits ABOVE the input so it's actually tappable; disappears the
            moment the input is focused or has text, uncovering the input
            for normal typing. */}
        {showRotatingLabel && (
          <button
            type="button"
            onClick={handleRotatingNameClick}
            className="absolute inset-0 flex items-center pl-4 pr-2 text-sm text-gray-400 overflow-hidden text-left z-10"
          >
            <span
              key={activeIndex}
              className="truncate animate-[slideUpFade_0.4s_ease-out]"
            >
              {rotatingItems[activeIndex]?.name}
            </span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideUpFade {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <button
        type="button"
        onClick={handleCameraClick}
        disabled={uploading}
        aria-label="Search by image"
        className="bg-white border-t border-b border-gray-300 px-3 flex items-center justify-center shrink-0 disabled:opacity-50"
      >
        <FaCamera size={18} className={uploading ? "animate-pulse" : ""} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageSelected}
      />

      <button
        type="button"
        onClick={handleTextSearch}
        className="bg-orange-200 px-5 rounded-r-md flex items-center justify-center shrink-0"
      >
        <FaSearch size={18} />
      </button>
    </div>
  );
};

export default SearchBar;