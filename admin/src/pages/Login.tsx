import { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { loginAdmin, clearError } from "../store/authSlice";
import { validateLoginForm } from "../utils/validators";

const Login = () => {
  const dispatch = useAppDispatch();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const errors = validateLoginForm(email, password);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(loginAdmin({ email, password }));
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            DARAZ <span className="text-primary">Admin</span>
          </h1>
          <p className="text-gray-500 mt-2">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@darazclone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:border-primary"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:border-primary"
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;