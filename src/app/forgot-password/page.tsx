import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset Your Password" subtitle="Enter your email and we'll send you a link to set a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
