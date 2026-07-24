import { FaTruck, FaClock, FaMapMarkedAlt, FaBoxOpen } from "react-icons/fa";

const zones = [
  { zone: "Metro Cities", time: "2–3 business days", fee: "₹99 (Free above ₹5,000)" },
  { zone: "Tier 2 Cities", time: "3–5 business days", fee: "₹99 (Free above ₹5,000)" },
  { zone: "Remote Areas", time: "5–7 business days", fee: "₹149" },
];

const ShippingInfo = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Shipping Information</h1>
        <p className="text-gray-500">Everything you need to know about how we get your order to you.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: <FaTruck size={26} />, title: "Fast Dispatch", desc: "Orders ship within 24 hours of confirmation" },
          { icon: <FaClock size={26} />, title: "Live Tracking", desc: "Track your order status in real time" },
          { icon: <FaMapMarkedAlt size={26} />, title: "Nationwide", desc: "We deliver across the country" },
          { icon: <FaBoxOpen size={26} />, title: "Secure Packaging", desc: "Items packed to arrive safely" },
        ].map((f) => (
          <div key={f.title} className="border rounded-xl p-6 text-center hover:shadow-md transition">
            <div className="text-primary flex justify-center mb-3">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-5">Delivery Timelines & Fees</h2>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-4 font-medium">Zone</th>
              <th className="px-6 py-4 font-medium">Estimated Delivery</th>
              <th className="px-6 py-4 font-medium">Delivery Fee</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.zone} className="border-t">
                <td className="px-6 py-4 font-medium">{z.zone}</td>
                <td className="px-6 py-4 text-gray-600">{z.time}</td>
                <td className="px-6 py-4 text-gray-600">{z.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 bg-secondary rounded-xl p-6">
        <h3 className="font-semibold mb-2">Cash on Delivery</h3>
        <p className="text-sm text-gray-600 leading-6">
          COD orders carry an additional convenience fee of 7% (capped at ₹100), collected at the time of delivery.
        </p>
      </div>
    </div>
  );
};

export default ShippingInfo;