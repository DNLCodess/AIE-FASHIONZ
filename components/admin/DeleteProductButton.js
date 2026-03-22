"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Failed to delete product.");
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-muted hover:text-error transition-colors"
    >
      Delete
    </button>
  );
}
