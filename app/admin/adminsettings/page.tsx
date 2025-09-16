"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import AdminHeader from "../../../components/AdminHeader";
import HostHeader from "../../../components/HostHeader";
import CustomerHeader from "../../../components/CustomerHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState(""); // NEW
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPut, setSavingPut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const myID =
    typeof window !== "undefined" ? localStorage.getItem("myID") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        if (!myID) throw new Error("No user id found");
        const res = await axios.get(API_BASE_URL + "/users/" + myID, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // backend field names may vary; try common variants
        const fullName =
          res.data.fullname ||
          res.data.fullName ||
          res.data.fullName ||
          res.data.name ||
          "";
        const phone =
          res.data.phone || res.data.phone_number || res.data.phoneNumber || "";

        setAdmin(res.data);
        const serverImageName =
          res.data.profile_image || res.data.profile_picture || null;
        setProfilePreview(
          serverImageName
            ? `${API_BASE_URL}/uploads/users/${serverImageName}`
            : null
        );
        // keep inputs empty so placeholders show current info
        setUsernameInput("");
        setEmailInput("");
        setFullNameInput("");
        setPhoneInput("");
        setPasswordInput(""); // NEW: clear password field
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [token, myID]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!token) throw new Error("No auth token found");
      if (!myID) throw new Error("No user id found");
      const file = new FormData();
      file.append("file", selectedFile);
      const res = await axios.post(
        API_BASE_URL + "/users/" + myID + "/upload-image",
        file,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const uploadedName = res.data.profile_image || res.data.profile_picture;
      if (uploadedName) {
        setProfilePreview(`${API_BASE_URL}/uploads/users/${uploadedName}`);
      }
      setSuccess("Profile picture updated");
      setAdmin((prev: any) => ({
        ...prev,
        profile_picture: res.data.profile_picture || prev?.profile_picture,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!token) throw new Error("No auth token found");
      if (!myID) throw new Error("No user id found");

      // use inputs if provided, otherwise keep existing admin values
      const payload: any = {
        // username may represent fullname in your backend, keep both fields support
        ...(usernameInput.trim() !== "" && { fullName: usernameInput.trim() }),
        ...(emailInput.trim() !== "" && { email: emailInput.trim() }),
        ...(phoneInput.trim() !== "" && { phone: phoneInput.trim() }),
        ...(passwordInput.trim() !== "" && { password: passwordInput.trim() }), // NEW
      };

      // If backend treats username as fullname and user updated fullName but didn't touch username,
      // copy fullName into username so both stay consistent.

      // If no fields to update, skip request
      if (Object.keys(payload).length === 0) {
        setSuccess("No changes to save");
        setSaving(false);
        return;
      }

      await axios.patch(API_BASE_URL + "/users/" + myID, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Profile updated");
      setAdmin((prev: any) => ({ ...prev, ...payload }));
      setUsernameInput("");
      setEmailInput("");
      setPhoneInput("");
      setPasswordInput(""); // clear password input after save
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    setDeletingAccount(true);
    setError(null);
    setSuccess(null);
    try {
      if (!token) throw new Error("No auth token found");
      if (!myID) throw new Error("No user id found");
      await axios.delete(API_BASE_URL + "/users/" + myID, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setDeletingAccount(false);
    }
  };

  // Image src is derived from profilePreview (either a local object URL from file input
  // or the server static URL built from the stored filename)

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const HeaderComp =
    role === "host"
      ? HostHeader
      : role === "customer"
      ? CustomerHeader
      : AdminHeader;
  const bgColor =
    role === "host" ? "#ECEBFF" : role === "customer" ? "#E7FFF3" : "#F2EDE8";
  const title =
    role === "host"
      ? "Host Settings"
      : role === "customer"
      ? "Customer Settings"
      : "Admin Settings";

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <HeaderComp />
      <main className="p-8 flex justify-center">
        <div className="w-full max-w-2xl bg-amber-50 rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

          <div className="flex flex-col items-center mb-6">
            <img
              src={
                profilePreview ||
                "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-3"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || saving}
              className="px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50"
            >
              {saving ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          <form onSubmit={handleSave} className="flex flex-col">
            <label className="mb-4">
              Username
              <input
                type="text"
                placeholder={admin?.fullName || "username"}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
                disabled={saving}
              />
            </label>

            <label className="mb-4">
              Email
              <input
                type="email"
                placeholder={admin?.email || "email"}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
                disabled={saving}
              />
            </label>

            <label className="mb-4">
              Phone
              <input
                type="tel"
                placeholder={admin?.phone || "Phone"}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
                disabled={saving}
              />
            </label>

            <label className="mb-4">
              Password
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
                disabled={saving}
              />
            </label>

            <div className="flex justify-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>

          {success && (
            <div className="mt-4 text-center text-green-600">{success}</div>
          )}
          {error && (
            <div className="mt-4 text-center text-red-500">{error}</div>
          )}
        </div>
      </main>
    </div>
  );
}
