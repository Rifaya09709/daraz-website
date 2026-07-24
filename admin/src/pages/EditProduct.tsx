import { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchProductById, clearSelectedProduct } from "../store/productSlice";
import { updateProduct, removeProductImage } from "../services/product.service";
import { validateProductForm } from "../utils/validators";

const categories = [
  "Mobiles",
  "Laptops",
  "Fashion",
  "Furniture",
  "Health",
  "Gaming",
  "Groceries",
  "Baby",
  "Electronics",
  "Beauty",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedProduct: product, loading } = useAppSelector(
    (state) => state.products
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: categories[0],
    subCategory: "",
    price: "",
    discountPrice: "",
    stock: "",
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  // sku is intentionally excluded from the editable form — backend
  // update route doesn't accept sku changes to avoid breaking references
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        subCategory: product.subCategory || "",
        price: String(product.price),
        discountPrice: product.discountPrice ? String(product.discountPrice) : "",
        stock: String(product.stock),
        tags: product.tags.join(", "),
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
      });
    }
  }, [product]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const existingCount = product?.images.length || 0;
    if (existingCount + newImages.length + files.length > 10) {
      setServerError("Maximum 10 images allowed per product");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Removes an already-saved image directly via API (deletes from Cloudinary too)
  const removeExistingImage = async (index: number) => {
    if (!product) return;
    if (!window.confirm("Remove this image? This cannot be undone.")) return;

    try {
      setRemovingIndex(index);
      await removeProductImage(product._id, index);
      if (id) dispatch(fetchProductById(id));
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Failed to remove image");
    } finally {
      setRemovingIndex(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!product) return;

    const validationErrors = validateProductForm({
      ...form,
      sku: product.sku, // sku not editable, but validator expects it
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("brand", form.brand.trim());
      formData.append("category", form.category);
      if (form.subCategory.trim())
        formData.append("subCategory", form.subCategory.trim());
      formData.append("price", form.price);
      if (form.discountPrice.trim())
        formData.append("discountPrice", form.discountPrice);
      formData.append("stock", form.stock);

      if (form.tags.trim()) {
        form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .forEach((tag) => formData.append("tags", tag));
      }

      if (form.seoTitle.trim()) formData.append("seoTitle", form.seoTitle.trim());
      if (form.seoDescription.trim())
        formData.append("seoDescription", form.seoDescription.trim());

      // Only sent if the admin picked new images — backend only replaces
      // images when files are present (File 14, updateProduct)
      newImages.forEach((image) => formData.append("images", image));

      await updateProduct(product._id, formData);

      navigate("/products");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-4xl">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      {newImages.length > 0 && (
        <p className="text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 mb-6">
          Uploading new images will replace ALL current images once you save.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-lg font-bold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sub Category
              </label>
              <input
                type="text"
                value={form.subCategory}
                onChange={(e) => handleChange("subCategory", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-lg font-bold">Pricing & Inventory</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                SKU (not editable)
              </label>
              <input
                type="text"
                value={product.sku}
                disabled
                className="w-full border rounded-lg p-3 outline-none bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Price (₹, optional)
              </label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => handleChange("discountPrice", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-lg font-bold">Current Images</h2>

          <div className="flex flex-wrap gap-4">
            {product.images.map((image, index) => (
              <div key={image.public_id || index} className="relative">
                <img
                  src={image.url}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                {image.isPrimary && (
                  <span className="absolute -top-2 -left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  disabled={removingIndex === index}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}

            {product.images.length === 0 && (
              <p className="text-sm text-gray-400">No images uploaded</p>
            )}
          </div>

          <h2 className="text-lg font-bold pt-2">Add New Images</h2>
          <p className="text-sm text-gray-500">
            Uploading here replaces ALL images on save (backend limitation —
            remove unwanted images above individually instead if you just want
            to trim the set).
          </p>

          <div className="flex flex-wrap gap-4">
            {newPreviews.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}

            <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary text-gray-400 hover:text-primary">
              <FaUpload size={18} />
              <span className="text-xs">Upload</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <h2 className="text-lg font-bold">SEO (optional)</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              SEO Description
            </label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
              rows={2}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>
        </div>

        {serverError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            {serverError}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:bg-gray-300"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="border border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;