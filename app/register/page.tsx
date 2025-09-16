"use client";
import axios from "axios";
import Image from "next/image";
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
      role: "admin",
    };
    const response = await axios.post(
      "http://localhost:3000/users",
      registrationData
    );
    console.log(response.data);
    alert("Registration successful");
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Registration failed");
  }
}

export default function RegisterPage() {
  //redirection
  const router = useRouter();

  //all state variables for form inputs
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");

  //all regex for validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneRegex = /^\d{11}$/;

  //all change handlers for form inputs
  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  //submission handler with validation
  const handleSubmit = (e: React.FormEvent) => {
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
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    } else if (!phoneRegex.test(phone)) {
      alert("Phone number must be 11 digits long");
      return;
    } else {
      postRegistration(name, email, password, phone);
      router.push("/login");
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        background:
          "url('https://images.yourstory.com/cs/2/28b451402d6a11e9aa979329348d4c3e/Featue-1647082317203.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75')",
      }}
    >
      <div className="w-screen h-screen bg-black/50 items-center justify-center flex">
        <div className="flex flex-col bg-amber-50 items-center pt-12.5 pb-12.5 pl-5 pr-5 rounded-2xl shadow-amber-50">
          <Image
            src="/userlogo.png"
            alt="User logo"
            width="150"
            height="150"
            className="-mt-25"
          ></Image>
          <h1 className="text-5xl">Register</h1>
          <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="mb-3 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
              onChange={nameChange}
            ></input>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
              onChange={emailChange}
            ></input>
            <input
              type="password"
              placeholder="password"
              className="mb-3 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
              onChange={passwordChange}
            ></input>
            <input
              type="phone"
              placeholder="Phone"
              className="mb-3 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
              onChange={phoneChange}
            ></input>
            <button
              type="submit"
              className="bg-amber-500 text-white p-2 mt-5 rounded-full hover:bg-amber-600 focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]"
            >
              Register
            </button>
          </form>
          <p className="m-5">
            Already have an account?
            <a href="login" className="text-blue-400 pl-2 pr-2 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
