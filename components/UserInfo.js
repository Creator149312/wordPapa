"use client";

import { useSession } from "next-auth/react";
import UserProfileDropdown from "./UserProfileDropDown";

export default function UserInfo() {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    // console.log("Status: " + status);
    return (
      <div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
        <div>
          <UserProfileDropdown name={session?.user?.name}/>
        </div>
      </div>
    );
  } else {
    return <a href="/login">Login</a>;
  }
}