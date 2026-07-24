
import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { emptyCart } from "../store/cartSlice";
import { payWithCard } from "../services/payment.service";
import { formatCurrency } from "../utils/formatCurrency";

// "4111111111111111" -> "4111 1111 1111 1111" maari format pண்ணும்
const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

// "1225" -> "12/25" maari format pண்ணும்
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Checkout page-la irundhu route state-mூலம் varum data
  const amount: number = location.state?.amount || 0;
  const orderId: string | undefined = location.state?.orderId;
  const itemCount: number = location.state?.itemCount || 1;

  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [serverError, setServerError] = useState("");

  const rawDigits = cardNumber.replace(/\s/g, "");

  // Form validate pண்ணும் function
  const validate = () => {
    const next: Record<string, string> = {};
    if (rawDigits.length !== 16) next.cardNumber = "Enter a valid 16-digit card number";
    if (!cardName.trim()) next.cardName = "Enter the name on the card";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) next.expiry = "Enter expiry as MM/YY";
    if (!/^\d{3,4}$/.test(cvv)) next.cvv = "Enter a valid CVV";
    return next;
  };

  // Pay Now button click pண்ணும்போது
  const handlePayNow = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setProcessing(true);
    try {
      const [expMonth, expYear] = expiry.split("/");
      const res = await payWithCard({
        orderId,
        amount,
        cardNumber: rawDigits,
        cardName: cardName.trim(),
        expMonth,
        expYear,
        cvv,
        saveCard,
      });

      // Payment success ஆனதுக்கு அப்புறம் தான் cart empty pண்ணனும்
      await dispatch(emptyCart());

      navigate("/order-success", { state: { order: res.order } });
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-lg font-semibold mb-1">Secure Payment</h2>
      <p className="text-sm text-gray-400 mb-6">Pay securely with your debit or credit card</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side: card form */}
        <div className="flex-1">
          <form onSubmit={handlePayNow} className="bg-white rounded-lg border p-6 max-w-md">
            {/* Card brand + provider badges */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold">
                  Mastercard
                </div>
                <div className="px-3 py-1.5 rounded bg-blue-700 text-white text-xs font-bold italic">
                  VISA
                </div>
                <div className="px-3 py-1.5 rounded bg-blue-900 text-white text-xs font-bold">
                  UnionPay
                </div>
              </div>
              <span className="text-xs text-gray-400">🔒 Secured</span>
            </div>

            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">
                <span className="text-red-500">*</span> Card number
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="w-full border rounded p-3 outline-none focus:border-primary"
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1">
                <span className="text-red-500">*</span> Name on card
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full border rounded p-3 outline-none focus:border-primary"
              />
              {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Expiry date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full border rounded p-3 outline-none focus:border-primary"
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  <span className="text-red-500">*</span> CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="CVV"
                  maxLength={4}
                  className="w-full border rounded p-3 outline-none focus:border-primary"
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="mt-1"
              />
              <span>
                Save Card
                <br />
                <span className="text-xs text-gray-400">
                  We will save this card for your convenience. You can remove it later in Account settings.
                </span>
              </span>
            </label>

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
            >
              {processing ? "Processing..." : `Pay ${formatCurrency(amount)}`}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Payments are processed securely
            </p>
          </form>
        </div>

        {/* Right side: Order Summary */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white border rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal ({itemCount} items and shipping fee included)</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 border-t pt-3 mt-3">
              <span>Total Amount</span>
              <span className="text-primary">{formatCurrency(amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;