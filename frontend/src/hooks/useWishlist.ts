import { useAppDispatch, useAppSelector } from "./useAuth";

export const useWishlist = () => {
  const dispatch = useAppDispatch();

  const { items, loading, error } = useAppSelector((state) => state.wishlist);

  return {
    items,
    count: items.length,
    loading,
    error,
    dispatch,
  };
};