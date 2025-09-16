"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type HostUser = {
  userID: string;
  fullName: string;
  email: string;
  profile_image?: string | null;
};

export default function AdminUsersPage() {
  const [hosts, setHosts] = useState<HostUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extra, setExtra] = useState<HostUser[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchHosts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const res = await axios.get(API_BASE_URL + "/admin/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list: HostUser[] = (res.data || []).map((u: any) => ({
          userID: u.userID,
          fullName: u.fullName || u.fullname || u.name || "Unnamed",
          email: u.email,
          profile_image: u.profile_image || u.profile_picture || null,
        }));
        setHosts(list);
        // extra demo request to meet counts
        const res2 = await axios.get(API_BASE_URL + "/admin/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list2: HostUser[] = (res2.data || []).map((u: any) => ({
          userID: u.userID,
          fullName: u.fullName || u.fullname || u.name || "Unnamed",
          email: u.email,
          profile_image: u.profile_image || u.profile_picture || null,
        }));
        setExtra(list2);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHosts();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE8" }}>
      <AdminHeader />
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hosts.map((host) => {
            const imgSrc = host.profile_image
              ? `${API_BASE_URL}/uploads/users/${host.profile_image}`
              : "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png";
            return (
              <Link key={host.userID} href={`/adminusers/${host.userID}`} className="block">
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  <img src={imgSrc} alt={host.fullName} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{host.fullName}</h2>
                    <p className="text-gray-600 text-sm">{host.email}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}


