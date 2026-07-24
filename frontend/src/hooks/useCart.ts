import { useAppDispatch, useAppSelector } from "./useAuth";

export const useCart = () => {
  const dispatch = useAppDispatch();

  const { items, subtotal, totalItems, discount, couponCode, loading, error } =
    useAppSelector((state) => state.cart);

  return {
    items,
    subtotal,
    totalItems,
    discount,
    couponCode,
    total: subtotal - discount,
    loading,
    error,
    dispatch,
  };
};