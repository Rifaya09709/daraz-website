import { useEffect, useRef } from "react";
import { FaTimes, FaCreditCard, FaTruck, FaUndoAlt } from "react-icons/fa";

export type GuaranteeSection = "payment" | "delivery" | "returns";

interface GuaranteeServicesModalProps {
  open: boolean;
  onClose: () => void;
  /** which section to scroll into view when the modal opens */
  focusSection: GuaranteeSection;
}

const GuaranteeServicesModal = ({ open, onClose, focusSection }: GuaranteeServicesModalProps) => {
  const paymentRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const returnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const refMap = { payment: paymentRef, delivery: deliveryRef, returns: returnsRef };
    // Wait a tick for the modal to mount/render before scrolling
    const t = setTimeout(() => {
      refMap[focusSection].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(t);
  }, [open, focusSection]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-white border-b z-10">
          <h2 className="text-lg font-bold text-gray-900">🌿 Daraz Guarantee Services 🌿</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          <div ref={paymentRef} className="flex gap-3">
            <FaCreditCard className="text-gray-700 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We offer a wide array of convenient and secure payment options to make your
                checkout experience smooth and hassle-free. Whether you prefer credit/debit
                cards, digital wallets, bank transfers, or cash on delivery, we've got you
                covered.
              </p>
            </div>
          </div>

          <div ref={deliveryRef} className="flex gap-3">
            <FaTruck className="text-gray-700 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">On-Time Delivery</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We're committed to delivering your purchases within the promised timeframe. Our
                robust logistics network and dedicated delivery partners work tirelessly to
                ensure your items arrive on schedule, every time. You'll receive real-time
                updates so you can track your order's journey right to your doorstep.
              </p>
            </div>
          </div>

          <div ref={returnsRef} className="flex gap-3">
            <FaUndoAlt className="text-gray-700 mt-1 shrink-0" size={20} />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Free & Easy Returns</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                You can return items within the eligible period for a valid reason, with free
                and convenient drop-off/pick-up service.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm text-gray-500">
                <p>
                  <span className="font-semibold text-gray-700">14-Day Free Returns:</span> If
                  you're not satisfied, return your order for any reason — including a change of
                  mind.
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Protected Purchases:</span>{" "}
                  Transparent warranties cover defects &amp; other issues. Coverage details are
                  clearly outlined for every product.
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Seamless Refunds:</span> Once
                  your return/cancellation is approved, we initiate your refund instantly. Bank
                  processing times may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeServicesModal;