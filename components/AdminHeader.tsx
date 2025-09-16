"use client";
import Link from "next/link";
import React from "react";

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/logo.svg"
          alt="Exhibition System Logo"
          className="h-8 mr-2"
        />
        <span className="text-xl font-semibold">Exhibition System</span>
      </div>
      <nav>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/adminusers"
              className="text-gray-600 hover:text-gray-900"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/admin/adminsettings"
              className="text-gray-600 hover:text-gray-900"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/admin/exhibitions"
              className="text-gray-600 hover:text-gray-900"
            >
              Exhibitions
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("myID");
                } catch {}
                window.location.href = "/login";
              }}
              className="ml-2 px-3 py-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminHeader;
