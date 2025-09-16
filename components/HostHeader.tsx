"use client";
import Link from "next/link";

export default function HostHeader() {
  return (
    <div className="w-screen h-20 flex flex-row bg-indigo-700">
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/host/dashboard">Host Dashboard</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/host/exhibitions">My Exhibitions</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/host/stats">Stats</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/hostsettings">Settings</Link>
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
          className="text-white text-base px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


