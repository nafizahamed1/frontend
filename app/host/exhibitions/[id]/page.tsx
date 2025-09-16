"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import HostHeader from "../../../../components/HostHeader";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
};

type ExhibitionStats = {
  totalTickets: number;
  totalRevenue: number;
  feedbackCount: number;
  avgRating: number;
};

export default function HostExhibitionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [ex, setEx] = useState<Exhibition | null>(null);
  const [stats, setStats] = useState<ExhibitionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        const [exRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/host/exhibitions/${id}` , {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/host/exhibitions/${id}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setEx(exRes.data || null);
        setStats(statsRes.data || null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || err?.message || "Failed to load"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const startEdit = () => {
    if (!ex) return;
    setEditTitle(ex.title || "");
    setEditDescription(ex.description || "");
    setCoverFile(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
    setCoverFile(null);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const saveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ex) return;
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      if (coverFile) {
        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("description", editDescription);
        formData.append("cover_image", coverFile);

        await axios.patch(
          `${API_BASE_URL}/host/exhibitions/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        const payload = { title: editTitle, description: editDescription };
        const changedTitle = (ex?.title || "") !== editTitle.trim();
        const changedDesc = (ex?.description || "") !== editDescription.trim();
        const isFullUpdate = changedTitle && changedDesc; // both fields changed → treat as full replacement
        if (isFullUpdate) {
          await axios.put(
            `${API_BASE_URL}/host/exhibitions/${id}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.patch(
            `${API_BASE_URL}/host/exhibitions/${id}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      const exRes = await axios.get(
        `${API_BASE_URL}/host/exhibitions/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEx(exRes.data || null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Update failed");
      console.error("update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const removeExhibition = async () => {
    if (!confirm("Delete this exhibition? This action cannot be undone."))
      return;
    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      await axios.delete(`${API_BASE_URL}/host/exhibitions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/host/exhibitions");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Delete failed");
      console.error("delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEBFF" }}>
      <HostHeader />
      <main className="p-8 max-w-4xl mx-auto">
        <Link
          href="/host/exhibitions"
          className="mb-6 inline-block text-indigo-700 hover:underline"
        >
          ← Back
        </Link>
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : error ? (
          <div className="p-6 rounded border border-red-200 text-red-700 bg-red-50">
            {error}
          </div>
        ) : !ex ? (
          <div className="p-8 text-center">Not found</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src={
                ex.cover_image
                  ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
                  : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60"
              }
              alt={ex.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold mb-2">{ex.title}</h1>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={startEdit}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={removeExhibition}
                        disabled={deleting}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <>
                  <p className="text-gray-700">{ex.description}</p>
                  {stats && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">
                          Total Tickets
                        </div>
                        <div className="text-2xl font-semibold text-indigo-700">
                          {stats.totalTickets}
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">
                          Total Revenue
                        </div>
                        <div className="text-2xl font-semibold text-indigo-700">
                          {stats.totalRevenue}
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">
                          Feedback Count
                        </div>
                        <div className="text-2xl font-semibold text-indigo-700">
                          {stats.feedbackCount}
                        </div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600">
                          Average Rating
                        </div>
                        <div className="text-2xl font-semibold text-indigo-700">
                          {stats.avgRating.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={saveEdit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cover Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="mt-2"
                    />
                    {coverFile && (
                      <div className="mt-2 text-sm text-gray-600">
                        {coverFile.name}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
