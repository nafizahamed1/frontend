"use client";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <a href="/">
        <Image src="/logo.png" 
        alt="Logo"
         width={60} 
         height={60} 
         />
      </a>
      <nav className="space-x-6">
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <Link href="/about" className="hover:text-blue-500">About</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>
        <Link href="/exhibition" className="hover:text-blue-500">Exhibition</Link>
        <Link href="/login" className="hover:text-blue-500">Login</Link>
      
      </nav>
    </header>
  );
}