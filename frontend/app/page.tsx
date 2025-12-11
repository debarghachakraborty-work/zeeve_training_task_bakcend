"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";

    if (isAuth) {
      router.replace("/logout");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <p>Loading...</p>; // temporary while redirecting
}
