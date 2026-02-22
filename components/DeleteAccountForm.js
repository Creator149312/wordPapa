"use client";

import { useState } from "react";
import { deleteUserAccount } from "./actions/actions";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

const DeleteAccountForm = () => {
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <form
        action={async (formData) => {
          let result = await deleteUserAccount(formData);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success("Account deleted. We're sorry to see you go.");
            signOut({ callbackUrl: "/login" });
          }
        }}
        className="space-y-6"
      >
        {/* Safety Warning Box */}
        <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
          <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs font-bold text-orange-700 dark:text-orange-400 leading-relaxed">
            This action is permanent. All your progress, custom lists, and mastered words will be wiped from our servers forever.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-black text-gray-700 dark:text-gray-200 uppercase tracking-tighter">
              Confirm Deletion
            </label>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Unlock Button
               </span>
               <button
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteEnabled((prev) => !prev);
                }}
                type="button"
                className={`w-12 h-6 rounded-full transition-all relative ${
                  deleteEnabled ? "bg-red-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  deleteEnabled ? "left-7" : "left-1"
                }`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!deleteEnabled}
            className={`
              w-full flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg
              ${
                deleteEnabled
                  ? "bg-red-600 text-white shadow-red-500/20 hover:bg-red-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
              }
            `}
          >
            {deleteEnabled ? <Trash2 size={18} /> : <ShieldAlert size={18} />}
            Delete Permanently
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccountForm;