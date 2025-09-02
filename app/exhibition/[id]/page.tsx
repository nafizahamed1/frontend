"use client";
import { useParams } from "next/navigation";

export default function ExhibitionDetail() {
  const { id } = useParams();

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Exhibition Details</h1>
      <p className="text-lg text-gray-700">
      Exhibition number <span className="font-semibold">{id}</span>
      </p>
    </main>
  );
}