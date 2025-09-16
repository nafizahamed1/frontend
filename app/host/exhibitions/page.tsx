
import Link from "next/link";
import axios from "axios";
import HostHeader from "../../../components/HostHeader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type Exhibition = {
  exhibition_id: string;
  title: string;
  description: string;
  cover_image?: string | null;
};

export default async function HostExhibitionsPage() {
  let list: Exhibition[] = [];
  let error: string | null = null;
  try {
    // SSR using public customer route (no token required)
    const res = await axios.get(`${API_BASE_URL}/customer/exhibitions`);
    list = res.data || [];
  } catch (err: any) {
    error = err.response?.data?.message || err.message;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEBFF" }}>
      <HostHeader />
      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">My Exhibitions</h1>
        {error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {list.map((ex) => {
              const imgSrc = ex.cover_image
                ? `${API_BASE_URL}/uploads/exhibitions/${ex.cover_image}`
                : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60";
              return (
                <Link key={ex.exhibition_id} href={`/host/exhibitions/${ex.exhibition_id}`} className="block">
                  <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                    <img src={imgSrc} alt={ex.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{ex.title}</h2>
                      <p className="text-gray-700 text-sm line-clamp-3">{ex.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


