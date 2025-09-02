"use client";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-screen h-20 flex flex-row bg-amber-700">
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/home">Home</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/about">About us</Link>
      </div>
      <div className="m-auto text-white text-2xl font-bold p-3.5">
        <Link href="/exhibition">Exhibtion</Link>
      </div>
    </div>
  );
}
