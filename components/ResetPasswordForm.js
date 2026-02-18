"use client";
import { useState } from "react";
import { updateNewPassword } from "./actions/actions";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { validatePassword } from "@utils/Validator";

const ResetPasswordForm = () => {
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error while typing
  };

  const validateForm = async (formData) => {
    let error = {};

    let cp = validatePassword(formValues.currentPassword);
    let np = validatePassword(formValues.newPassword);
    let rtp = validatePassword(formValues.retypeNewPassword);

    if (cp.length !== 0) error.currentPassword = cp;
    if (np.length !== 0) error.newPassword = np;
    if (rtp.length !== 0) error.retypeNewPassword = rtp;

    if (formValues.newPassword !== formValues.retypeNewPassword) {
      error.retypeNewPassword = "New password and retyped password do not match";
    }

    if (Object.keys(error).length !== 0) {
      setErrors(error);
    } else {
      let results = await updateNewPassword(formData);
      if (results?.error) {
        toast.error(results.error);
      } else {
        toast.success("Password successfully changed!");
        // signOut({ callbackUrl: "/login" });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Change Your Password
      </h2>
      <form action={validateForm} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.currentPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.newPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="retypeNewPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Retype New Password
          </label>
          <input
            type="password"
            name="retypeNewPassword"
            id="retypeNewPassword"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.retypeNewPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.retypeNewPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.retypeNewPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-blue-700 transition-colors"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
