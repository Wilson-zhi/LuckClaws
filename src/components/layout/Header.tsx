"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { topLevelNavigation } from "@/data/navigation";
import { brandName } from "@/data/products";
import { cn } from "@/lib/utils";
import { getCartTotals, useCartStore } from "@/store/cart-store";

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const totals = getCartTotals(items);

  useEffect(() => {
    const openCartDrawer = () => setDrawerOpen(true);

    window.addEventListener("luck-claws:open-cart", openCartDrawer);
    return () => window.removeEventListener("luck-claws:open-cart", openCartDrawer);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface-container-lowest/95 backdrop-blur">
        <div className="section-shell hidden h-20 items-center gap-7 lg:flex">
          <Link href="/" className="shrink-0 font-heading text-2xl font-extrabold text-primary">
            {brandName}
          </Link>
          <nav className="min-w-0 flex-1" aria-label="Primary navigation">
            <ul className="flex items-center gap-6 text-sm font-semibold text-on-surface-variant">
              {topLevelNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap transition hover:text-primary",
                      pathname === item.href && "text-primary underline decoration-primary-container decoration-2 underline-offset-8",
                      item.sale && "text-error"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4 text-primary">
            <Link href="/search" className="transition hover:text-on-surface" aria-label="Search">
              <Search aria-hidden className="h-6 w-6" />
            </Link>
            <button type="button" className="transition hover:text-on-surface" aria-label="Wishlist">
              <Heart aria-hidden className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="relative transition hover:text-on-surface"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Open cart with ${totals.count} items`}
            >
              <ShoppingBag aria-hidden className="h-6 w-6" />
              {totals.count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-xs font-bold text-on-primary-container">
                  {totals.count}
                </span>
              )}
            </button>
            <button type="button" className="transition hover:text-on-surface" aria-label="Account">
              <User aria-hidden className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="section-shell flex h-16 items-center justify-between lg:hidden">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-surface-container"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
          <Link href="/" className="font-heading text-sm font-extrabold tracking-wide text-primary">
            {brandName}
          </Link>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full text-primary transition hover:bg-surface-container"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open cart with ${totals.count} items`}
          >
            <ShoppingBag aria-hidden className="h-5 w-5" />
            {totals.count > 0 && (
              <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-[10px] font-bold text-on-primary-container">
                {totals.count}
              </span>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-outline-variant/50 bg-surface-container-lowest px-4 py-4 lg:hidden" aria-label="Mobile navigation">
            <ul className="grid gap-2">
              {topLevelNavigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-full px-4 py-3 text-sm font-semibold text-on-surface-variant",
                      pathname === item.href && "bg-primary-container text-on-primary-container",
                      item.sale && "text-error"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/search"
                  className="block rounded-full px-4 py-3 text-sm font-semibold text-on-surface-variant"
                  onClick={() => setMenuOpen(false)}
                >
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
