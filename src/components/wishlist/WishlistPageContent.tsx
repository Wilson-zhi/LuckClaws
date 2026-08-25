"use client";

import Link from "next/link";
import { ArrowRight, Heart, LoaderCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { type Product } from "@/data/products";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useWishlistStore } from "@/store/wishlist-store";

export function WishlistPageContent({ products }: { products: Product[] }) {
  const productIds = useWishlistStore((state) => state.productIds);
  const accountSyncReady = useWishlistStore((state) => state.accountSyncReady);
  const clear = useWishlistStore((state) => state.clear);
  const [syncMessage, setSyncMessage] = useState("");
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const savedProducts = productIds
    .map((productId) => productById.get(productId))
    .filter((product): product is Product => Boolean(product));

  const handleClear = async () => {
    clear();
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return;
    }

    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", data.user.id);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Unable to clear account wishlist:", error);
      }
      setSyncMessage("Wishlist cleared on this device. Account sync will be retried next time.");
    }
  };

  return (
    <section className="section-shell py-12 md:py-20">
      <div className="flex flex-col gap-5 border-b border-[#E5C99F] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-tight text-[#24170E] md:text-6xl">
            Your saved picks
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B5540] md:text-lg">
            Keep useful finds together, compare them when you are ready, and move to checkout at your own pace.
          </p>
        </div>
        {savedProducts.length > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#D8B987] px-5 py-2.5 text-sm font-bold text-[#6F4300] transition hover:border-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:self-auto"
            onClick={() => void handleClear()}
          >
            <Trash2 aria-hidden className="h-4 w-4" />
            Clear wishlist
          </button>
        )}
      </div>

      {syncMessage && (
        <p className="mt-5 rounded-md bg-[#FFF1EA] px-4 py-3 text-sm font-semibold text-[#8A2F16]" role="status">
          {syncMessage}
        </p>
      )}

      {!accountSyncReady && savedProducts.length === 0 ? (
        <div className="flex min-h-[360px] items-center justify-center gap-3 text-sm font-semibold text-[#6B5540]">
          <LoaderCircle aria-hidden className="h-5 w-5 animate-spin motion-reduce:animate-none" />
          Loading your wishlist...
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="mx-auto flex min-h-[430px] max-w-xl flex-col items-center justify-center py-14 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#F7DCA9] text-[#6F4300]">
            <Heart aria-hidden className="h-9 w-9" />
          </span>
          <h2 className="mt-7 font-heading text-3xl font-bold text-[#24170E]">Nothing saved yet</h2>
          <p className="mt-3 max-w-md leading-7 text-[#6B5540]">
            Tap the heart on any product to keep it here. Your picks stay on this device, and signed-in accounts sync them across visits.
          </p>
          <Link
            href="/collections"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5B3300] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:hover:translate-y-0"
          >
            Explore products
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-9 grid auto-rows-fr grid-cols-2 items-stretch gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} itemListName="Wishlist" />
          ))}
        </div>
      )}
    </section>
  );
}
