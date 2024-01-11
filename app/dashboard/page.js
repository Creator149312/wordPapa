'use client'

import SignInBtn from "@components/SignInBtn";
import { useSession } from "next-auth/react";
import WordLists from "@components/WordLists";
import Link from "next/link";

export default function UserInfo() {
  const { status, data: session } = useSession();

  if (status === "authenticated" || session?.user?.email !== undefined) {
    return (
      <div className="m-3">
        <div className="list-heading-container">
          <h2>My Lists</h2>
          <Link href={'./addList'} className="custom-button">Create List + </Link>
        </div>
        <WordLists createdBy={session?.user?.email} />
      </div>
    );
  } else {
    if (session !== null) { //if is used till the time browser fetches the session data
      return <p>Fetching Your Lists ...</p>
    } else {
      return <SignInBtn />;
    }
  }
}