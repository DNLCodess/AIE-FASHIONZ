"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { Field, inputCls } from "@/components/checkout/ContactStep";

export default function CategoryActions() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSaving(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug: generateSlug(name), description }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to create category.");
      setSaving(false);
      return;
    }

    setName("");
    setDescription("");
    setOpen(false);
    setSaving(false);
    router.refresh();
  };

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors"
        >
          + New Category
        </button>
      ) : (
        <form onSubmit={handleCreate} className="border border-border p-6 space-y-4 max-w-md">
          <h3 className="font-heading text-base text-foreground">New Category</h3>

          {error && <p className="font-body text-sm text-error">{error}</p>}

          <Field label="Category name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls()}
              placeholder="e.g. Luxury Fabrics"
              required
            />
          </Field>

          <Field label="Description (optional)">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls()}
              placeholder="Short description…"
            />
          </Field>

          <div className="font-body text-xs text-muted">
            Slug: <span className="font-mono">{generateSlug(name) || "auto-generated"}</span>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-6 py-2.5 font-body text-sm tracking-widest uppercase bg-gold text-foreground hover:bg-gold-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null); }}
              className="px-4 py-2.5 font-body text-sm text-muted hover:text-foreground transition-colors border border-border"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
