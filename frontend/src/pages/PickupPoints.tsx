import { FaMapMarkerAlt } from "react-icons/fa";

const PickupPoints = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-primary mb-4">
        <FaMapMarkerAlt size={22} />
      </span>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Pickup Points</h1>
      <p className="text-sm text-gray-500">
        Find a nearby pickup point to collect your orders. Coming soon.
      </p>
    </div>
  );
};

export default PickupPoints;