import { FaStar } from "react-icons/fa";

const Reviews = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-primary mb-4">
        <FaStar size={22} />
      </span>
      <h1 className="text-xl font-bold text-gray-900 mb-2">My Reviews</h1>
      <p className="text-sm text-gray-500">
        Reviews you've written for past orders will show up here.
      </p>
    </div>
  );
};

export default Reviews;