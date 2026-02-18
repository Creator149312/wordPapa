"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInBtn from "./SignInBtn";
import Notification from "./Notification";
import { validateEmail, validatePasswordLength } from "@utils/Validator";

export default function LoginFormAdv() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setError("");
  };

  const validateForm = (data) => {
    let err = {};
    let ve = validateEmail(data.email);
    let vp = validatePasswordLength(data.password);

    if (ve.length !== 0) err.email = ve;
    if (vp.length !== 0) err.password = vp;

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setIsSigning(true);
      setError("");
      try {
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res.error) {
          setError("Invalid Credentials");
          return;
        }

        router.replace("/dashboard");
      } catch (error) {
        setError(error);
      } finally {
        setIsSigning(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Login
        </h1>
        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Login
          </button>

          {isSigning && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Checking your credentials…
            </p>
          )}

          {error && (
            <Notification
              message={"Username or Password is incorrect..."}
              state={"failed"}
            />
          )}

          <div className="text-center">
            <Link
              href="/register"
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Don&apos;t have an account? <span className="font-medium">Register</span>
            </Link>
          </div>
        </form> */}

        <div className="mt-6">
          <SignInBtn />
        </div>
      </div>
    </div>
  );
}
