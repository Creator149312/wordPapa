import DeleteAccountForm from "@components/DeleteAccountForm";
import ResetPasswordForm from "@components/ResetPasswordForm";
import EditProfileForm from "@components/EditProfileForm";
import { Settings, Shield, UserX, UserCheck } from "lucide-react";

export default async function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[#75c32c]/10 rounded-2xl text-[#75c32c]">
          <Settings size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            Manage your account and security preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile & Regional Identity Section */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#75c32c]/10 text-[#75c32c] rounded-xl">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 dark:text-white">Profile & Identity</h2>
              <p className="text-xs text-gray-400 font-medium">Showcase your rank, country, and institution on public leaderboards</p>
            </div>
          </div>
          
          <EditProfileForm />
        </section>

        {/* Danger Zone / Delete Account */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 border border-red-50 dark:border-red-900/10 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
              <UserX size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white">Danger Zone</h2>
          </div>

          <div className="bg-red-50/50 dark:bg-red-900/5 rounded-[2rem] p-6 border border-red-100 dark:border-red-900/20">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium leading-relaxed">
              Once you delete your account, there is no going back. All your saved word lists and progress will be permanently removed.
            </p>
            <DeleteAccountForm />
          </div>
        </section>
      </div>

      {/* Footer Meta */}
      <footer className="mt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 dark:text-gray-700">
          WordPapa Account v1.0
        </p>
      </footer>
    </div>
  );
}