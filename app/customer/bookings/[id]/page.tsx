"use client";
import React, { useEffect, useState } from "react";
import CustomerHeader from "../../../../components/CustomerHeader";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Booking = {
  booking_id: string;
  tickets_booked: number;
  total_price: number;
  booking_date: string;
};

export default function CustomerBookingDetails() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketsInput, setTicketsInput] = useState<string>("1");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Not logged in: redirect to login
          window.location.href = "/login";
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/customer/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data || null);
        setTicketsInput(String(res.data?.tickets_booked ?? "1"));
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          setError("Unauthorized. Please log in as a customer.");
        } else {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7FFF3" }}>
      <CustomerHeader />
      <main className="p-8 max-w-3xl mx-auto">
        <Link
          href="/customer/exhibitions"
          className="mb-6 inline-block text-emerald-700 hover:underline"
        >
          ← Back
        </Link>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !data ? (
          <div>Not found</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-2xl font-bold mb-2">
              Booking #{data.booking_id}
            </h1>
            <p className="text-gray-700">Tickets: {data.tickets_booked}</p>
            <p className="text-gray-700">
              Total: {Number(data.total_price).toFixed(2)}
            </p>
            <p className="text-gray-700">
              Date: {new Date(data.booking_date).toLocaleString()}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={ticketsInput}
                onChange={(e) => setTicketsInput(e.target.value)}
                className="w-28 p-2 rounded border"
              />
              <button
                onClick={async () => {
                  try {
                    setUpdating(true);
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No auth token found");
                    const newTickets = Math.max(
                      1,
                      parseInt(ticketsInput || "1", 10)
                    );
                    const titleChanged = newTickets !== data.tickets_booked;
                    if (!titleChanged) return;
                    // Only partial field changes here → PATCH is appropriate
                    const body = { tickets_booked: newTickets };
                    await axios.patch(
                      `${API_BASE_URL}/customer/bookings/${id}`,
                      body,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const res = await axios.get(
                      `${API_BASE_URL}/customer/bookings/${id}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setData(res.data || null);
                  } catch (err: any) {
                    setError(err.response?.data?.message || err.message);
                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating}
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Cancel this booking?")) return;
                  try {
                    setDeleting(true);
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No auth token found");
                    await axios.delete(
                      `${API_BASE_URL}/customer/bookings/${id}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    window.location.href = "/customer/bookings";
                  } catch (err: any) {
                    setError(err.response?.data?.message || err.message);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
