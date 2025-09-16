"use client";
import React, { useEffect, useState } from "react";
import CustomerHeader from "../../../components/CustomerHeader";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = { exhibition_id: string; title: string };
type MyFeedback = {
  feedback_id: string;
  exhibition: { exhibition_id: string; title: string };
  rating: number;
  comment: string;
};

export default function CustomerFeedbackPage() {
  const [list, setList] = useState<Exhibition[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [myFeedbacks, setMyFeedbacks] = useState<MyFeedback[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(`${API_BASE_URL}/customer/exhibitions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setList(res.data || []);
        const mine = await axios.get(`${API_BASE_URL}/customer/feedbacks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyFeedbacks(mine.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submitFeedback = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const myID = localStorage.getItem("myID");
      if (!token) throw new Error("No auth token found");
      if (!myID) throw new Error("No user id found");
      await axios.post(
        `${API_BASE_URL}/customer/feedbacks`,
        {
          exhibition_id: selected,
          customer_id: myID,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Feedback submitted");
      setSelected("");
      setRating(5);
      setComment("");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateFeedback = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      const payload: any = {};
      payload.rating = rating;
      payload.comment = comment;
      await axios.put(
        `${API_BASE_URL}/customer/feedbacks/${editingId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Feedback updated");
      const mine = await axios.get(`${API_BASE_URL}/customer/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyFeedbacks(mine.data || []);
      setEditingId(null);
      setSelected("");
      setRating(5);
      setComment("");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7FFF3" }}>
      <CustomerHeader />
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Feedback</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow p-6">
              <select
                className="w-full p-3 border rounded mb-3"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Select Exhibition</option>
                {list.map((ex) => (
                  <option key={ex.exhibition_id} value={ex.exhibition_id}>
                    {ex.title}
                  </option>
                ))}
              </select>
              <input
                className="w-full p-3 border rounded mb-3"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              <textarea
                className="w-full p-3 border rounded mb-3"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {editingId ? (
                <div className="flex gap-2">
                  <button
                    onClick={updateFeedback}
                    disabled={saving || comment.trim() === ""}
                    className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setSelected("");
                      setRating(5);
                      setComment("");
                    }}
                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={submitFeedback}
                  disabled={saving || !selected || comment.trim() === ""}
                  className="px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Submitting..." : "Submit"}
                </button>
              )}
              {error && <div className="mt-3 text-red-600">{error}</div>}
              {success && <div className="mt-3 text-green-700">{success}</div>}
            </div>
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-3">My Feedback</h2>
              {myFeedbacks.length === 0 ? (
                <div className="text-gray-500">No feedback yet.</div>
              ) : (
                <ul className="space-y-3">
                  {myFeedbacks.map((f) => (
                    <li key={f.feedback_id} className="border rounded p-3">
                      <div className="font-semibold">{f.exhibition.title}</div>
                      <div className="text-sm">Rating: {f.rating}</div>
                      <div className="text-sm">{f.comment}</div>
                      <button
                        className="mt-2 px-3 py-1 text-white bg-emerald-600 rounded"
                        onClick={() => {
                          setEditingId(f.feedback_id);
                          setSelected(f.exhibition.exhibition_id);
                          setRating(f.rating);
                          setComment(f.comment);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
