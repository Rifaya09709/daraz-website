import { useState, FormEvent } from "react";
import { FaTimes, FaSearch, FaCheck } from "react-icons/fa";

import { searchUnsplashPhotos, UnsplashPhoto } from "../../services/unsplash.service";

interface UnsplashPickerProps {
  onSelect: (photos: UnsplashPhoto[]) => void;
  onClose: () => void;
  maxSelectable: number;
}

const UnsplashPicker = ({ onSelect, onClose, maxSelectable }: UnsplashPickerProps) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [selected, setSelected] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSearched(true);
      const res = await searchUnsplashPhotos(query.trim());
      setPhotos(res.photos);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to search photos");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (photo: UnsplashPhoto) => {
    const isSelected = selected.some((p) => p.id === photo.id);

    if (isSelected) {
      setSelected((prev) => prev.filter((p) => p.id !== photo.id));
    } else {
      if (selected.length >= maxSelectable) {
        setError(`You can only select up to ${maxSelectable} more image(s)`);
        return;
      }
      setError("");
      setSelected((prev) => [...prev, photo]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    onSelect(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold">Choose from Unsplash</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="p-5 border-b flex gap-3">
          <input
            type="text"
            placeholder="Search e.g. sneakers, laptop, sofa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-lg p-3 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-orange-600 text-white px-5 rounded-lg flex items-center gap-2 disabled:bg-gray-300"
          >
            <FaSearch size={14} />
            Search
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm px-5 pt-3">{error}</p>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !searched ? (
            <p className="text-center text-gray-400 py-16">
              Search for product-relevant images above
            </p>
          ) : photos.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No photos found for "{query}"
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {photos.map((photo) => {
                const isSelected = selected.some((p) => p.id === photo.id);

                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => toggleSelect(photo)}
                    className="relative group"
                  >
                    <img
                      src={photo.thumbUrl}
                      alt={photo.alt}
                      className={`w-full h-28 object-cover rounded-lg border-2 ${
                        isSelected ? "border-primary" : "border-transparent"
                      }`}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 rounded-lg flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center">
                          <FaCheck size={12} />
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      by {photo.photographer}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {selected.length} of {maxSelectable} selected
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="bg-primary hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm disabled:bg-gray-300"
            >
              Add {selected.length > 0 ? `(${selected.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsplashPicker;