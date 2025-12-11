"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      const googleToken = localStorage.getItem("authToken");
      const isAuth = localStorage.getItem("isAuthenticated") === "true";

      // If neither Google token nor normal login → redirect
      if (!googleToken && !isAuth) {
        router.replace("/login");
        return;
      }

      // If normal login → load stored user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // If Google login: just set as 'Google User'
        setUser({ name: "Google User" });
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await axiosClient.post("/logout");

    // Clear all auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome {user?.name || "User"}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
