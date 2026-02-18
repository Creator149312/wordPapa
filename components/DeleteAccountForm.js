"use client";
import { useState } from "react";
import { deleteUserAccount } from "./actions/actions";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

const DeleteAccountForm = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Delete Your Account
      </h2>
      <form
        action={async (formData) => {
          let result = await deleteUserAccount(formData);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success("Your Account Deleted!");
            signOut({ callbackUrl: "/login" });
          }
        }}
        className="space-y-4"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Note:</strong> If you delete your account you will not be able
          to recover it!
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <strong className="text-gray-800 dark:text-gray-100">
            Are you sure?
          </strong>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeleteEnabled((prev) => !prev);
              }}
              type="button"
              className="px-4 py-2 rounded-md bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition-colors"
            >
              YES
            </button>
            <button
              type="submit"
              disabled={!deleteEnabled}
              className={`px-4 py-2 rounded-md font-semibold shadow transition-colors ${
                deleteEnabled
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Delete Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountForm;
