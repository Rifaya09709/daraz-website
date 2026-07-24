import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

export interface DealProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  discountPercent: number;
  badge?: string; // small top-left tag, e.g. brand name
}

interface DailyDealsRowProps {
  title: string;
  products: DealProduct[];
  freeGift?: boolean;
}

const DailyDealsRow = ({ title, products, freeGift }: DailyDealsRowProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        <Link to="/products?tag=daily-deals" className="text-primary text-sm font-medium">
          Shop Now{freeGift ? " | Free Gift!" : ""} →
        </Link>
      </div>

      <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="w-36 md:w-44 shrink-0 bg-white rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
              {p.badge && (
                <span className="absolute top-1.5 left-1.5 bg-gray-900/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {p.badge}
                </span>
              )}
              <span className="absolute bottom-1.5 right-1.5 bg-amber-400 text-gray-900 text-[11px] font-bold px-1.5 py-0.5 rounded">
                -{p.discountPercent}%
              </span>
            </div>
            <div className="p-2.5">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DailyDealsRow;