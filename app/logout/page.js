"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    // Trigger sign out and redirect to login
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <></>
  );
}
