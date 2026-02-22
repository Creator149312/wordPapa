"use client";

import { useState, useCallback } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function UserProfileDropdown() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // Memoized toggle for performance
  const toggleDropdown = useCallback(() => setOpen((prev) => !prev), []);

  // Show a clean skeleton while loading session to prevent layout jump
  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-5 py-2 rounded-xl bg-[#75c32c] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#75c32c]/20 hover:scale-105 active:scale-95 transition-all"
      >
        Sign In
      </button>
    );
  }

  const user = session.user;

  return (
    <div className="relative group">
      {/* Profile Trigger */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
      >
        <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-[#75c32c]/20">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="Avatar"
            fill
            sizes="32px"
            className="object-cover"
            priority
          />
        </div>
        <span className="hidden sm:block text-[13px] font-black uppercase tracking-tight text-gray-700 dark:text-gray-300">
          {user?.name?.split(" ")[0] || "User"}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : "group-hover:rotate-180"}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-52 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl z-50 overflow-hidden transition-all duration-200 origin-top-right
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:pointer-events-auto"}
        `}
      >
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-white/5">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</p>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{user?.email}</p>
        </div>

        <div className="p-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-[#75c32c]/10 hover:text-[#75c32c] rounded-xl transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-[#75c32c]/10 hover:text-[#75c32c] rounded-xl transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>

          <div className="h-px bg-gray-50 dark:bg-gray-800/50 my-1.5" />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[12px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { signOut, signIn } from "next-auth/react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronDown } from "lucide-react";

// export default function UserProfileDropdown() {
//   const { data: session } = useSession();
//   const [open, setOpen] = useState(false);

//   if (!session?.user) {
//     return (
//       <button
//         onClick={() => signIn("google")}
//         className="px-4 mr-2 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
//       >
//         Sign In
//       </button>
//     );
//   }

//   const user = session.user;

//   return (
//     <div className="relative group">
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
//       >
//         <Image
//           src={user?.image || "/default-avatar.png"}
//           alt="User avatar"
//           width={32}
//           height={32}
//           className="rounded-full"
//         />
//         <span className="font-medium text-sm">{user?.name || "User"}</span>
//         <ChevronDown className="w-4 h-4" />
//       </button>

//       {/* Dropdown: hover on desktop, click on mobile */}
//       <div
//         className={`absolute w-full md:w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md z-20 
//           ${open ? "block" : "hidden"} 
//           md:group-hover:block`}
//       >
//         <a
//           href="/dashboard"
//           className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           Dashboard
//         </a>
//         <a
//           href="/settings"
//           className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           Settings
//         </a>
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
//         >
//           Sign Out
//         </button>
//       </div>
//     </div>
//   );
// }
