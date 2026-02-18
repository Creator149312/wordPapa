"use client";

import { useState } from "react";
import { signOut, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function UserProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    );
  }

  const user = session.user;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Image
          src={user?.image || "/default-avatar.png"}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium text-sm">{user?.name || "User"}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown: hover on desktop, click on mobile */}
      <div
        className={`absolute mt-2 w-full md:w-48 bg-white dark:bg-gray-900 z-20
          ${open ? "block" : "hidden"} 
          md:group-hover:block`}
        onClick={() => setOpen(false)} // collapse after any click inside
      >
        <Link
          href="/dashboard"
          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
