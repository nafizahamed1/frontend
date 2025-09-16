"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import HostHeader from "../../../components/HostHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  status?: string;
  cover_image?: string | null;
  created_at?: string;
};

export default function HostDashboardPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(`${API_BASE_URL}/host/exhibitions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExhibitions(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = exhibitions.length;
    const approved = exhibitions.filter((e) => e.status === "approved").length;
    const pending = exhibitions.filter((e) => e.status === "pending").length;
    const rejected = exhibitions.filter((e) => e.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [exhibitions]);

  const recent = useMemo(() => {
    const list = [...exhibitions];
    list.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
    return list.slice(0, 5);
  }, [exhibitions]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEBFF" }}>
      <HostHeader />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <div className="flex gap-3">
            <Link href="/host/exhibitions" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Manage Exhibitions</Link>
            <a href="#create" className="px-4 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50">Create New</a>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-5">
                <div className="text-sm text-gray-500">Total Exhibitions</div>
                <div className="text-3xl font-bold text-indigo-700">{stats.total}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-xl font-semibold">Recent Exhibitions</h2>
                </div>
                <ul>
                  {recent.length === 0 ? (
                    <li className="p-5 text-gray-500">No exhibitions yet.</li>
                  ) : (
                    recent.map((ex) => {
                      const imgSrc = ex.cover_image
                        ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
                        : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60";
                      return (
                        <li key={ex.exhibition_id} className="flex items-center gap-4 p-4 border-t">
                          <img src={imgSrc} alt={ex.title} className="w-20 h-14 object-cover rounded" />
                          <div className="flex-1">
                            <div className="font-medium">{ex.title}</div>
                            <div className="text-sm text-gray-500 capitalize">{ex.status || 'pending'}</div>
                          </div>
                          <Link href={`/host/exhibitions/${ex.exhibition_id}`} className="text-indigo-700 hover:underline">View</Link>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow p-5" id="create">
                <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
                <ul className="space-y-3">
                  <li>
                    <Link href="/host/exhibitions/create" className="block w-full text-left px-4 py-2 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                      Create Exhibition
                    </Link>
                  </li>
                  <li>
                    <Link href="/hostsettings" className="block w-full text-left px-4 py-2 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                      Update Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/adminartists" className="block w-full text-left px-4 py-2 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                      Explore Artists
                    </Link>
                  </li>
                </ul>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Tips</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Use high-quality cover images.</li>
                    <li>Keep descriptions concise and informative.</li>
                    <li>Set realistic capacity and pricing.</li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}


