"use client";
import Link from "next/link";

export default function CustomerHeader() {
  return (
    <div className="w-screen h-20 flex flex-row bg-emerald-700">
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/customer/dashboard">Dashboard</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/customer/exhibitions">Exhibitions</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/customer/bookings">Bookings</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/customer/feedback">Feedback</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/customersettings">Settings</Link>
      </div>
      <div className="m-auto">
        <button
          onClick={() => {
            try {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("myID");
            } catch {}
            window.location.href = "/login";
          }}
          className="text-white text-base px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


