"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    setDeleteError(null);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (!res.ok) {
      setDeleteError("Failed to delete product.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleDelete}
        className="text-xs text-muted hover:text-error transition-colors"
      >
        Delete
      </button>
      {deleteError && (
        <p className="text-xs text-error font-body">{deleteError}</p>
      )}
    </div>
  );
}
