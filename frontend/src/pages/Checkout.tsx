import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchCart, emptyCart } from "../store/cartSlice";
import { placeOrder, ShippingAddress } from "../services/order.service";
import { formatCurrency } from "../utils/formatCurrency";
import { isValidPhone, isValidPincode } from "../utils/validators";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, subtotal, discount, loading } = useAppSelector(
    (state) => state.cart
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "UPI">(
    "COD"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate("/cart");
    }
  }, [items, loading, navigate]);

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!isValidPhone(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";

    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!isValidPincode(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const delivery = subtotal - discount > 5000 ? 0 : 99;
  const total = subtotal - discount + delivery;

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    try {
      setPlacing(true);
      setServerError("");

      const response = await placeOrder({
        shippingAddress: address,
        paymentMethod,
      });

      // Card select pண்ணா -> payment page-ku pogum (card details vaangi charge pண்ணும்)
      if (paymentMethod === "CARD") {
        navigate("/payment", {
          state: {
            amount: response.order.totalAmount,
            orderId: response.order._id,
            itemCount: items.length,
          },
        });
        return; // idhu miss pண்ணாதீங்க - illana kீழே cart empty aagi order-success-kum pogum
      }

      // COD / UPI -> direct order success
      await dispatch(emptyCart());
      navigate("/order-success", { state: { order: response.order } });
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Address + Payment */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Shipping Address</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Address"
                  value={address.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value="India"
                  disabled
                  className="w-full border rounded-lg p-3 outline-none bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Payment Method</h2>

            <div className="space-y-3">
              {(["COD", "UPI", "CARD"] as const).map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === method ? "border-primary bg-secondary" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>
                    {method === "COD"
                      ? "Cash on Delivery"
                      : method === "UPI"
                      ? "UPI"
                      : "Credit / Debit Card"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

          <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product} className="flex justify-between text-sm">
                <span className="line-clamp-1">
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between mb-3 text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between mb-3">
            <span>Delivery</span>
            <span>{delivery === 0 ? "FREE" : formatCurrency(delivery)}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          {serverError && (
            <p className="text-red-500 text-sm mb-3">{serverError}</p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;