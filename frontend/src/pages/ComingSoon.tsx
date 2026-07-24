import { Link, useLocation } from "react-router-dom";
import { FaTools } from "react-icons/fa";

const ComingSoon = () => {
  const location = useLocation();

  const titles: Record<string, string> = {
    "/seller/register": "Become a Seller",
    "/seller/dashboard": "Seller Center",
    "/seller/guide": "Selling Guide",
  };

  const title = titles[location.pathname] || "Coming Soon";

  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <FaTools className="text-primary mx-auto mb-6" size={48} />
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="text-gray-500 mb-8">
        This feature is currently under development. Check back soon!
      </p>
      <Link
        to="/"
        className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ComingSoon;