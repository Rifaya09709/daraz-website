import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { getFreebies } from "../services/freebie.service";
import SafeImage from "../components/SafeImage"; // unga actual path-ku maathunga

interface Freebie {
  _id: string;
  name: string;
  image: string;
  originalPrice: number;
}

const FreebieList = () => {
  const navigate = useNavigate();
  const [freebies, setFreebies] = useState<Freebie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFreebies()
      .then((data) => setFreebies(data.freebies || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="bg-gradient-to-b from-purple-700 to-purple-500 px-4 pt-4 pb-6 relative">
        <button onClick={() => navigate(-1)} className="text-white mb-4">
          <FaChevronLeft size={20} />
        </button>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-yellow-300 font-bold text-xl">Daraz</span>
            <h1 className="text-white text-4xl font-extrabold">FREEBIE</h1>
          </div>
          <div className="flex flex-col gap-2">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Prizes Record</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Rules</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl -mt-4 relative px-4 pt-6">
        <h2 className="text-center text-pink-600 font-bold text-lg mb-4">
          ✂️ Choose Your Free Product ✂️
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : (
          <div className="divide-y">
            {freebies.map((item) => (
              <div key={item._id} className="flex items-center gap-3 py-4">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fallbackSeed={item._id}
                  className="w-20 h-20 object-cover rounded-md shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                  <div className="mt-1">
                    <span className="text-pink-600 font-bold">FREE</span>
                    <span className="text-gray-400 text-sm line-through ml-2">
                      ৳{item.originalPrice}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/freebie/${item._id}`)}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-bold px-5 py-2 rounded-full shrink-0"
                >
                  Get it!
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreebieList;