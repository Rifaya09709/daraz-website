import { FaBolt } from "react-icons/fa";

const ActivitiesPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4">
        <FaBolt size={22} />
      </span>
      <h1 className="text-xl font-bold text-gray-900 mb-2">No activities yet</h1>
      <p className="text-sm text-gray-500">
        Your order updates, coin rewards, and account activities will show up here.
      </p>
    </div>
  );
};

export default ActivitiesPage;