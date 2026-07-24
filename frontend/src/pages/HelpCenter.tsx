import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I track my order?",
    a: "Go to My Orders from your account menu, select the order you want to track, and view real-time status updates including tracking ID.",
  },
  {
    q: "How do I return a product?",
    a: "Items are eligible for return within 14 days of delivery. Go to My Orders, select the item, and click Cancel Order (before delivery) or contact support for a return after delivery.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Cash on Delivery (COD), Credit/Debit Cards, and UPI.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days depending on your location.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, orders can be cancelled anytime before they are marked as Delivered from the My Orders page.",
  },
  {
    q: "How do I become a seller?",
    a: "Click Sell On Daraz in the footer or header to register as a seller and start listing products.",
  },
];

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl font-bold mb-3">Help Center</h1>
      <p className="text-gray-500 mb-10">
        Find answers to common questions below, or{" "}
        <Link to="/contact" className="text-primary underline">
          contact our support team
        </Link>
        .
      </p>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="border-b pb-6">
            <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
            <p className="text-gray-600 leading-7">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;