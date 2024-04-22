// import ResetPasswordForm from "@components/ResetPasswordForm";
import { Suspense } from "react";
import ResetPasswordbyToken from "../../components/ResetPasswordbyToken";

export default async function SettingsPage() {
  return (
    <Suspense>
      <h1>Reset Password</h1>
      <ResetPasswordbyToken />
    </Suspense>
  );
}
