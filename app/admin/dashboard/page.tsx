"use client";
import AdminHeader from "../../../components/AdminHeader";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default function AdminDashboardPage() {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [edits, setEdits] = useState<
    Record<string, { title: string; description: string }>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("No auth token found");
        const [exhibitionsRes, hostsRes, adminActionsRes, usersRes] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/admin/exhibitions`, {
              headers: { Authorization: "Bearer " + token },
            }),
            axios.get(`${API_BASE_URL}/admin/all-hosts`, {
              headers: { Authorization: "Bearer " + token },
            }),
            axios.get(`${API_BASE_URL}/admin/actions`, {
              headers: { Authorization: "Bearer " + token },
            }),
            axios.get(`${API_BASE_URL}/admin/all-users`, {
              headers: { Authorization: "Bearer " + token },
            }),
          ]);
        setExhibitions(exhibitionsRes.data);
        setHosts(hostsRes.data);
        setAdminActions(adminActionsRes.data);
        setAllUsers(usersRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center p-8">Loading dashboard...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE8" }}>
      <AdminHeader />
      {/* Main Content */}
      <main className="p-8">
        {/* Top Section - Image Gallery */}
        <section
          className="rounded-lg p-8 mb-8"
          style={{ backgroundColor: "#FB8F00" }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-white mb-6">
            Welcome back, Admin! Here's a quick overview of the platform.
          </p>
        </section>

        {/* Bottom Section - Cards */}
        <section className="grid grid-cols-2 gap-8">
          {/* Upcoming Exhibitions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Exhibitions{" "}
              <span role="img" aria-label="calendar">
                📅
              </span>
            </h2>

            <ul>
              {exhibitions.slice(0, 2).map((exhibition: any) => (
                <li
                  key={exhibition.exhibition_id}
                  className="flex items-center mb-4"
                >
                  {exhibition?.cover_image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/exhibitions/${exhibition.cover_image}`}
                      alt={
                        exhibition?.title ??
                        exhibition?.exhibition_name ??
                        "Exhibition"
                      }
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/40x40"
                      alt="Exhibition"
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      {exhibition?.title ??
                        exhibition?.exhibition_name ??
                        "Untitled"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exhibition.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exhibition.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      By: {exhibition.host.username}
                    </p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        className="border p-2 rounded"
                        placeholder="Title"
                        value={
                          edits[exhibition.exhibition_id]?.title ??
                          (exhibition.title || "")
                        }
                        onChange={(e) =>
                          setEdits((prev) => ({
                            ...prev,
                            [exhibition.exhibition_id]: {
                              title: e.target.value,
                              description:
                                prev[exhibition.exhibition_id]?.description ??
                                (exhibition.description || ""),
                            },
                          }))
                        }
                      />
                      <input
                        className="border p-2 rounded"
                        placeholder="Description"
                        value={
                          edits[exhibition.exhibition_id]?.description ??
                          (exhibition.description || "")
                        }
                        onChange={(e) =>
                          setEdits((prev) => ({
                            ...prev,
                            [exhibition.exhibition_id]: {
                              title:
                                prev[exhibition.exhibition_id]?.title ??
                                (exhibition.title || ""),
                              description: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-3 py-1 text-white bg-amber-600 rounded"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const myID = localStorage.getItem("myID");
                            if (!token) throw new Error("No token");
                            const proposed = edits[
                              exhibition.exhibition_id
                            ] || {
                              title: exhibition.title || "",
                              description: exhibition.description || "",
                            };
                            const newTitle = (proposed.title ?? "").trim();
                            const newDesc = (proposed.description ?? "").trim();
                            const titleChanged =
                              newTitle !== (exhibition.title || "");
                            const descChanged =
                              newDesc !== (exhibition.description || "");
                            if (!titleChanged && !descChanged) return;
                            setUpdatingId(exhibition.exhibition_id);
                            if (titleChanged && descChanged) {
                              await axios.put(
                                `${API_BASE_URL}/admin/exhibitions/${
                                  exhibition.exhibition_id
                                }?admin_id=${myID || ""}`,
                                { title: newTitle, description: newDesc },
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                            } else if (titleChanged || descChanged) {
                              await axios.patch(
                                `${API_BASE_URL}/admin/exhibitions/${
                                  exhibition.exhibition_id
                                }?admin_id=${myID || ""}`,
                                {
                                  ...(titleChanged ? { title: newTitle } : {}),
                                  ...(descChanged
                                    ? { description: newDesc }
                                    : {}),
                                },
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                            }
                            const res = await axios.get(
                              `${API_BASE_URL}/admin/exhibitions`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setExhibitions(res.data);
                            setEdits((prev) => ({
                              ...prev,
                              [exhibition.exhibition_id]: {
                                title: newTitle,
                                description: newDesc,
                              },
                            }));
                          } catch (err: any) {
                            setError(
                              err.response?.data?.message || err.message
                            );
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                      >
                        {updatingId === exhibition.exhibition_id
                          ? "Updating..."
                          : "Update"}
                      </button>
                      <button
                        className="px-3 py-1 text-white bg-red-600 rounded"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const myID = localStorage.getItem("myID");
                            if (!token) throw new Error("No token");
                            await axios.delete(
                              `${API_BASE_URL}/admin/exhibitions/${
                                exhibition.exhibition_id
                              }?admin_id=${myID || ""}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            const res = await axios.get(
                              `${API_BASE_URL}/admin/exhibitions`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setExhibitions(res.data);
                          } catch (err: any) {
                            setError(
                              err.response?.data?.message || err.message
                            );
                          }
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Artists */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Featured Artists{" "}
              <span role="img" aria-label="artist">
                🎨
              </span>
            </h2>
            <ul>
              {hosts.slice(0, 2).map((host: any) => (
                <li key={host.userID} className="flex items-center mb-4">
                  <img
                    src={
                      host?.profile_image
                        ? `${API_BASE_URL}/uploads/users/${host.profile_image}`
                        : host?.profile_picture
                        ? `${API_BASE_URL}/uploads/users/${host.profile_picture}`
                        : "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
                    }
                    alt={host?.fullName || "Artist"}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{host?.fullName || "Host"}</p>
                    <p className="text-sm text-gray-500">Host</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
