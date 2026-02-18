"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignInBtn() {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-3 px-4 py-2 mt-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
    >
      <Image
        src="/google-logo.png"
        alt="Google logo"
        height={20}
        width={20}
        className="h-5 w-5"
      />
      <span>Sign in with Google</span>
    </button>
  );
}
