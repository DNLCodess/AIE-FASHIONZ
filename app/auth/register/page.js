"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import { Field, inputCls } from "@/components/checkout/ContactStep";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  gender: z.enum(["female", "male", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select an option",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ firstName, lastName, email, gender, password }) => {
    setServerError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, gender },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <AuthShell title="Check your email" subtitle="We've sent you a confirmation link">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mx-auto">
            <span className="text-gold">✓</span>
          </div>
          <p className="font-body text-sm text-muted leading-relaxed">
            Please check your inbox and click the confirmation link to activate your account.
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
      title="Create account"
      subtitle="Join Aiefashion for exclusive access"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-foreground hover:text-gold transition-colors">
            Sign in
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" error={errors.firstName?.message}>
            <input {...register("firstName")} className={inputCls(errors.firstName)} placeholder="Jane" />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <input {...register("lastName")} className={inputCls(errors.lastName)} placeholder="Smith" />
          </Field>
        </div>

        <Field label="Gender" error={errors.gender?.message}>
          <select
            {...register("gender")}
            className={inputCls(errors.gender)}
            defaultValue=""
          >
            <option value="" disabled>Select…</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </Field>

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
            placeholder="Min. 8 characters"
            autoComplete="new-password"
          />
        </Field>

        <Field label="Confirm password" error={errors.confirm?.message}>
          <input
            {...register("confirm")}
            type="password"
            className={inputCls(errors.confirm)}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="font-body text-[11px] text-muted text-center leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-foreground transition-colors">Terms</Link>
          {" "}and{" "}
          <Link href="/legal/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}
