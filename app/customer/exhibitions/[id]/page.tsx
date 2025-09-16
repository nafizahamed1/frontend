"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CustomerHeader from "../../../../components/CustomerHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
};

export default function CustomerExhibitionDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [ex, setEx] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<string>("1");
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!id) return;
    const fetchOne = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(`${API_BASE_URL}/customer/exhibitions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEx(res.data || null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!ex) return <div className="p-8 text-center">Not found</div>;

  const imgSrc = ex.cover_image
    ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
    : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7FFF3" }}>
      <CustomerHeader />
      <main className="p-8 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-emerald-700 hover:underline">← Back</button>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img src={imgSrc} alt={ex.title} className="w-full h-80 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{ex.title}</h1>
            <p className="text-gray-700">{ex.description}</p>
            <div className="mt-6 p-4 border rounded-lg bg-emerald-50">
              <h2 className="text-lg font-semibold mb-2">Book Tickets</h2>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  className="w-28 p-2 rounded border"
                />
                <button
                  onClick={async () => {
                    try {
                      setBookingLoading(true);
                      setBookingMsg(null);
                      const token = localStorage.getItem("token");
                      const myID = localStorage.getItem("myID");
                      if (!token) throw new Error("No auth token found");
                      if (!myID) throw new Error("No user id found");
                      const body = {
                        exhibition_id: id,
                        customer_id: myID,
                        tickets_booked: Math.max(1, parseInt(tickets || "1", 10)),
                      };
                      await axios.post(`${API_BASE_URL}/customer/bookings`, body, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setBookingMsg("Booking successful. Payment pending.");
                    } catch (err: any) {
                      setBookingMsg(err.response?.data?.message || err.message || "Booking failed");
                    } finally {
                      setBookingLoading(false);
                    }
                  }}
                  disabled={bookingLoading}
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              </div>
              {bookingMsg && (
                <div className="mt-3 text-sm text-emerald-800">{bookingMsg}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


