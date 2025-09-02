"use client";
import Header from "@/components/header";
import { useParams } from "next/navigation";

export default function ExhibitionDetail() {
  const params = useParams();
  const id = params?.id;

  return (
    <>
      <Header />
      <p>Exhibition number {id}</p>
    </>
  );
}
