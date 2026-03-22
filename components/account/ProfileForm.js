"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Field, inputCls } from "@/components/checkout/ContactStep";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function ProfileForm({ user }) {
  const router = useRouter();
  const meta = user.user_metadata ?? {};

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: meta.first_name ?? "",
      lastName: meta.last_name ?? "",
    },
  });

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const updateProfile = async ({ firstName, lastName }) => {
    setProfileMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });
    if (error) {
      setProfileMsg({ type: "error", text: error.message });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated." });
      router.refresh();
    }
  };

  const updatePassword = async ({ password }) => {
    setPasswordMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated." });
      passwordForm.reset();
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile details */}
      <section>
        <h3 className="font-heading text-base text-foreground mb-6 pb-4 border-b border-border">
          Personal Details
        </h3>

        <form onSubmit={profileForm.handleSubmit(updateProfile)} noValidate className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" error={profileForm.formState.errors.firstName?.message}>
              <input
                {...profileForm.register("firstName")}
                className={inputCls(profileForm.formState.errors.firstName)}
              />
            </Field>
            <Field label="Last name" error={profileForm.formState.errors.lastName?.message}>
              <input
                {...profileForm.register("lastName")}
                className={inputCls(profileForm.formState.errors.lastName)}
              />
            </Field>
          </div>

          <Field label="Email address">
            <input
              value={user.email}
              disabled
              className="w-full h-12 px-4 font-body text-base text-muted bg-surface-raised border border-border cursor-not-allowed"
            />
          </Field>

          {profileMsg && (
            <p className={`font-body text-sm ${profileMsg.type === "error" ? "text-error" : "text-success"}`}>
              {profileMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="px-8 py-3.5 font-body text-base tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {profileForm.formState.isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Change password */}
      <section>
        <h3 className="font-heading text-base text-foreground mb-6 pb-4 border-b border-border">
          Change Password
        </h3>

        <form onSubmit={passwordForm.handleSubmit(updatePassword)} noValidate className="space-y-5">
          <Field label="New password" error={passwordForm.formState.errors.password?.message}>
            <input
              {...passwordForm.register("password")}
              type="password"
              className={inputCls(passwordForm.formState.errors.password)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm new password" error={passwordForm.formState.errors.confirm?.message}>
            <input
              {...passwordForm.register("confirm")}
              type="password"
              className={inputCls(passwordForm.formState.errors.confirm)}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </Field>

          {passwordMsg && (
            <p className={`font-body text-sm ${passwordMsg.type === "error" ? "text-error" : "text-success"}`}>
              {passwordMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="px-8 py-3.5 font-body text-base tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {passwordForm.formState.isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
