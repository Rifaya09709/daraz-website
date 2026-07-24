

import { Link } from "react-router-dom";
import { FaUndo, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

const eligible = [
  "Item received is damaged or defective",
  "Wrong item was delivered",
  "Item does not match the product description",
  "Missing parts or accessories as listed",
];

const notEligible = [
  "Change of mind after delivery",
  "Item damaged due to misuse after delivery",
  "Products marked as non-returnable on the product page",
  "Return requested after the 14-day window",
];

const Returns = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Returns & Refunds</h1>
      <p className="text-gray-500 mb-12">
        We want you to be happy with your purchase. Here's how returns work.
      </p>

      {/* Steps */}
      <div className="grid sm:grid-cols-3 gap-6 mb-14">
        <div className="border rounded-xl p-6 text-center">
          <FaUndo className="text-primary mx-auto mb-3" size={26} />
          <h3 className="font-semibold mb-1">1. Request Return</h3>
          <p className="text-sm text-gray-500">
            Contact us within 14 days of delivery with your order number
          </p>
        </div>
        <div className="border rounded-xl p-6 text-center">
          <FaCheckCircle className="text-primary mx-auto mb-3" size={26} />
          <h3 className="font-semibold mb-1">2. We Review</h3>
          <p className="text-sm text-gray-500">
            Our team verifies the issue and approves the return
          </p>
        </div>
        <div className="border rounded-xl p-6 text-center">
          <FaMoneyBillWave className="text-primary mx-auto mb-3" size={26} />
          <h3 className="font-semibold mb-1">3. Get Refunded</h3>
          <p className="text-sm text-gray-500">
            Refund is processed within 5–7 business days
          </p>
        </div>
      </div>

      {/* Eligible / Not Eligible */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <div className="border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-700">
            <FaCheckCircle /> Eligible for Return
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {eligible.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-600">
            <FaTimesCircle /> Not Eligible for Return
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {notEligible.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-red-500 shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Refund methods */}
      <div className="bg-secondary rounded-xl p-6 mb-8">
        <h3 className="font-semibold mb-2">Refund Method</h3>
        <p className="text-sm text-gray-600 leading-6">
          Refunds for prepaid orders (Card/UPI) are credited back to the
          original payment method. Refunds for Cash on Delivery orders are
          processed via bank transfer — you'll be asked for account details
          during the return process.
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-500 mb-4">Need to start a return?</p>
        <Link
          to="/orders"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Go to My Orders
        </Link>
      </div>
    </div>
  );
};

export default Returns;