"use client";

import Link from "next/link";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

async function postRegistration(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  try {
    const registrationData = {
      fullName: name,
      email: email,
      password: password,
      phone: Number(phone),
      role: "host",
    };

    const response = await axios.post("http://localhost:3000/users", registrationData);
    console.log(response.data);
    alert("Registration successful");
    return true;
  } catch (error: any) {
    console.error("Error during registration:", error);

    if (error.response?.data?.message) {
      if (error.response.data.message.toLowerCase().includes("email")) {
        alert("This email is already registered!");
      } else {
        alert(error.response.data.message);
      }
    } else {
      alert("Registration failed");
    }

    return false;
  }
}




export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");


  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const phoneRegex = /^0\d{10}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !phone) {
      alert("Please fill all the fields");
      return;
    } else if (!nameRegex.test(name)) {
      alert("Name can only contain letters and spaces");
      return;
    } else if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    } else if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long and also contain uppercase, number, and special character"
      );
      return;
    } else if (!phoneRegex.test(phone)) {
      alert("Phone number must be 0 and 11 digits long");
      return;
    }

    const success = await postRegistration(name, email, password, phone);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
