"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";

export const WISHLIST_FEEDBACK_EVENT = "luck-claws:wishlist-feedback";

function announceWishlistFeedback(message: string, tone: "success" | "error" = "success") {
  window.dispatchEvent(
    new CustomEvent(WISHLIST_FEEDBACK_EVENT, {
      detail: { message, tone }
    })
  );
}

type WishlistButtonProps = {
  productId: string;
  productSlug: string;
  productName: string;
  className?: string;
  showLabel?: boolean;
};

export function WishlistButton({
  productId,
  productSlug,
  productName,
  className,
  showLabel = false
}: WishlistButtonProps) {
  const productIds = useWishlistStore((state) => state.productIds);
  const toggleProduct = useWishlistStore((state) => state.toggleProduct);
  const [syncing, setSyncing] = useState(false);
  const saved = productIds.includes(productId);

  const handleToggle = async () => {
    if (syncing) {
      return;
    }

    const nextSaved = !saved;
    toggleProduct(productId);
    announceWishlistFeedback(
      nextSaved ? `${productName} saved to your wishlist.` : `${productName} removed from your wishlist.`
    );

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    setSyncing(true);
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setSyncing(false);
      return;
    }

    const result = nextSaved
      ? await supabase.from("wishlist_items").insert({
          user_id: data.user.id,
          product_id: productId,
          product_slug: productSlug
        })
      : await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", data.user.id)
          .eq("product_id", productId);

    setSyncing(false);

    if (result.error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to sync wishlist item:", result.error);
      }

      announceWishlistFeedback(
        "Saved on this device, but account sync is temporarily unavailable.",
        "error"
      );
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-bold shadow-soft transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 motion-reduce:hover:translate-y-0",
        showLabel ? "min-h-11 px-4" : "h-11 w-11 p-0",
        saved
          ? "border-primary bg-primary text-white hover:border-[#5B3300] hover:bg-[#5B3300]"
          : "border-[#E5C99F] bg-white/95 text-[#6F4300] hover:border-primary hover:bg-[#FFF3DF]",
        className
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleToggle();
      }}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      aria-pressed={saved}
      disabled={syncing}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart aria-hidden className={cn("h-5 w-5", saved && "fill-current")} />
      {showLabel && <span>{saved ? "Saved" : "Save to Wishlist"}</span>}
    </button>
  );
}
