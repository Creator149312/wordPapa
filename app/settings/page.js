import DeleteAccountForm from "@components/DeleteAccountForm";
import ResetPasswordForm from "@components/ResetPasswordForm";

export default async function SettingsPage() {
  return (
    <div className=" mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Settings
      </h1>

      <div className="space-y-8">
        {/* <ResetPasswordForm /> */}
        <DeleteAccountForm />
      </div>
    </div>
  );
}
