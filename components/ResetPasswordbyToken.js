"use client";
import { useState } from "react";
import { updateNewPasswordbyToken } from "./actions/actions";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { validatePassword } from "@utils/Validator";

const ResetPasswordbyToken = () => {
  const searchParams = useSearchParams();
  const [formValues, setformValues] = useState({
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
    const token = searchParams.get("token");
    let error = {};
    let np = validatePassword(formValues.newPassword);
    let rtp = validatePassword(formValues.retypeNewPassword);

    if (np.length !== 0) error.newPassword = np;
    if (rtp.length !== 0) error.retypeNewPassword = rtp;

    if (formValues.newPassword !== formValues.retypeNewPassword) {
      error.retypeNewPassword =
        "New password and retyped password do not match";
    }

    if (Object.keys(error).length !== 0) {
      console.log("Inside errors");
      setErrors(error);
    } else {
      console.log("inside success");
      let results = await updateNewPasswordbyToken(formData, token);
      if (results?.error) {
        toast.error(results.error);
      } else {
        toast.success("Password successfully changed!");
      }
    }
  };

  return (
    <div className="mt-3 card">
      <h2>Change Your Password</h2>
      <form action={validateForm}>
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

export default ResetPasswordbyToken;
