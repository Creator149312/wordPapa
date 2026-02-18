"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Sign Out
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to log out of your account?
      </p>
      <button
        onClick={handleSignOut}
        className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}
