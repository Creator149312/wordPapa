"use client";
import { useState, useEffect } from "react";
import { deleteUserAccount } from "./actions/actions";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

const DeleteAccountForm = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  return (
    <div className="mt-3 card">
      <h2>Delete Your Account</h2>
      <form
        action={(formData) => {
          let result = deleteUserAccount(formData);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success("Your Account Deleted!");
            signOut({ callbackUrl: "/login" });
          }
        }}
      >
        <p>
          Note: if you delete your account you will not be able to recover it!
        </p>
        <div className="left-right">
          <strong>Are you sure?</strong>
          <button
            onClick={(e) => {
              e.preventDefault();
              setDeleteEnabled((prev) => !prev);
            }}
            className="custom-button"
          >
            YES
          </button>
          <button className="custom-button custom-red-button" disabled={!deleteEnabled}>
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountForm;
