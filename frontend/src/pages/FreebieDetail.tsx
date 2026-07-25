import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { getFreebieDetail, cutFreebiePrice, claimFreebie } from "../services/freebie.service";
import SafeImage from "../components/SafeImage"; // unga actual path-ku maathunga

interface Progress {
  totalCutAmount: number;
  remaining: number;
  percentage: number;
  expiresAt: string;
  claimed: boolean;
}

const useCountdown = (expiresAt?: string) => {
  const [label, setLabel] = useState("24:00:00");

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) return setLabel("00:00:00");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLabel(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return label;
};

const FreebieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [freebie, setFreebie] = useState<any>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [lastCut, setLastCut] = useState<number | null>(null); // shows the share-result popup
  const [cutting, setCutting] = useState(false);

  const countdown = useCountdown(progress?.expiresAt);

  const load = () => {
    if (!id) return;
    getFreebieDetail(id).then((data) => {
      setFreebie(data.freebie);
      setProgress(data.progress);
    });
  };

  useEffect(load, [id]);

  const handleShare = async () => {
    if (!id || cutting) return;
    setCutting(true);
    try {
      const data = await cutFreebiePrice(id);
      setProgress(data.progress);
      setLastCut(data.cutThisTime); // triggers the "So Lucky!" popup
    } catch (err: any) {
      alert(err.response?.data?.message || "Couldn't cut the price. Try again.");
    } finally {
      setCutting(false);
    }
  };

  const handleClaim = async () => {
    if (!id) return;
    try {
      await claimFreebie(id);
      alert("🎉 Freebie claimed! Check your orders.");
      navigate("/freebies");
    } catch (err: any) {
      alert(err.response?.data?.message || "Couldn't claim.");
    }
  };

  if (!freebie || !progress) {
    return <p className="text-center py-20 text-gray-400">Loading...</p>;
  }

  const isFree = progress.remaining <= 0.01;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-500 pb-10 relative">
      <div className="px-4 pt-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <FaChevronLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">{freebie.name}</h1>
      </div>

      {/* freebie card */}
      <div className="flex flex-col items-center mt-6 px-4">
        <div className="bg-white rounded-2xl p-5 relative w-64 shadow-xl">
          <span className="absolute -top-2 -right-2 bg-yellow-300 text-purple-800 text-[10px] font-bold px-2 py-1 rotate-12 rounded">
            MY FREEBIE
          </span>
          <SafeImage
            src={freebie.image}
            alt={freebie.name}
            fallbackSeed={freebie._id}
            className="w-full h-40 object-contain"
          />
        </div>
        <p className="text-pink-300 font-bold mt-3">3K People claimed it for FREE</p>
        <p className="text-white/60 text-sm line-through">৳{freebie.originalPrice}</p>
      </div>

      {/* progress card */}
      <div className="bg-white rounded-2xl mx-4 mt-4 p-5 text-center shadow-xl">
        <p className="bg-pink-50 text-pink-600 text-sm font-semibold rounded-full py-1 px-4 inline-block mb-3">
          You Have Cut ৳{progress.totalCutAmount}
        </p>
        <h2 className="text-3xl font-extrabold text-pink-600">
          ৳{progress.remaining} <span className="text-lg text-gray-500 font-medium">Left</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Keep Cutting The Price To Get It free</p>

        <div className="relative h-3 bg-pink-100 rounded-full mt-4 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-600">
            {isFree ? "FREE 🎉" : `${progress.percentage}% FREE`}
          </span>
        </div>

        {isFree ? (
          <button
            onClick={handleClaim}
            className="w-full mt-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 rounded-full"
          >
            Claim For Free!
          </button>
        ) : (
          <button
            onClick={handleShare}
            disabled={cutting}
            className="w-full mt-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 rounded-full disabled:opacity-60"
          >
            {cutting ? "Cutting..." : "Share To Cut More Price"}
            <span className="block text-xs font-normal">Expires In {countdown}</span>
          </button>
        )}
      </div>

      {/* how to win */}
      <div className="mx-4 mt-6 text-white">
        <h3 className="text-center font-bold text-lg mb-4">How to win</h3>
        <div className="space-y-4 text-sm">
          <p><strong>Step 1:</strong> Share links to friends</p>
          <p><strong>Step 2:</strong> Invite friends to open the link to help cut the price.</p>
          <p><strong>Step 3:</strong> The cut amount is random and may vary based on product and invitee.</p>
        </div>
      </div>

      {/* "So Lucky!" popup after each cut — matches image 4/5 */}
      {lastCut !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="relative w-full max-w-sm text-center">
            <button
              onClick={() => setLastCut(null)}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-white rounded-full p-2"
            >
              <FaTimes size={18} />
            </button>

            <div className="bg-white/10 rounded-2xl p-5">
              <SafeImage
                src={freebie.image}
                alt={freebie.name}
                fallbackSeed={freebie._id}
                className="w-32 h-32 object-contain mx-auto"
              />
              <h2 className="text-white text-2xl font-extrabold mt-3">So Lucky!</h2>
              <p className="text-yellow-300 font-bold text-xl">You Have Cut ৳{lastCut}</p>

              <div className="bg-white rounded-2xl mt-4 p-4">
                <p className="text-gray-500 text-sm">
                  {isFree ? "Fully Cut!" : "Invite To Cut Remaining"}
                </p>
                {!isFree && (
                  <p className="text-pink-600 font-extrabold text-2xl">৳{progress.remaining}</p>
                )}
                <div className="relative h-2 bg-pink-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-pink-500 rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setLastCut(null);
                  if (!isFree) handleShare();
                }}
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 rounded-full"
              >
                {isFree ? "Claim For Free!" : "Cut More Price"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreebieDetail;