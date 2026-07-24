export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const regex = /^[6-9]\d{9}$/; // Indian 10-digit mobile
  return regex.test(phone.replace(/\D/g, "").slice(-10));
};

export const isValidPincode = (pincode: string): boolean => {
  const regex = /^\d{6}$/;
  return regex.test(pincode);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";

  if (!password) errors.password = "Password is required";

  return errors;
};

export const validateRegisterForm = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) errors.name = "Name is required";

  if (!data.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(data.email)) errors.email = "Invalid email address";

  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!isValidPhone(data.phone))
    errors.phone = "Enter a valid 10-digit phone number";

  if (!data.password) errors.password = "Password is required";
  else if (!isStrongPassword(data.password))
    errors.password = "Password must be at least 6 characters";

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
};