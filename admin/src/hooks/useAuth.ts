import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const { user, token, loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    dispatch,
  };
};