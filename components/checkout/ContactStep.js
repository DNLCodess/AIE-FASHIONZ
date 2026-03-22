"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
});

export default function ContactStep({ defaultValues, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" error={errors.firstName?.message}>
          <input {...register("firstName")} className={inputCls(errors.firstName)} placeholder="Jane" />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName")} className={inputCls(errors.lastName)} placeholder="Smith" />
        </Field>
      </div>

      <Field label="Email address" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={inputCls(errors.email)}
          placeholder="jane@example.com"
          autoComplete="email"
        />
      </Field>

      <Field label="Phone (optional)" error={errors.phone?.message}>
        <input
          {...register("phone")}
          type="tel"
          className={inputCls(errors.phone)}
          placeholder="+44 7700 000000"
          autoComplete="tel"
        />
      </Field>

      <StepButton label="Continue to Address" />
    </form>
  );
}

/* ── Shared sub-components ─────────────────────────── */

export function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs tracking-wide text-muted uppercase">{label}</label>
      {children}
      {error && <p className="font-body text-xs text-error">{error}</p>}
    </div>
  );
}

export function inputCls(error) {
  return `w-full h-11 px-3 font-body text-sm text-foreground bg-surface border ${
    error ? "border-error" : "border-border"
  } focus:outline-none focus:border-foreground transition-colors`;
}

export function StepButton({ label }) {
  return (
    <button
      type="submit"
      className="w-full py-4 mt-2 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
    >
      {label}
    </button>
  );
}
