"use client";

import { useSession } from "next-auth/react";
import WordLists from "@components/WordLists";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const { status, data: session } = useSession();
  const router = useRouter();

  if (status === "authenticated" || session?.user?.email !== undefined) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">My Lists</h2>
          <Link
            href="./lists/addList"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Create List +
          </Link>
        </div>

        <WordLists createdBy={session?.user?.email} />
      </div>
    );
  } else {
    if (session !== null) {
      return (
        <p className="text-center text-gray-500 mt-6">
          Fetching Your Lists ...
        </p>
      );
    } else {
      router.push("/login");
    }
  }
}
