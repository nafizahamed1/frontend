"use client";
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import HostHeader from "../../../../components/HostHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function HostCreateExhibitionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const myID = localStorage.getItem("myID");
      if (!token) throw new Error("No auth token found");
      if (!myID) throw new Error("No user id found");
      const payload: any = {
        title,
        description,
        location,
        category,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        ticket_price: Number(ticketPrice),
        capacity: Number(capacity),
        host_id: myID,
        status: "approved",
      };
      const created = await axios.post(`${API_BASE_URL}/host/exhibitions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const createdId = created.data?.exhibition_id;
      if (imageFile && createdId) {
        const fd = new FormData();
        fd.append("file", imageFile);
        await axios.post(`${API_BASE_URL}/host/exhibitions/${createdId}/upload-image`, fd, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      setSuccess("Exhibition created");
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setStartDate("");
      setEndDate("");
      setTicketPrice("");
      setCapacity("");
      setImageFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEBFF" }}>
      <HostHeader />
      <main className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Exhibition</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-3 rounded-lg border" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input className="p-3 rounded-lg border" type="number" placeholder="Ticket Price" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
            <input className="p-3 rounded-lg border" type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            <input className="p-3 rounded-lg border" type="datetime-local" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input className="p-3 rounded-lg border" type="datetime-local" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <textarea className="p-3 rounded-lg border md:col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input className="p-3 rounded-lg border md:col-span-2" type="file" accept="image/*" onChange={onImageChange} />
          </div>
          <button onClick={handleCreate} disabled={saving} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Exhibition"}
          </button>
          {error && <div className="mt-3 text-red-600">{error}</div>}
          {success && <div className="mt-3 text-green-700">{success}</div>}
        </div>
      </main>
    </div>
  );
}


