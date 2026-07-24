export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";

  if (!password) errors.password = "Password is required";

  return errors;
};

export const validateProductForm = (data: {
  name: string;
  brand: string;
  category: string;
  sku: string;
  price: string;
  stock: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) errors.name = "Product name is required";
  if (!data.brand.trim()) errors.brand = "Brand is required";
  if (!data.category.trim()) errors.category = "Category is required";
  if (!data.sku.trim()) errors.sku = "SKU is required";

  if (!data.price.trim()) errors.price = "Price is required";
  else if (isNaN(Number(data.price)) || Number(data.price) <= 0)
    errors.price = "Enter a valid price";

  if (!data.stock.trim()) errors.stock = "Stock is required";
  else if (isNaN(Number(data.stock)) || Number(data.stock) < 0)
    errors.stock = "Enter a valid stock quantity";

  return errors;
};

export const validateCouponForm = (data: {
  code: string;
  discountValue: string;
  expiresAt: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.code.trim()) errors.code = "Coupon code is required";
  else if (!/^[A-Z0-9]+$/i.test(data.code.trim()))
    errors.code = "Coupon code should be alphanumeric only";

  if (!data.discountValue.trim())
    errors.discountValue = "Discount value is required";
  else if (isNaN(Number(data.discountValue)) || Number(data.discountValue) <= 0)
    errors.discountValue = "Enter a valid discount value";

  if (!data.expiresAt) errors.expiresAt = "Expiry date is required";
  else if (new Date(data.expiresAt) <= new Date())
    errors.expiresAt = "Expiry date must be in the future";

  return errors;
};