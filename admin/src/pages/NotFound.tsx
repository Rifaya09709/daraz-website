import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-5">
        <h1 className="text-8xl font-bold text-primary">404</h1>

        <h2 className="text-3xl font-bold mt-6">Page Not Found</h2>
        <p className="text-gray-500 mt-3">
          The page you're looking for doesn't exist in the admin panel.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg mt-10"
        >
          <FaHome size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;