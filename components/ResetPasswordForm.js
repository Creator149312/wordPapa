"use client";
import { useState } from "react";
import { updateNewPassword } from "./actions/actions";

const ResetPasswordForm = () => {
  const [formValues, setformValues] = useState({
    currentPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });

    // //clear errors when user is typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = async (formData) => {
    let error = {};
    if (formValues.currentPassword.length < 8)
      error.currentPassword = "Password must be at least 8 characters long";
    if (formValues.newPassword.length < 8)
      error.newPassword = "Password must be at least 8 characters long";
    if (formValues.retypeNewPassword.length < 8) {
      error.retypeNewPassword = "Password must be at least 8 characters long";
    }

    // Client-side validation
    if (formValues.newPassword !== formValues.retypeNewPassword) {
      error.retypeNewPassword =
        "New password and retyped password do not match";
    }

    console.log(error);

    if (Object.keys(error).length !== 0) {
      console.log("I am inside errors");
      setErrors(error);
    } else {
    //if there are no errors
    console.log("I am inside formData");
    await updateNewPassword(formData);
    }
  };

  return (
    <div className="mt-3 card">
      <h2>Change Your Password</h2>
      <form
        action={validateForm}
      >
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            className="form-control mt-2 mb-3"
            value={formValues.currentPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.currentPassword && (
            <div className="error">{errors.currentPassword}</div>
          )}
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            className="form-control mt-2 mb-3"
            value={formValues.newPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.newPassword && (
            <div className="error">{errors.newPassword}</div>
          )}
        </div>
        <div>
          <label htmlFor="retypeNewPassword">Retype New Password:</label>
          <input
            type="password"
            name="retypeNewPassword"
            className="form-control mt-2 mb-3"
            id="retypeNewPassword"
            value={formValues.retypeNewPassword}
            onChange={handleChange}
            minLength={8}
          />
          {errors.retypeNewPassword && (
            <div className="error">{errors.retypeNewPassword}</div>
          )}
        </div>
        <button type="submit" className="custom-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
