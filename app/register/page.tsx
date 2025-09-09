"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Blueish, professional Exhibition Registration (Customer) aligned to your backend
// Endpoint: POST /customer/bookings (requires Bearer JWT with role "customer")
// Validation rules (teacher):
// - Full name: letters, spaces, hyphens, apostrophes only (2-50)
// - Age: number between 13 and 120
// - Exhibition ID: UUID
// - Tickets: positive integer 1-20
// - Terms: must be accepted

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // update as needed

const initialState = {
  fullName: "",
  age: "",
  exhibitionID: "",
  ticketsBooked: "",
  terms: false,
};

type FormState = typeof initialState;

function base64UrlDecode(input: string) {
  try {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (input.length % 4)) % 4);
    const decoded = typeof window === "undefined" ? Buffer.from(base64, "base64").toString("utf8") : atob(base64);
    return decoded;
  } catch {
    return "";
  }
}

function decodeJwtSub(token: string | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadStr || "{}");
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

export default function ExhibitionRegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [customerID, setCustomerID] = useState<string | null>(null);

  useEffect(() => {
    // Try common keys for JWT stored by login
    const possibleKeys = ["access_token", "token", "jwt", "customer_token"];
    let t: string | null = null;
    for (const k of possibleKeys) {
      const v = typeof window !== "undefined" ? localStorage.getItem(k) : null;
      if (v) {
        t = v;
        break;
      }
    }
    setToken(t);
    setCustomerID(decodeJwtSub(t));
  }, []);

  const validators: { [K in keyof FormState]: (value: any, full?: FormState) => string } = {
    fullName: (v: string) =>
      /^[A-Za-z\s'\-]{2,50}$/.test(v.trim())
        ? ""
        : "Name should be 2-50 letters and may include spaces, - or '",
    age: (v: string) => {
      if (!/^\d{1,3}$/.test(v)) return "Age must be a number";
      const n = Number(v);
      return n >= 13 && n <= 120 ? "" : "Age must be between 13 and 120";
    },
    exhibitionID: (v: string) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
        ? ""
        : "Exhibition ID must be a valid UUID",
    ticketsBooked: (v: string) => {
      if (!/^\d+$/.test(v)) return "Tickets must be a number";
      const n = Number(v);
      return n >= 1 && n <= 20 ? "" : "Tickets must be between 1 and 20";
    },
    terms: (v: boolean) => (v ? "" : "You must accept the terms"),
  };

  const validateField = (name: keyof FormState, value: any, full?: FormState) => {
    const fn = validators[name];
    return fn ? fn(value, full) : "";
  };

  const validateAll = (data: FormState) => {
    const e: { [k: string]: string } = {};
    (Object.keys(validators) as Array<keyof FormState>).forEach((k) => {
      const msg = validators[k](data[k], data);
      if (msg) e[k as string] = msg;
    });
    setErrors(e);
    return e;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? checked : value;
    const updated = { ...form, [name]: val } as FormState;
    setForm(updated);
    const msg = validateField(name as keyof FormState, val, updated);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validateAll(form);
    if (Object.keys(eMap).length > 0) return;

    if (!token || !customerID) {
      setErrors((prev) => ({ ...prev, submit: "Please login first (no token found)" }));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        exhibitionID: form.exhibitionID,
        customerID: customerID,
        ticketsBooked: Number(form.ticketsBooked),
      };

      await axios.post(`${API_BASE_URL}/customer/bookings`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      });

      alert("successful registration");
      router.push("/login");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Registration failed";
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900/80 backdrop-blur border border-blue-100 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-8 py-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-semibold tracking-tight">Exhibition Registration (Customer)</h1>
          <p className="text-blue-100 mt-1">Book tickets for an exhibition</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Saikot Hasan"
              className={`w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              required
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1" htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              inputMode="numeric"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 22"
              className={`w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              required
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1" htmlFor="exhibitionID">Exhibition ID (UUID)</label>
            <input
              id="exhibitionID"
              name="exhibitionID"
              type="text"
              value={form.exhibitionID}
              onChange={handleChange}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className={`w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.exhibitionID ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              required
            />
            {errors.exhibitionID && <p className="mt-1 text-sm text-red-600">{errors.exhibitionID}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1" htmlFor="ticketsBooked">Tickets</label>
            <input
              id="ticketsBooked"
              name="ticketsBooked"
              type="number"
              inputMode="numeric"
              value={form.ticketsBooked}
              onChange={handleChange}
              placeholder="1-20"
              className={`w-full rounded-lg border px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ticketsBooked ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              required
            />
            {errors.ticketsBooked && <p className="mt-1 text-sm text-red-600">{errors.ticketsBooked}</p>}
          </div>

          <div className="md:col-span-2 flex items-start gap-3 mt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
              className={`mt-1.5 h-5 w-5 rounded border ${errors.terms ? "border-red-400" : "border-slate-300 dark:border-slate-700"} text-blue-600 focus:ring-blue-500`}
              aria-invalid={!!errors.terms}
            />
            <label htmlFor="terms" className="text-sm text-slate-700 dark:text-slate-200">
              I agree to the Terms & Privacy Policy for the Exhibition Management System
            </label>
          </div>
          {errors.terms && <p className="md:col-span-2 -mt-2 text-sm text-red-600">{errors.terms}</p>}

          {errors.submit && (
            <div className="md:col-span-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {submitting ? "Registering..." : "Register for Exhibition"}
            </button>
            <a
              className="text-sm text-blue-700 hover:text-blue-800 underline underline-offset-4"
              href="/login"
            >
              Go to Login
            </a>
          </div>

          <div className="md:col-span-2 text-xs text-slate-500 dark:text-slate-400">
            {customerID ? (
              <p>Detected customer ID from token: {customerID}</p>
            ) : (
              <p>No token detected. You must login to book.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

