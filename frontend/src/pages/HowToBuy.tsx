import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaCreditCard, FaTruck } from "react-icons/fa";

const steps = [
  {
    icon: <FaSearch size={28} />,
    title: "1. Find What You Need",
    desc: "Browse categories or search for products directly using the search bar.",
  },
  {
    icon: <FaShoppingCart size={28} />,
    title: "2. Add To Cart",
    desc: "Select the product you like and add it to your cart, or buy it instantly with Buy Now.",
  },
  {
    icon: <FaCreditCard size={28} />,
    title: "3. Checkout & Pay",
    desc: "Enter your shipping address and choose a payment method — Cash on Delivery, Card, or UPI.",
  },
  {
    icon: <FaTruck size={28} />,
    title: "4. Track & Receive",
    desc: "Track your order status from My Orders until it's delivered to your doorstep.",
  },
];

const HowToBuy = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl font-bold mb-10 text-center">How to Buy</h1>

      <div className="grid sm:grid-cols-2 gap-8">
        {steps.map((step) => (
          <div key={step.title} className="border rounded-xl p-6 text-center">
            <div className="text-primary flex justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-6">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default HowToBuy;