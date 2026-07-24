import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import {
  fetchProducts,
  removeProductFromState,
} from "../store/productSlice";
import { deleteProduct } from "../services/product.service";
import { formatCurrency } from "../utils/formatCurrency";
import { getPrimaryImage, getFinalPrice } from "../utils/helpers";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading, totalPages, currentPage } = useAppSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 10, search: search || undefined }));
  }, [dispatch, page]);

  const handleSearch = () => {
    setPage(1);
    dispatch(fetchProducts({ page: 1, limit: 10, search: search || undefined }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      setError("");
      await deleteProduct(id);
      dispatch(removeProductFromState(id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <Link
          to="/products/add"
          className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-3 rounded-lg"
        >
          <FaPlus size={14} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex">
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border rounded-l-lg p-3 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-primary text-white px-6 rounded-r-lg flex items-center gap-2"
        >
          <FaSearch size={14} />
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Sold</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPrimaryImage(product.images)}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(getFinalPrice(product))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          product.stock <= 5
                            ? "text-red-600 font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.sold}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deletingId === product._id}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Prev
          </button>

          {/* Page numbers with ellipsis */}
          {(() => {
            const delta = 1;
            const pages: (number | string)[] = [];

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
              ) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
              }
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${
                    currentPage === p
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-gray-100 shadow text-gray-700"
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;