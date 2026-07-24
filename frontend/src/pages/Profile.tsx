import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../hooks/useAuth";
import { fetchProfile } from "../store/authSlice";
import { updateProfile, changePassword } from "../services/auth.service";
import { isValidPhone, isStrongPassword } from "../utils/validators";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [tab, setTab] = useState<"details" | "password">("details");

  // Profile form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/profile" } });
      return;
    }
    dispatch(fetchProfile());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMessage("");

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!isValidPhone(phone))
      errors.phone = "Enter a valid 10-digit phone number";

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSavingProfile(true);
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      await dispatch(fetchProfile());
      setProfileMessage("Profile updated successfully");
    } catch (err: any) {
      setProfileMessage(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";

    if (!newPassword) errors.newPassword = "New password is required";
    else if (!isStrongPassword(newPassword))
      errors.newPassword = "Password must be at least 6 characters";

    if (newPassword !== confirmNewPassword)
      errors.confirmNewPassword = "Passwords do not match";

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setPasswordMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setPasswordMessage(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center gap-4 mb-10">
        <FaUserCircle size={56} className="text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setTab("details")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold ${
            tab === "details"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Profile Details
        </button>

        <button
          onClick={() => setTab("password")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold ${
            tab === "password"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Change Password
        </button>
      </div>

      {tab === "details" ? (
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {profileErrors.name && (
              <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border rounded-lg p-3 outline-none bg-gray-100 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {profileErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>
            )}
          </div>

          {profileMessage && (
            <p
              className={`text-sm ${
                profileMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {profileMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:bg-gray-300"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
            />
            {passwordErrors.confirmNewPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.confirmNewPassword}
              </p>
            )}
          </div>

          {passwordMessage && (
            <p
              className={`text-sm ${
                passwordMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:bg-gray-300"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;