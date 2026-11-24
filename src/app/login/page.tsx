import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect && params.redirect.startsWith("/") ? params.redirect : "/account";

  return (
    <AuthCard title="Sign In" subtitle="Access your Licomanagement account to view orders and requests.">
      <LoginForm redirectTo={redirectTo} justRegistered={params.registered === "1"} />
    </AuthCard>
  );
}
