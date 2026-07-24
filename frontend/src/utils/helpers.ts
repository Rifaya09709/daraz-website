import { Product, ProductImage } from "../types/product";

export const getPrimaryImage = (images: ProductImage[]): string => {
  if (!Array.isArray(images) || images.length === 0) {
    return "/placeholder.png";
  }
  return (
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    "/placeholder.png"
  );
};

export const getFinalPrice = (product: Pick<Product, "price" | "discountPrice">) => {
  return product.discountPrice || product.price;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};