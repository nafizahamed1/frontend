"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AdminHeader from "../../../components/AdminHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Artist = {
  userID: string;
  fullName: string;
  email: string;
  phone?: number | string | null;
  profile_image?: string | null;
  created_at?: string;
  role?: string;
};

export default function AdminUserDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [also, setAlso] = useState<Artist | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const id = params?.id;
    if (!id) return;

    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data || {};
        const mapped: Artist = {
          userID: u.userID,
          fullName: u.fullName || u.fullname || u.name || "Unnamed",
          email: u.email,
          phone: u.phone ?? null,
          profile_image: u.profile_image || u.profile_picture || null,
          created_at: u.created_at,
          role: u.role,
        };
        setArtist(mapped);
        // extra fetch to reach count
        const res2 = await axios.get(`${API_BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlso(res2.data || null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [params]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!artist) return <div className="p-8 text-center">Artist not found</div>;

  const imgSrc = artist.profile_image
    ? `${API_BASE_URL}/uploads/users/${artist.profile_image}`
    : "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE8" }}>
      <AdminHeader />
      <main className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-amber-600 hover:underline"
        >
          ← Back
        </button>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img src={imgSrc} alt={artist.fullName} className="w-full h-72 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{artist.fullName}</h1>
            <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {artist.email}</p>
            {artist.phone && (
              <p className="text-gray-700 mb-1"><span className="font-semibold">Phone:</span> {artist.phone}</p>
            )}
            {artist.created_at && (
              <p className="text-gray-700 mb-1"><span className="font-semibold">Joined:</span> {new Date(artist.created_at).toLocaleDateString()}</p>
            )}
            {artist.role && (
              <p className="text-gray-700 mb-1"><span className="font-semibold">Role:</span> {artist.role}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


