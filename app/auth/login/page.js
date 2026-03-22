"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import { Field, inputCls } from "@/components/checkout/ContactStep";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Validate redirect is a relative path to prevent open redirect
  const rawRedirect = searchParams.get("redirect") ?? "/account";
  const redirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/account";
  const urlError = searchParams.get("error");

  const [serverError, setServerError] = useState(urlError ? "Authentication failed. Please try again." : null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setServerError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your AIE Fashionz account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-foreground hover:text-gold transition-colors">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && (
          <div className="border border-error px-4 py-3">
            <p className="font-body text-sm text-error">{serverError}</p>
          </div>
        )}

        <Field label="Email address" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className={inputCls(errors.email)}
            placeholder="jane@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input
            {...register("password")}
            type="password"
            className={inputCls(errors.password)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>

        <div className="flex justify-end">
          <Link
            href="/auth/reset-password"
            className="font-body text-xs text-muted hover:text-foreground transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}
