"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSlug } from "@/lib/utils";
import { Field, inputCls } from "@/components/checkout/ContactStep";

const CATEGORIES = [
  { value: "luxury-fabrics", label: "Luxury Fabrics" },
  { value: "bags-shoes", label: "Bags & Shoes" },
  { value: "jewellery", label: "Jewellery" },
  { value: "party-dinner-wear", label: "Party & Dinner Wear" },
  { value: "childrens-wear", label: "Children's Wear" },
  { value: "body-shapers", label: "Body Shapers" },
];

const variantSchema = z.object({
  size: z.string().optional(),
  colour: z.string().optional(),
  additional_price: z.coerce.number().min(0).default(0),
  stock_quantity: z.coerce.number().min(0).default(0),
  sku: z.string().optional(),
});

const schema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  description: z.string().optional(),
  category_slug: z.string().min(1, "Select a category"),
  base_price: z.coerce.number().min(1, "Must be greater than 0"),
  compare_price: z.coerce.number().min(0).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
});

export default function ProductForm({ product, apiPath, method = "POST" }) {
  const router = useRouter();
  const [saveError, setSaveError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          ...product,
          // Convert pence → pounds for display
          base_price: product.base_price / 100,
          compare_price: product.compare_price ? product.compare_price / 100 : undefined,
          variants: product.variants?.map((v) => ({
            ...v,
            additional_price: v.additional_price / 100,
          })) ?? [{ size: "", colour: "", additional_price: 0, stock_quantity: 0 }],
        }
      : {
          is_active: true,
          is_featured: false,
          variants: [{ size: "", colour: "", additional_price: 0, stock_quantity: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const title = watch("title");

  const onSubmit = async (data) => {
    // Convert pounds back to pence
    const payload = {
      ...data,
      base_price: Math.round(data.base_price * 100),
      compare_price: data.compare_price ? Math.round(data.compare_price * 100) : null,
      variants: data.variants.map((v) => ({
        ...v,
        additional_price: Math.round((v.additional_price ?? 0) * 100),
      })),
    };

    const res = await fetch(apiPath, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setSaveError(json.error ?? "Save failed. Please try again.");
      return;
    }

    setSaveError(null);

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <section className="space-y-5">
        <SectionHead>Basic Information</SectionHead>

        <Field label="Product title" error={errors.title?.message}>
          <input
            {...register("title", {
              onChange: (e) => {
                if (!product) setValue("slug", generateSlug(e.target.value));
              },
            })}
            className={inputCls(errors.title)}
            placeholder="e.g. Silk Ankara Blend Fabric"
          />
        </Field>

        <Field label="Slug (URL)" error={errors.slug?.message}>
          <input {...register("slug")} className={inputCls(errors.slug)} placeholder="auto-generated" />
        </Field>

        <Field label="Category" error={errors.category_slug?.message}>
          <select {...register("category_slug")} className={`${inputCls(errors.category_slug)} cursor-pointer`}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={4}
            className={`${inputCls(errors.description)} resize-y py-2`}
            placeholder="Product description..."
          />
        </Field>
      </section>

      {/* Pricing */}
      <section className="space-y-5">
        <SectionHead>Pricing (£)</SectionHead>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Base price (£)" error={errors.base_price?.message}>
            <input
              {...register("base_price")}
              type="number"
              step="0.01"
              min="0"
              className={inputCls(errors.base_price)}
              placeholder="28.00"
            />
          </Field>
          <Field label="Compare price (£) — optional" error={errors.compare_price?.message}>
            <input
              {...register("compare_price")}
              type="number"
              step="0.01"
              min="0"
              className={inputCls(errors.compare_price)}
              placeholder="35.00"
            />
          </Field>
        </div>
        <p className="font-body text-xs text-muted">Enter prices in pounds. Stored in pence internally.</p>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <SectionHead>Variants</SectionHead>
        {errors.variants?.root && (
          <p className="font-body text-xs text-error">{errors.variants.root.message}</p>
        )}

        {fields.map((field, i) => (
          <div key={field.id} className="border border-border p-4 space-y-4 relative">
            <p className="font-body text-xs tracking-wide text-muted uppercase">Variant {i + 1}</p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Size" error={errors.variants?.[i]?.size?.message}>
                <input {...register(`variants.${i}.size`)} className={inputCls()} placeholder="e.g. 6 Yards" />
              </Field>
              <Field label="Colour" error={errors.variants?.[i]?.colour?.message}>
                <input {...register(`variants.${i}.colour`)} className={inputCls()} placeholder="e.g. Royal Blue" />
              </Field>
              <Field label="Extra price (£)" error={errors.variants?.[i]?.additional_price?.message}>
                <input
                  {...register(`variants.${i}.additional_price`)}
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputCls()}
                  placeholder="0.00"
                />
              </Field>
              <Field label="Stock qty" error={errors.variants?.[i]?.stock_quantity?.message}>
                <input
                  {...register(`variants.${i}.stock_quantity`)}
                  type="number"
                  min="0"
                  className={inputCls()}
                  placeholder="10"
                />
              </Field>
            </div>
            <Field label="SKU (optional)">
              <input {...register(`variants.${i}.sku`)} className={inputCls()} placeholder="SKU-001" />
            </Field>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-3 right-3 font-body text-xs text-muted hover:text-error transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ size: "", colour: "", additional_price: 0, stock_quantity: 0 })}
          className="font-body text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
        >
          + Add variant
        </button>
      </section>

      {/* Flags */}
      <section className="space-y-3">
        <SectionHead>Visibility</SectionHead>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("is_active")} className="accent-gold w-4 h-4" />
          <span className="font-body text-sm text-foreground">Active (visible in store)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register("is_featured")} className="accent-gold w-4 h-4" />
          <span className="font-body text-sm text-foreground">Featured on homepage</span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex flex-col gap-3 pt-2">
        {saveError && (
          <p className="text-error text-sm font-body">{saveError}</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 font-body text-sm tracking-widest uppercase border border-border text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHead({ children }) {
  return (
    <h3 className="font-heading text-base text-foreground pb-3 border-b border-border">{children}</h3>
  );
}
