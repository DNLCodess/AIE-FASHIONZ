"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, inputCls, StepButton } from "./ContactStep";

const schema = z.object({
  line1: z.string().min(1, "Required"),
  line2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().optional(),
  postcode: z.string().min(1, "Required"),
  country: z.string().min(2, "Required"),
});

const COUNTRIES = [
  { code: "GB", label: "United Kingdom" },
  { code: "NG", label: "Nigeria" },
  { code: "US", label: "United States" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IE", label: "Ireland" },
  { code: "NL", label: "Netherlands" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "ZA", label: "South Africa" },
];

export default function AddressStep({ defaultValues, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: "GB", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <Field label="Address line 1" error={errors.line1?.message}>
        <input
          {...register("line1")}
          className={inputCls(errors.line1)}
          placeholder="123 High Street"
          autoComplete="address-line1"
        />
      </Field>

      <Field label="Address line 2 (optional)" error={errors.line2?.message}>
        <input
          {...register("line2")}
          className={inputCls(errors.line2)}
          placeholder="Apartment, suite, etc."
          autoComplete="address-line2"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City" error={errors.city?.message}>
          <input
            {...register("city")}
            className={inputCls(errors.city)}
            placeholder="London"
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Postcode / ZIP" error={errors.postcode?.message}>
          <input
            {...register("postcode")}
            className={inputCls(errors.postcode)}
            placeholder="SW1A 1AA"
            autoComplete="postal-code"
          />
        </Field>
      </div>

      <Field label="State / Province (optional)" error={errors.state?.message}>
        <input
          {...register("state")}
          className={inputCls(errors.state)}
          placeholder="Optional"
          autoComplete="address-level1"
        />
      </Field>

      <Field label="Country" error={errors.country?.message}>
        <select
          {...register("country")}
          className={`${inputCls(errors.country)} cursor-pointer`}
          autoComplete="country"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
          <option disabled>──────────</option>
          <option value="OTHER">Other</option>
        </select>
      </Field>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
        >
          Back
        </button>
        <div className="flex-[2]">
          <StepButton label="Continue to Delivery" />
        </div>
      </div>
    </form>
  );
}
