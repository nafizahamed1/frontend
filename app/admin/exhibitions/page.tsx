import AdminHeader from "../../../components/AdminHeader";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
};

export default async function AdminPublicExhibitionsPage() {
  let list: Exhibition[] = [];
  let error: string | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}/customer/exhibitions`, {
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body || res.statusText);
    }
    list = (await res.json()) || [];
  } catch (err: any) {
    error = err?.response?.data?.message || err?.message || "Failed to load";
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EDE8" }}>
      <AdminHeader />
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Public Exhibitions (SSR)</h1>
        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 text-red-700 bg-red-50">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {list.map((ex) => {
            const imgSrc = ex.cover_image
              ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
              : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60";
            return (
              <Link
                key={ex.exhibition_id}
                href={`/admin/exhibitions/${ex.exhibition_id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={ex.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{ex.title}</h2>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {ex.description}
                    </p>
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
