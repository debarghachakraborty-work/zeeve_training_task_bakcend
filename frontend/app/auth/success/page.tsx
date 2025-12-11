"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleSuccess() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("isAuthenticated", "true");  // <-- ADD THIS

      router.push("/logout");
    }
  }, [token]);

  return <h2>Logging you in...</h2>;
}
