import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSearch } from "react-icons/fa";
import { searchProductsByImage } from "../../services/product.service";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleTextSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  // Opens the device camera (on phones, capture="environment" jumps
  // straight to the camera app instead of the generic file picker)
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file next time
    if (!file) return;

    setUploading(true);
    try {
      const results = await searchProductsByImage(file);
      // Pass the matched products forward via router state so the
      // Products page can render them immediately without a second fetch.
      navigate("/products?imageSearch=1", { state: { imageSearchResults: results } });
    } catch (err) {
      console.error("Image search failed:", err);
      alert("Couldn't search by that image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex w-full">
      <input
        type="text"
        placeholder="Search in Daraz"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
        className="w-full h-11 rounded-l-md pl-4 pr-2 outline-none border border-r-0 border-gray-300 text-sm"
      />

      <button
        type="button"
        onClick={handleCameraClick}
        disabled={uploading}
        aria-label="Search by image"
        className="bg-white border-t border-b border-gray-300 px-3 flex items-center justify-center shrink-0 disabled:opacity-50"
      >
        <FaCamera size={18} className={uploading ? "animate-pulse" : ""} />
      </button>

      {/* Hidden input drives the camera/file picker; not visible itself */}
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