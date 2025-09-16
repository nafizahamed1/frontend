"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AdminHeader from "../../../../components/AdminHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
  host?: {
    username: string;
  };
  start_date?: string;
  end_date?: string;
};

export default function AdminExhibitionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await axios.get(
          `${API_BASE_URL}/admin/exhibitions/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setExhibition(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load exhibition"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE8" }}>
      <AdminHeader />
      <main className="p-8 max-w-4xl mx-auto">
        <Link
          href="/admin/exhibitions"
          className="mb-6 inline-block text-amber-700 hover:underline"
        >
          ← Back to Exhibitions
        </Link>

        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 rounded border border-red-200 text-red-700 bg-red-50">
            {error}
          </div>
        ) : !exhibition ? (
          <div className="p-8 text-center">Exhibition not found</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img
              src={
                exhibition.cover_image
                  ? `${API_BASE_URL}/uploads/exhibitions/${exhibition.cover_image}`
                  : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60"
              }
              alt={exhibition.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{exhibition.title}</h1>

              {exhibition.host && (
                <p className="text-amber-600 mb-4">
                  Hosted by: {exhibition.host.username}
                </p>
              )}

              {exhibition.start_date && exhibition.end_date && (
                <p className="text-gray-600 mb-4">
                  {new Date(exhibition.start_date).toLocaleDateString()} -{" "}
                  {new Date(exhibition.end_date).toLocaleDateString()}
                </p>
              )}

              <p className="text-gray-700 whitespace-pre-wrap">
                {exhibition.description}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
