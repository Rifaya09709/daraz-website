import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const HomeSearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-3">
      <div className="flex-1 flex items-center border-2 border-rose-500 rounded-full pl-4 pr-1 py-1">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search in Daraz"
          className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
        />
        <button className="text-gray-400 px-2" aria-label="Search by image">
          <FaCamera size={18} />
        </button>
        <button
          onClick={handleSearch}
          className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2 rounded-full shrink-0"
        >
          Search
        </button>
      </div>

      <span className="shrink-0 bg-rose-500 text-white text-[10px] font-bold leading-tight text-center px-2 py-1.5 rounded">
        DIGITAL
        <br />
        GOODS
      </span>
    </div>
  );
};

export default HomeSearchBar;