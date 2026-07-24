import { useState, useEffect, useRef, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { registerUser, clearError, setCredentials } from "../store/authSlice";
import { sendOtp as sendOtpApi } from "../services/otp.service";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const googleBtnRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(setCredentials({ token: data.token, user: data.user }));
        navigate("/");
      } else {
        setFormErrors({ email: data.message || "Google sign-in failed" });
      }
    } catch (err) {
      console.error("Google login error:", err);
      setFormErrors({ email: "Google sign-in failed" });
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (!(window as any).google || !googleBtnRef.current) return;

      (window as any).google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
      });
    };

    if ((window as any).google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setFormErrors({ phone: "Enter a valid phone number first" });
      return;
    }

    setSendingOtp(true);
    try {
      await sendOtpApi(phone.trim());
      setOtpSent(true);
      setFormErrors((prev) => ({ ...prev, phone: "" }));
    } catch (err) {
      console.error("Send OTP failed:", err);
      setFormErrors({ phone: "Failed to send OTP. Try again." });
    } finally {
      setSendingOtp(false);
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Enter a valid email";
    }
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!otp.trim() || otp.trim().length !== 6) errors.otp = "Enter the 6-digit code";
    if (!password.trim() || password.length < 6) errors.password = "Minimum 6 characters required";
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const birthday =
      birthMonth && birthDay && birthYear
        ? `${birthYear}-${String(months.indexOf(birthMonth) + 1).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`
        : undefined;

    const result = await dispatch(
      registerUser({
        phone: phone.trim(),
        email: email.trim(),
        name: fullName.trim(),
        otp: otp.trim(),
        password,
        birthday,
        gender: gender || undefined,
        smsOptIn,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create your Daraz Account
          </h1>
          <p className="text-sm text-gray-500">
            Already member?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +916380899986"
                    className="w-full border rounded-lg p-3 pr-9 outline-none focus:border-primary"
                  />
                  {phone && (
                    <button
                      type="button"
                      onClick={() => setPhone("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMS Verification Code*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6 digits"
                    maxLength={6}
                    className="flex-1 border rounded-lg p-3 outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="text-blue-500 text-sm font-semibold px-2 whitespace-nowrap disabled:text-gray-400"
                  >
                    {sendingOtp ? "SENDING..." : otpSent ? "RESEND" : "SEND"}
                  </button>
                </div>
                {formErrors.otp && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.otp}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters with a number and a letter"
                    className="w-full border rounded-lg p-3 pr-10 outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="border rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="border rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Day</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="border rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg p-3 outline-none focus:border-primary"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full border rounded-lg p-3 outline-none focus:border-primary"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Female
                  </label>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-0.5"
                />
                I'd like to receive exclusive offers and promotions via SMS
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
              >
                {loading ? "Signing up..." : "SIGN UP"}
              </button>

              <p className="text-xs text-gray-500">
                By clicking "SIGN UP" I agree to{" "}
                <Link to="/terms" className="text-primary">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-primary">
                  Privacy Policy
                </Link>
              </p>

              <div>
                <p className="text-sm text-gray-500 mb-3">Or, sign up with</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900"
                  >
                    <span className="font-bold">f</span> Facebook
                  </button>
                  <div ref={googleBtnRef}></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;