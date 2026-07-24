import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stockLeft?: number; // if set, shows "Only N left"
}

interface FlashSaleGridProps {
  products: FlashSaleProduct[];
  endsAt: Date; // when the flash sale ends — drives the countdown
}

const pad = (n: number) => n.toString().padStart(2, "0");

const useCountdown = (endsAt: Date) => {
  const [remaining, setRemaining] = useState(() => endsAt.getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(endsAt.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const clamped = Math.max(0, remaining);
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);

  return { hours, minutes, seconds, isOver: clamped === 0 };
};

const FlashSaleGrid = ({ products, endsAt }: FlashSaleGridProps) => {
  const { hours, minutes, seconds, isOver } = useCountdown(endsAt);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">⚡ Flash Sale</h2>
          {!isOver && (
            <div className="flex items-center gap-1 text-white text-xs md:text-sm font-mono">
              <span className="bg-gray-900 rounded px-1.5 py-0.5">{pad(hours)}</span>:
              <span className="bg-gray-900 rounded px-1.5 py-0.5">{pad(minutes)}</span>:
              <span className="bg-gray-900 rounded px-1.5 py-0.5">{pad(seconds)}</span>
            </div>
          )}
        </div>
        <Link to="/products?tag=flash-sale" className="text-primary text-sm font-medium">
          Shop More →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="bg-white rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
              {typeof p.stockLeft === "number" && p.stockLeft <= 10 && (
                <span className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-white text-[11px] text-center py-1">
                  Only {p.stockLeft} left
                </span>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(p.price)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(p.originalPrice)}
                </span>
                <span className="bg-rose-100 text-rose-600 text-[11px] font-semibold px-1.5 py-0.5 rounded">
                  -{p.discountPercent}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FlashSaleGrid;