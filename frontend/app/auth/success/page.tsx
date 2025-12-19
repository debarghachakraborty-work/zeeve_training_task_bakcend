"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";

export default function GoogleSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("isAuthenticated", "true");
      router.push("/logout");
    }
  }, [token]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) return setError("Missing email query parameter.");
    if (!otp) return setError("Please enter the OTP.");

    try {
      setLoading(true);
      const res = await axiosClient.post("/verify-otp", { email, otp });
      // backend sets cookie and returns user
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/logout");
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    if (!email) return setError("Missing email.");
    try {
      setLoading(true);
      await axiosClient.post("/resend-otp", { email });
      setMessage("OTP resent to your email.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !email) {
    return <h2>No authentication data provided.</h2>;
  }

  if (token) return <h2>Logging you in...</h2>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border rounded-2xl p-6 shadow bg-gray-900">
        <h1 className="text-2xl font-semibold mb-4 text-center">Enter OTP</h1>

        {email && (
          <p className="text-center text-sm mb-4">We sent an OTP to <strong>{email}</strong></p>
        )}

        {error && (
          <p className="text-center text-sm border border-red-500 p-2 rounded mb-3">{error}</p>
        )}

        {message && (
          <p className="text-center text-sm border border-green-500 p-2 rounded mb-3">{message}</p>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded-lg bg-transparent text-center"
          />

          <button
            type="submit"
            disabled={loading}
            className="border p-2 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleResend}
            disabled={loading}
            className="underline text-sm"
          >
            Resend OTP
          </button>

          <a href="/login" className="text-sm underline">Use email/password</a>
        </div>
      </div>
    </div>
  );
}
