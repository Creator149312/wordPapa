import DeleteAccountForm from "@components/DeleteAccountForm";
import ResetPasswordForm from "@components/ResetPasswordForm";

export default async function SettingsPage() {
  return (
    <>
    <h1>Settings</h1>
      <ResetPasswordForm />
      <DeleteAccountForm />
    </>
  );
}
