"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import { Field, inputCls } from "@/components/checkout/ContactStep";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }) => {
    setServerError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/profile`,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="Password reset link sent">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mx-auto">
            <span className="text-gold">✓</span>
          </div>
          <p className="font-body text-sm text-muted leading-relaxed">
            If an account exists for that email, you&apos;ll receive a password reset link shortly.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-2 font-body text-sm text-muted hover:text-foreground transition-colors"
          >
            Back to sign in →
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your email and we'll send a reset link"
      footer={
        <Link href="/auth/login" className="text-foreground hover:text-gold transition-colors">
          ← Back to sign in
        </Link>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </AuthShell>
  );
}
