import Header from "@/components/header";
import Link from "next/link";

export default function exhibition() {
  return (
    <>
      <Header />
      <p>Exhibitions</p><br />
      <Link href="/exhibition/1">exhibition 1</Link><br /><br />
      <Link href="/exhibition/2">exhibition 2</Link><br /><br />
      <Link href="/exhibition/3">exhibition 3</Link><br /><br />
      <Link href="/exhibition/4">exhibition 4</Link>
    </>
  );
}
