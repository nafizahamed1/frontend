import Header from "@/components/header";
import Link from "next/link";

export default function exhibition() {
  return (
    <>
      <Header />
      <p>Exhibitions</p>
      <Link href="/exhibition/1">exhibition 1</Link>
      <Link href="/exhibition/2">exhibition 2</Link>
      <Link href="/exhibition/3">exhibition 3</Link>
      <Link href="/exhibition/4">exhibition 4</Link>
    </>
  );
}
