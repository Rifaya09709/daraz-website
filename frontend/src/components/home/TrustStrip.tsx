import { useState } from "react";
import { FaCreditCard, FaTruck, FaUndoAlt } from "react-icons/fa";
import GuaranteeServicesModal, { GuaranteeSection } from "./GuaranteeServicesModal";

const TrustStrip = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [focusSection, setFocusSection] = useState<GuaranteeSection>("payment");

  const openModal = (section: GuaranteeSection) => {
    setFocusSection(section);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-black/70 text-white text-xs flex items-center justify-center gap-2 py-2 px-4">
        <button onClick={() => openModal("payment")} className="flex items-center gap-1.5">
          <FaCreditCard size={13} /> Safe Payment
        </button>
        <span className="text-white/40">|</span>
        <button onClick={() => openModal("delivery")} className="flex items-center gap-1.5">
          <FaTruck size={13} /> Fast Delivery
        </button>
        <span className="text-white/40">|</span>
        <button onClick={() => openModal("returns")} className="flex items-center gap-1.5">
          <FaUndoAlt size={13} /> Free Return
        </button>
      </div>

      <GuaranteeServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        focusSection={focusSection}
      />
    </>
  );
};

export default TrustStrip;