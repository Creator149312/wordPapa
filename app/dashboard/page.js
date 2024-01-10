'use client'

import SignInBtn from "@components/SignInBtn";
import { useSession } from "next-auth/react";
import WordLists from "@components/WordLists";
import Link from "next/link";

export default function UserInfo() {
  const { status, data: session } = useSession();

  if (status === "authenticated" || session !== null) {
    return (
      <div className="m-3">
        <div className="list-heading-container">
          <h2>My Lists</h2>
          <Link href={'./addList'} className="custom-button">Create List + </Link>
        </div>
        <WordLists createdBy={session?.user?.email}/>
      </div>
    );
  } else {
    return <SignInBtn />;
  }
}