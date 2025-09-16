"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CustomerHeader from "../../../components/CustomerHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
  created_at?: string;
};

export default function CustomerDashboardPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<Exhibition[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(`${API_BASE_URL}/customer/exhibitions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExhibitions(res.data || []);
        // Second request: fetch recommended (for demo, same endpoint but separate call)
        const res2 = await axios.get(`${API_BASE_URL}/customer/exhibitions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommended(res2.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recent = useMemo(() => {
    const list = [...exhibitions];
    list.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
    return list.slice(0, 6);
  }, [exhibitions]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7FFF3" }}>
      <CustomerHeader />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Discover Exhibitions</h1>
          <Link href="/customer/exhibitions" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">View All</Link>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((ex) => {
              const imgSrc = ex.cover_image
                ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
                : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60";
              return (
                <div key={ex.exhibition_id} className="bg-white rounded-xl shadow overflow-hidden">
                  <img src={imgSrc} alt={ex.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{ex.title}</h2>
                    <p className="text-gray-700 text-sm line-clamp-3">{ex.description}</p>
                    <div className="mt-3 flex gap-3">
                      <Link href={`/customer/exhibitions/${ex.exhibition_id}`} className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700">View</Link>
                      <Link href={`/customer/exhibitions/${ex.exhibition_id}`} className="px-3 py-1.5 rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50">Book</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


