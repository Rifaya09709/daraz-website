import { FaCreditCard } from "react-icons/fa";

const PaymentOptions = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-primary mb-4">
        <FaCreditCard size={22} />
      </span>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Options</h1>
      <p className="text-sm text-gray-500">
        Manage your saved cards and payment methods here. Coming soon.
      </p>
    </div>
  );
};

export default PaymentOptions;