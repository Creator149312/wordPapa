"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "./Notification";

export default function RegisterFormAdv() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //we are setting all errors to empty when user is typing
    setErrors({ ...errors, [name]: "" });
    setError("");
  };

  const validateForm = (data) => {
    let errors = {};

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!data.username.trim()) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(data.username)) {
      errors.username = "Username must contain only letters and digits";
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email address";
    }

    // Validate password
    if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    setErrors({});
    setError("");
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setIsRegistering(true);
      try {
        //check if email exists
        const resUserExists = await fetch("api/userExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        });

        //check if username exists
        const resUserNameExists = await fetch("api/userNameExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: formData.username }),
        });

        const { user } = await resUserExists.json();
        const { userName } = await resUserNameExists.json();

        if (user) {
          setError("User already exists!");
          return;
        } else if (userName) {
          setError("Username already taken!");
          return;
        }

        const res = await fetch("api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (res.ok) {
          router.push("/login");
        } else {
          setError("User registration failed.");
        }
      } catch (error) {
        setError("Registration Failed!");
      } finally {
        setIsRegistering(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  console.log(errors);

  return (
    <div className="">
      <h1 className="card-title text-center">Register</h1>
      <div className="card form-50">
        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control mb-3 mt-2"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div>
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              className="form-control mb-3 mt-2"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control mb-3 mt-2"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button className="custom-button p-3">Register</button>
          {error && <Notification message={error} state={"failed"} />}
          {isRegistering && (
            <p>Checking Details and Creating Your Account...</p>
          )}
          <Link className="text-sm mt-3 text-right" href={"/login"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
