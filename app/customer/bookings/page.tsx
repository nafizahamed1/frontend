"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomerHeader from "../../../components/CustomerHeader";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Booking = {
  booking_id: string;
  tickets_booked: number;
  total_price: number;
  booking_date: string;
};

export default function CustomerBookingsIndexPage() {
  const [bookingId, setBookingId] = useState("");
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        // Attempt to fetch all customer bookings; if backend lacks this route, show message
        const res = await axios.get(`${API_BASE_URL}/customer/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setList(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = bookingId.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) => b.booking_id.toLowerCase().includes(q));
  }, [bookingId, list]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7FFF3" }}>
      <CustomerHeader />
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Bookings</h1>
        <p className="text-gray-700 mb-4">Search your bookings or open a booking by ID.</p>
        <div className="flex gap-3">
          <input
            className="flex-1 p-3 border rounded"
            placeholder="Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button
            onClick={() => {
              if (bookingId.trim() !== "") router.push(`/customer/bookings/${bookingId.trim()}`);
            }}
            className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            View
          </button>
        </div>
        {loading ? (
          <div className="mt-6">Loading...</div>
        ) : error ? (
          <div className="mt-6 text-red-600">{error}</div>
        ) : (
          <div className="mt-6 bg-white rounded-xl shadow divide-y">
            {filtered.length === 0 ? (
              <div className="p-4 text-gray-500">No bookings found.</div>
            ) : (
              filtered.map((b) => (
                <button
                  key={b.booking_id}
                  onClick={() => router.push(`/customer/bookings/${b.booking_id}`)}
                  className="w-full text-left p-4 hover:bg-emerald-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Booking #{b.booking_id}</div>
                      <div className="text-sm text-gray-600">{new Date(b.booking_date).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-700">
                      Tickets: {b.tickets_booked} • Total: {Number(b.total_price).toFixed(2)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}


