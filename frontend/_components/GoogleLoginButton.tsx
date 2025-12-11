"use client";

export default function GoogleButton() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="border p-2 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-center gap-2 mt-4 w-full"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
}
