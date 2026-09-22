import { useEffect, useState } from "react";

import { getMyProfile, changePassword } from "../services/authService";

const Settings = () => {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    role: "",
    department: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();

      setUser({
        full_name: data.full_name || "",
        email: data.email || "",
        role: data.role || "",
        department: data.department || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError(error.response?.data?.detail || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async () => {
    setMessage("");
    setError("");

    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (passwords.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      const data = await changePassword(
        passwords.current_password,
        passwords.new_password,
      );

      setMessage(data.message || "Password changed successfully.");

      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setShowPasswordForm(false);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Profile */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your account information.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-gray-500">Loading profile...</div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="mt-2 rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {user.full_name || "Not available"}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>

              <div className="mt-2 rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {user.email || "Not available"}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>

              <div className="mt-2 inline-flex rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                {user.role || "USER"}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>

              <div className="mt-2 rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {user.department || "Not assigned"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account security.
          </p>
        </div>

        <div className="mt-6 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>

              <p className="mt-1 text-sm text-gray-500">
                Update your account password.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowPasswordForm((previous) => !previous);

                setMessage("");
                setError("");
              }}
              className="rounded-lg border border-gray-300 cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-6 space-y-4 border-t pt-5">
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>

                <input
                  type="password"
                  name="current_password"
                  value={passwords.current_password}
                  onChange={handlePasswordInput}
                  placeholder="Enter current password"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordInput}
                  placeholder="Enter new password"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordInput}
                  placeholder="Confirm new password"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={passwordLoading}
                  className="rounded-lg bg-blue-600 px-5 cursor-pointer py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Application</h2>

          <p className="mt-1 text-sm text-gray-500">
            Information about the application.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              AI Document Workflow Platform
            </p>

            <p className="mt-1 text-sm text-gray-500">
              AI-powered document processing and intelligent data analysis.
            </p>
          </div>

          <span className="text-sm text-gray-500">v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
