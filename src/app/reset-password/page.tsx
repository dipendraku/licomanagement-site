import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Set a New Password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
