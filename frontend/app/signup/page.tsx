"use client";

import { useState } from "react";
import axiosClient from "@/lib/axiosClient"
import { useRouter } from "next/navigation";
import GoogleButton from "@/_components/GoogleLoginButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axiosClient.post("/signup", { name, email, password });
      router.replace("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-sm border rounded-2xl p-6 shadow bg-gray-900" >
      <h1 className="text-2xl font-semibold mb-6 text-center">Signup</h1>

      {error && (
        <p className="text-center text-sm border border-red-500 p-2 rounded mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg bg-transparent"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-lg bg-transparent"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-lg bg-transparent"
        />

        <button
          type="submit"
          className="border p-2 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Signup
        </button>
      </form>
      <GoogleButton />
      <p className="text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="underline hover:opacity-70">
          Login
        </a>
      </p>
      
    </div>
  </div>
);

}
