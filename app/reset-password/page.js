"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateEmail,
} from "@utils/Validator";
import { generatePasswordResetLink } from "@components/actions/actions"
import toast from "react-hot-toast";

export default function RegisterFormAdv() {
  const [formData, setFormData] = useState({
    email: "",
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

  const validateFormAdv = async (dataFromFrom) => {
    let errors = {};
    setErrors({});
    setError("");

    let ve = validateEmail(formData.email);

    if (ve.length !== 0) errors.email = ve;

    if (Object.keys(errors).length === 0) {
      setIsRegistering(true);
      try {
        console.log("Form Data in Client, ", dataFromFrom);
        let results = await generatePasswordResetLink(dataFromFrom);

        if (results?.error) {
          toast.error(results.error);
        } else {
          toast.success("Reset Password Link Generated successfully!");
          setFormData({
            email: "",
          });
        }
      } catch (error) {
        setError("Invalid Failed!");
      } finally {
        setIsRegistering(false);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="">
      <h1 className="card-title text-center">Verify Email</h1>
      <div className="card form-50">
        <form action={validateFormAdv} className="">
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
          <button className="custom-button p-3">Verify Email</button>
          {isRegistering && (
            <p>Checking If Email is Valid...</p>
          )}
        </form>
      </div>
    </div>
  );
}
