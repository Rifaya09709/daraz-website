import { useEffect, useState, FormEvent } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import {
  fetchCoupons,
  addCoupon,
  editCoupon,
  toggleCoupon,
  removeCoupon,
  clearCouponError,
} from "../store/couponSlice";
import { Coupon } from "../types/coupon";
import { validateCouponForm } from "../utils/validators";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/helpers";

const emptyForm = {
  code: "",
  discountType: "percentage" as "percentage" | "flat",
  discountValue: "",
  minPurchase: "",
  maxDiscount: "",
  expiresAt: "",
  usageLimit: "",
};

const Coupons = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading, saving, error } = useAppSelector(
    (state) => state.coupons
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const openCreateForm = () => {
    setForm(emptyForm);
    setFormErrors({});
    setEditingId(null);
    setShowForm(true);
    dispatch(clearCouponError());
  };

  const openEditForm = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPurchase: String(coupon.minPurchase || ""),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      expiresAt: coupon.expiresAt.split("T")[0],
      usageLimit: String(coupon.usageLimit || ""),
    });
    setFormErrors({});
    setEditingId(coupon._id);
    setShowForm(true);
    dispatch(clearCouponError());
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validateCouponForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editingId) {
      const result = await dispatch(
        editCoupon({
          id: editingId,
          data: {
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minPurchase: form.minPurchase ? Number(form.minPurchase) : undefined,
            maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
            expiresAt: form.expiresAt,
            usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          },
        })
      );
      if (editCoupon.fulfilled.match(result)) closeForm();
    } else {
      const result = await dispatch(
        addCoupon({
          code: form.code.trim(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minPurchase: form.minPurchase ? Number(form.minPurchase) : undefined,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          expiresAt: form.expiresAt,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        })
      );
      if (addCoupon.fulfilled.match(result)) closeForm();
    }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    await dispatch(toggleCoupon(id));
    setTogglingId(null);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"? This cannot be undone.`))
      return;

    setDeletingId(id);
    await dispatch(removeCoupon(id));
    setDeletingId(null);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Coupons</h1>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-3 rounded-lg"
        >
          <FaPlus size={14} />
          Create Coupon
        </button>
      </div>

      {/* Inline Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">
              {editingId ? "Edit Coupon" : "New Coupon"}
            </h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={form.code}
                disabled={!!editingId}
                onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="w-full border rounded-lg p-3 outline-none disabled:bg-gray-100 disabled:text-gray-500"
              />
              {editingId && (
                <p className="text-xs text-gray-400 mt-1">Code cannot be changed</p>
              )}
              {formErrors.code && (
                <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Type
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  handleChange("discountType", e.target.value as "percentage" | "flat")
                }
                className="w-full border rounded-lg p-3 outline-none bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => handleChange("discountValue", e.target.value)}
                placeholder={form.discountType === "percentage" ? "e.g. 10" : "e.g. 200"}
                className="w-full border rounded-lg p-3 outline-none"
              />
              {formErrors.discountValue && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.discountValue}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Min Purchase (₹, optional)
              </label>
              <input
                type="number"
                value={form.minPurchase}
                onChange={(e) => handleChange("minPurchase", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            {form.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Discount Cap (₹, optional)
                </label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => handleChange("maxDiscount", e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Usage Limit (optional)
              </label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => handleChange("usageLimit", e.target.value)}
                placeholder="Default: 1000"
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => handleChange("expiresAt", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
              {formErrors.expiresAt && (
                <p className="text-red-500 text-xs mt-1">{formErrors.expiresAt}</p>
              )}
            </div>

            {error && (
              <p className="md:col-span-3 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </p>
            )}

            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:bg-gray-300"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Coupon"
                  : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No coupons created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Discount</th>
                  <th className="px-6 py-4 font-medium">Min Purchase</th>
                  <th className="px-6 py-4 font-medium">Usage</th>
                  <th className="px-6 py-4 font-medium">Expires</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);

                  return (
                    <tr key={coupon._id} className="border-t">
                      <td className="px-6 py-4 font-semibold">{coupon.code}</td>
                      <td className="px-6 py-4">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)}
                        {coupon.maxDiscount && (
                          <span className="text-xs text-gray-400 block">
                            up to {formatCurrency(coupon.maxDiscount)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {coupon.minPurchase
                          ? formatCurrency(coupon.minPurchase)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </td>
                      <td className="px-6 py-4">
                        <span className={expired ? "text-red-500" : "text-gray-600"}>
                          {formatDate(coupon.expiresAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(coupon._id)}
                          disabled={togglingId === coupon._id}
                          className={`px-3 py-1 rounded-full text-xs font-semibold disabled:opacity-50 ${
                            coupon.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditForm(coupon)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id, coupon.code)}
                            disabled={deletingId === coupon._id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;