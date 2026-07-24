import { Product, ProductImage } from "../types/product";

export const getPrimaryImage = (images: ProductImage[]): string => {
  return (
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    "/placeholder.png"
  );
};

export const getFinalPrice = (
  product: Pick<Product, "price" | "discountPrice">
) => {
  return product.discountPrice || product.price;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getSellerName = (
  seller: Product["seller"]
): string => {
  return typeof seller === "string" ? "—" : seller.name;
};