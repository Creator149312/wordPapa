"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInBtn from "./SignInBtn";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setError(false);
    setIsSigning(true);
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      setError(error);
    }finally{
      setIsSigning(false);
    }
  };

  return (
    <div className="text-center">
      <div className="card form-50">
        <h1 className="card-title">Login</h1>
        <form onSubmit={handleSubmit} className="card-content ">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="form-control m-2"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="form-control m-2"
          />
          <button className="custom-button m-2">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error.message}
            </div>
          )}
          {isSigning && <p>Checking Your Credentials....</p>}
          {error && <p>Username or Password is incorrect...</p>}
          <div>
            <Link className="m-4 p-3" href={"/register"}>
              Don't have an account? <span className="underline">Register</span>
            </Link>
          </div>
        </form>
        <SignInBtn />
      </div>
    </div>
  );
}