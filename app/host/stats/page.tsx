"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import HostHeader from "../../../components/HostHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
};

export default function HostStatsPage() {
  const [error, setError] = useState<string | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/host/exhibitions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setExhibitions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchData();
  }, []);

  const total = exhibitions.length;
  const recent = exhibitions.slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEBFF" }}>
      <HostHeader />
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Host Stats</h1>
        {error ? (
          <div className="p-4 text-red-600">Error: {error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-sm text-gray-500">Total Exhibitions</div>
                <div className="text-3xl font-bold text-indigo-700">
                  {total}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-3">Recent Exhibitions</h2>
              <ul>
                {recent.map((ex: Exhibition) => (
                  <li
                    key={ex.exhibition_id}
                    className="py-2 border-b last:border-none"
                  >
                    {ex.title}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
