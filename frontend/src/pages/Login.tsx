import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { loginUser, clearError } from "../store/authSlice";
import { validateLoginForm } from "../utils/validators";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const redirectTo = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, redirectTo, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const errors = validateLoginForm(email, password);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Login to continue shopping</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;