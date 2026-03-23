"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useToggleWishlist } from "@/hooks/useWishlist";

export default function RemoveWishlistButton({ productId }) {
  const { mutate: toggle, isPending } = useToggleWishlist();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        toggle({ productId, remove: true }, { onSuccess: () => router.refresh() })
      }
      disabled={isPending}
      aria-label="Remove from wishlist"
      className="absolute top-2 right-2 z-10 p-2.5 bg-surface/90 backdrop-blur-sm hover:bg-surface-raised transition-colors disabled:opacity-50"
    >
      <X size={16} className="text-muted" />
    </button>
  );
}
