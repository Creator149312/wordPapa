"use client";
import { useState, useEffect } from "react";
import { deleteUserAccount } from "./actions/actions";

const DeleteAccountForm = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  return (
    <div className="mt-3 card">
      <h2>Delete Your Account</h2>
      <div>
        <form action={deleteUserAccount}>
          <p>
            Note: if you delete your account you will not be able to recover it!
          </p>
          <div className="left-right">
            <strong>Are you sure?</strong>
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeleteEnabled(prev => !prev);
              }}
              className="custom-button"
            >
              YES
            </button>
            <button
              className="error custom-button"
              disabled={!deleteEnabled}
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountForm;
