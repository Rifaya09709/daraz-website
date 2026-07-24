import { FaShieldAlt, FaTools, FaExclamationCircle } from "react-icons/fa";

const WarrantyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Warranty Policy</h1>
      <p className="text-gray-500 mb-12">
        Coverage details vary by product and brand. Here's what you need to know.
      </p>

      <div className="space-y-8">
        <div className="flex gap-4">
          <FaShieldAlt className="text-primary shrink-0 mt-1" size={22} />
          <div>
            <h2 className="text-lg font-semibold mb-2">Manufacturer Warranty</h2>
            <p className="text-gray-600 leading-7">
              Most electronics and appliances come with a manufacturer's warranty, typically ranging from 6 months to 2 years. Warranty terms are listed on each product page where applicable.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaTools className="text-primary shrink-0 mt-1" size={22} />
          <div>
            <h2 className="text-lg font-semibold mb-2">Claiming a Warranty</h2>
            <p className="text-gray-600 leading-7">
              Keep your invoice and order confirmation safe. To claim a warranty, contact our support team with your order number and a description of the issue — we'll guide you to the manufacturer's service center or process it directly if we're the authorized provider.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <FaExclamationCircle className="text-primary shrink-0 mt-1" size={22} />
          <div>
            <h2 className="text-lg font-semibold mb-2">What's Not Covered</h2>
            <p className="text-gray-600 leading-7">
              Physical damage, water damage, unauthorized repairs, and normal wear and tear are generally not covered under warranty. Please check individual product listings for specific exclusions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;