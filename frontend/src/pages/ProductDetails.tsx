import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FaStar, FaHeart, FaShare, FaTruck, FaUndo, FaShieldAlt, FaClock, FaPlay } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchProductById, clearSelectedProduct } from "../store/productSlice";
import { addItemToCart } from "../store/cartSlice";
import { addWishlistItem } from "../store/wishlistSlice";
import { addReview, getRelatedProducts } from "../services/product.service";
import { formatCurrency } from "../utils/formatCurrency";
import { getPrimaryImage, getFinalPrice } from "../utils/helpers";
import { Product } from "../types/product";
import ProductCard from "../components/product/ProductCard";
import ChatWidget from "../components/chat/ChatWidget";

// Formats a millisecond duration as HH:MM:SS for the flash sale countdown
const formatCountdown = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

// Converts a YouTube watch/short URL into an embeddable URL
const getYouTubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const isYouTubeUrl = (url: string) => /youtu\.?be/.test(url);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedProduct: product, loading } = useAppSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);

  const [saleEndsAt] = useState(() => Date.now() + 12 * 60 * 60 * 1000);
  const [countdown, setCountdown] = useState("");

  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      getRelatedProducts(id)
        .then((res) => setRelated(res.products))
        .catch(() => {});
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    } else {
      setSelectedColor(undefined);
      setSelectedSize(undefined);
    }
    setShowVideo(false);
  }, [product?._id]);

  const getGalleryImages = (): string[] => {
    if (!product) return [];

    const variantWithImages = product.variants?.find(
      (v) => v.color === selectedColor && v.images && v.images.length > 0
    );
    if (variantWithImages?.images?.length) {
      return variantWithImages.images;
    }

    const colorTaggedImages = product.images
      ?.filter((img: any) => !img.color || img.color === selectedColor)
      .map((img) => img.url);
    if (colorTaggedImages && colorTaggedImages.length > 0) {
      return colorTaggedImages;
    }

    return product.images?.map((img) => img.url) || [];
  };

  const galleryImages = getGalleryImages();

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, product?._id]);

  useEffect(() => {
    if (!product?.isFlashSale) return;

    const timer = setInterval(() => {
      setCountdown(formatCountdown(saleEndsAt - Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, [product?.isFlashSale, saleEndsAt]);

  const uniqueColors = Array.from(
    new Set((product?.variants || []).map((v) => v.color).filter(Boolean))
  ) as string[];
  const uniqueSizes = Array.from(
    new Set((product?.variants || []).map((v) => v.size).filter(Boolean))
  ) as string[];

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product?.reviews.filter((r) => r.rating === star).length || 0,
  }));
  const maxBreakdownCount = Math.max(...ratingBreakdown.map((b) => b.count), 1);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (product) {
      dispatch(addItemToCart({ productId: product._id, quantity }));
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (product) {
      dispatch(addItemToCart({ productId: product._id, quantity }));
      navigate("/checkout");
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (product) dispatch(addWishlistItem(product._id));
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (!product || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      await addReview(product._id, reviewRating, reviewComment.trim());
      dispatch(fetchProductById(product._id));
      setReviewComment("");
      setReviewRating(5);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  const soldPercent = Math.min(
    100,
    Math.round((product.sold / (product.sold + product.stock || 1)) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-5 py-6">
      {/* Breadcrumbs */}
      <div className="text-xs md:text-sm text-gray-500 mb-5 flex flex-wrap items-center gap-1">
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        {product.subCategory && (
          <>
            <span>/</span>
            <Link
              to={`/products?category=${encodeURIComponent(
                product.category
              )}&subCategory=${encodeURIComponent(product.subCategory)}`}
              className="hover:text-primary"
            >
              {product.subCategory}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Images / Video */}
        <div className="lg:col-span-5 relative">
          <div
            className="border rounded-xl overflow-hidden bg-white relative cursor-crosshair"
            onMouseEnter={() => !showVideo && setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={!showVideo ? handleMouseMove : undefined}
          >
            {showVideo && product.video ? (
              isYouTubeUrl(product.video) ? (
                <iframe
                  src={getYouTubeEmbedUrl(product.video)}
                  className="w-full h-[400px] md:h-[480px]"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Product video"
                />
              ) : (
                <video
                  src={product.video}
                  controls
                  autoPlay
                  className="w-full h-[400px] md:h-[480px] object-contain bg-black"
                />
              )
            ) : (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[400px] md:h-[480px] object-contain"
              />
            )}

            {isZooming && !showVideo && (
              <div
                className="hidden lg:block absolute w-32 h-32 border-2 border-primary bg-white/30 pointer-events-none"
                style={{
                  left: `calc(${zoomPosition.x}% - 4rem)`,
                  top: `calc(${zoomPosition.y}% - 4rem)`,
                }}
              />
            )}
          </div>

          {isZooming && !showVideo && (
            <div
              className="hidden lg:block absolute top-0 left-full ml-4 w-[480px] h-[480px] border rounded-xl bg-white z-20 overflow-hidden shadow-lg"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "250%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.video && (
              <button
                onClick={() => setShowVideo(true)}
                className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden relative bg-black flex items-center justify-center ${
                  showVideo ? "border-primary" : "border-gray-200"
                }`}
              >
                <FaPlay className="text-white" size={18} />
              </button>
            )}

            {galleryImages.map((url, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowVideo(false);
                  setSelectedImage(url);
                }}
                className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden ${
                  !showVideo && selectedImage === url ? "border-primary" : "border-gray-200"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-4">
          {product.isFlashSale && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1 shrink-0">
                <FaClock size={10} /> FLASH SALE
              </span>
              <span className="text-red-600 text-sm font-semibold">
                Ends in {countdown || "--:--:--"}
              </span>
              <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden ml-2">
                <div
                  className="h-full bg-red-400"
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-red-500 shrink-0">
                {product.sold} sold
              </span>
            </div>
          )}

          <h1 className="text-xl md:text-2xl font-semibold leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={13}
                  className={i < Math.round(product.rating) ? "" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-gray-500">Ratings {product.totalReviews}</span>
            <button className="text-gray-400">
              <FaShare size={14} />
            </button>
            <button onClick={handleWishlist} className="text-gray-400 hover:text-red-500">
              <FaHeart size={14} />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Brand: <span className="text-gray-700">{product.brand}</span>
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(getFinalPrice(product))}
            </span>

            {product.discountPrice && (
              <>
                <span className="line-through text-gray-400">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-primary text-sm font-semibold">
                  -{product.discountPercentage}%
                </span>
              </>
            )}
          </div>

          {uniqueColors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                Color: <span className="text-gray-500">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowVideo(false);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedColor === color
                        ? "border-primary text-primary bg-secondary"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {uniqueSizes.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">
                Size: <span className="text-gray-500">{selectedSize}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {uniqueSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedSize === size
                        ? "border-primary text-primary bg-secondary"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 text-gray-600"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm mt-4">
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} available</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-white border-2 border-primary text-primary hover:bg-secondary py-3 rounded-lg font-semibold disabled:border-gray-300 disabled:text-gray-300"
            >
              Add To Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Delivery / Warranty / Seller box */}
        <div className="lg:col-span-3">
          <div className="border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500">Delivery Options</h3>

            <div className="flex gap-3">
              <FaTruck className="text-gray-400 mt-1 shrink-0" size={18} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Standard Delivery</p>
                  <p className="text-sm text-gray-600">₹99</p>
                </div>
                <p className="text-xs text-gray-500">3–5 business days</p>
              </div>
            </div>

            <hr />

            <h3 className="text-sm font-semibold text-gray-500">Return & Warranty</h3>

            <div className="flex gap-3">
              <FaUndo className="text-gray-400 mt-1 shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold">14 Days Easy Return</p>
                <p className="text-xs text-gray-500">Change of mind not applicable</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FaShieldAlt className="text-gray-400 mt-1 shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </div>

          {/* Seller Info box */}
          <div className="border rounded-xl p-5 mt-4 space-y-4">
            <div className="flex items-center gap-2 text-gray-500">
              <FaShieldAlt size={14} />
              <span className="text-xs">
                {product.warranty ? product.warranty : "Warranty not available"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="border rounded-lg p-1.5 shrink-0">
                <QRCodeSVG
                  value={`${window.location.origin}/product/${product._id}`}
                  size={80}
                />
              </div>
              <div className="text-xs text-gray-500">
                <p className="font-medium text-gray-700 mb-1">
                  Download app to enjoy exclusive discounts!
                </p>
                <p>Scan with mobile</p>
              </div>
            </div>

            <hr />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Sold by</p>
                <p className="text-sm font-semibold">
                  {product.seller?.name || "Store"}
                </p>
              </div>
              <ChatWidget
                productId={product._id}
                sellerName={product.seller?.name}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base font-bold">
                  {product.seller?.positiveRating != null
                    ? `${product.seller.positiveRating}%`
                    : "—"}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Positive Seller Ratings
                </p>
              </div>
              <div>
                <p className="text-base font-bold">
                  {product.seller?.shipOnTime != null
                    ? `${product.seller.shipOnTime}%`
                    : "—"}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Ship on Time
                </p>
              </div>
              <div>
                <p className="text-base font-bold">
                  {product.seller?.chatResponseRate || "—"}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  Chat Response Rate
                </p>
              </div>
            </div>

            <Link
              to={`/store/${product.seller?._id || ""}`}
              className="block text-center text-primary text-sm font-medium mt-1"
            >
              GO TO STORE
            </Link>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        <div className="border rounded-xl p-6">
          {product.description
            .split("\n")
            .filter((line) => line.trim().length > 0 && line.trim().length < 60)
            .length > 0 && (
            <ul className="space-y-1.5 mb-5">
              {product.description
                .split("\n")
                .filter((line) => line.trim().length > 0 && line.trim().length < 60)
                .slice(0, 6)
                .map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {line.trim()}
                  </li>
                ))}
            </ul>
          )}

          <p className="text-gray-600 leading-7 whitespace-pre-line">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">Key Features:</h3>
              <ul className="space-y-1.5">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <dt className="text-gray-400">Brand</dt>
              <dd className="font-medium">{product.brand}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Category</dt>
              <dd className="font-medium">{product.category}</dd>
            </div>
            <div>
              <dt className="text-gray-400">SKU</dt>
              <dd className="font-medium">{product.sku}</dd>
            </div>
          </dl>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 max-w-4xl">
        <h2 className="text-xl font-bold mb-6">
          Ratings & Reviews of {product.name}
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="text-center shrink-0">
            <p className="text-4xl font-bold">{product.rating.toFixed(1)}/5</p>
            <div className="flex gap-0.5 justify-center mt-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating) ? "" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {product.totalReviews} Ratings
            </p>
          </div>

          <div className="flex-1 w-full space-y-1.5">
            {ratingBreakdown.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-500">{star}</span>
                <FaStar size={11} className="text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${(count / maxBreakdownCount) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-gray-500 mb-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-5 mb-10">
            {product.reviews.map((review, i) => (
              <div key={i} className="border-b pb-5">
                <div className="flex gap-0.5 text-yellow-500 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FaStar
                      key={j}
                      size={13}
                      className={j < review.rating ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {review.name.charAt(0)}
                  {"*".repeat(Math.max(review.name.length - 1, 2))}
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Write a Review</h3>

          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={22}
                onClick={() => setReviewRating(star)}
                className={`cursor-pointer ${
                  star <= reviewRating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full border rounded-lg p-3 outline-none"
            rows={3}
          />

          <button
            onClick={handleSubmitReview}
            disabled={submittingReview || !reviewComment.trim()}
            className="mt-3 bg-primary text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>

      {/* You may also like */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;