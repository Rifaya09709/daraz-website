import { Link } from "react-router-dom";

interface TopRankingChipsProps {
  categories: string[];
}

const TopRankingChips = ({ categories }: TopRankingChipsProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Top <span className="text-primary">Ranking</span>
        </h2>
        <Link to="/rankings" className="text-primary text-sm font-medium">
          Discover More Rankings →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <Link
            key={c}
            to={`/products?category=${encodeURIComponent(c)}`}
            className="shrink-0 bg-orange-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-md hover:bg-orange-100 transition-colors"
          >
            {c}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopRankingChips;