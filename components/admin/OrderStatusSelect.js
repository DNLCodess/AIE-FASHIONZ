"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrderStatusSelect({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setSaving(true);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    } else {
      alert("Failed to update order status.");
    }

    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className="h-9 px-3 font-body text-sm border border-border bg-surface focus:outline-none focus:border-foreground disabled:opacity-60 cursor-pointer capitalize"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
      {saving && <span className="font-body text-xs text-muted">Saving…</span>}
    </div>
  );
}
