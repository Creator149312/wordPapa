import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LoginFormAdv from "@components/LoginFormAdv";

export default async function Login() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return <LoginFormAdv />;
}