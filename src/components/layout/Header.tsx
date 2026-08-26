"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Heart, Menu, PawPrint, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { topLevelNavigation, type NavigationItem } from "@/data/navigation";
import { brandName } from "@/data/products";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getCartTotals, useCartStore } from "@/store/cart-store";
import { trackViewCart } from "@/lib/ga4-ecommerce";
import { useWishlistStore } from "@/store/wishlist-store";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((module) => module.CartDrawer),
  { ssr: false }
);

type PublicCategoryNavRow = {
  name: string | null;
  slug: string | null;
};

type RecentlyAddedItem = {
  productName: string;
  quantity: number;
  token: number;
};

let cachedPublicNavigationItems: NavigationItem[] | null = null;
let publicNavigationRequest: Promise<NavigationItem[] | null> | null = null;

export function Header({ initialNavigationItems }: { initialNavigationItems?: NavigationItem[] }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<RecentlyAddedItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountHref, setAccountHref] = useState("/account/login");
  const fallbackNavigationItems = useMemo(
    () => (initialNavigationItems && initialNavigationItems.length > 0 ? initialNavigationItems : topLevelNavigation),
    [initialNavigationItems]
  );
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(fallbackNavigationItems);
  const items = useCartStore((state) => state.items);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const setWishlistProductIds = useWishlistStore((state) => state.setProductIds);
  const setWishlistSyncReady = useWishlistStore((state) => state.setAccountSyncReady);
  const totals = getCartTotals(items);

  useEffect(() => {
    const openCartDrawer = (event: Event) => {
      const detail = (event as CustomEvent<Partial<RecentlyAddedItem>>).detail;
      const productName = typeof detail?.productName === "string" ? detail.productName.trim() : "";
      const quantity = typeof detail?.quantity === "number" && detail.quantity > 0 ? Math.floor(detail.quantity) : 1;

      setRecentlyAdded(productName ? { productName, quantity, token: Date.now() } : null);
      trackViewCart(useCartStore.getState().items);
      setDrawerOpen(true);
    };

    window.addEventListener("luck-claws:open-cart", openCartDrawer);
    return () => window.removeEventListener("luck-claws:open-cart", openCartDrawer);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setAccountHref("/account/login");
      setWishlistSyncReady(true);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function syncAccountWishlist(userId?: string) {
      if (!userId) {
        if (active) {
          setWishlistSyncReady(true);
        }
        return;
      }

      const currentIds = useWishlistStore.getState().productIds;
      const { data, error } = await browserSupabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!active) {
        return;
      }

      if (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Unable to sync account wishlist:", error);
        }
        setWishlistSyncReady(true);
        return;
      }

      const serverIds = (data ?? []).map((row) => row.product_id as string);
      const mergedIds = Array.from(new Set([...serverIds, ...currentIds]));
      const missingRows = currentIds
        .filter((productId) => !serverIds.includes(productId))
        .map((productId) => ({ user_id: userId, product_id: productId }));

      if (missingRows.length > 0) {
        const { error: mergeError } = await browserSupabase.from("wishlist_items").insert(missingRows);
        if (mergeError && process.env.NODE_ENV === "development") {
          console.error("Unable to merge local wishlist:", mergeError);
        }
      }

      setWishlistProductIds(mergedIds);
      setWishlistSyncReady(true);
    }

    browserSupabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAccountHref(data.session ? "/account" : "/account/login");
        void syncAccountWishlist(data.session?.user.id);
      }
    });

    const {
      data: { subscription }
    } = browserSupabase.auth.onAuthStateChange((event, session) => {
      setAccountHref(session ? "/account" : "/account/login");
      if (event !== "INITIAL_SESSION") {
        void syncAccountWishlist(session?.user.id);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setWishlistProductIds, setWishlistSyncReady]);

  useEffect(() => {
    if (initialNavigationItems && initialNavigationItems.length > 0) {
      cachedPublicNavigationItems = initialNavigationItems;
      setNavigationItems(initialNavigationItems);
      return;
    }

    if (cachedPublicNavigationItems) {
      setNavigationItems(cachedPublicNavigationItems);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setNavigationItems(fallbackNavigationItems);
      return;
    }

    let active = true;
    const browserSupabase = supabase;

    async function loadPublicNavigation() {
      if (!publicNavigationRequest) {
        publicNavigationRequest = (async () => {
          const { data, error } = await browserSupabase
            .from("product_categories")
            .select("name, slug")
            .eq("status", "active")
            .eq("show_in_nav", true)
            .order("sort_order", { ascending: true, nullsFirst: false });

          if (error || !data || data.length === 0) {
            return null;
          }

          const categoryItems = (data as PublicCategoryNavRow[])
            .map((category) => {
              const name = category.name?.trim();
              const slug = category.slug?.trim();

              return name && slug ? { label: name, href: `/collections/${slug}` } : null;
            })
            .filter((item): item is NavigationItem => Boolean(item));

          return categoryItems.length > 0
            ? [
                { label: "Shop All", href: "/collections" },
                ...categoryItems,
                { label: "About Us", href: "/about" },
                { label: "Sale", href: "/sale", sale: true }
              ]
            : null;
        })().finally(() => {
          publicNavigationRequest = null;
        });
      }

      const publicNavigationItems = await publicNavigationRequest;

      if (!active) {
        return;
      }

      if (publicNavigationItems) {
        cachedPublicNavigationItems = publicNavigationItems;
        setNavigationItems(publicNavigationItems);
      } else {
        setNavigationItems(fallbackNavigationItems);
      }
    }

    void loadPublicNavigation();

    return () => {
      active = false;
    };
  }, [fallbackNavigationItems, initialNavigationItems]);

  return (
    <>
      <header className="site-header sticky top-0 z-40">
        <div className="site-header-shell hidden xl:grid">
          <Link
            href="/"
            className="site-wordmark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="site-wordmark-seal" aria-hidden>
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="site-wordmark-copy">
              <strong>{brandName}</strong>
              <small>Play · Walk · Rest</small>
            </span>
          </Link>
          <nav className="site-primary-nav" aria-label="Primary navigation">
            <ul className="site-nav-list">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "site-nav-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      pathname === item.href && "is-active",
                      item.sale && "is-sale"
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-header-actions">
            <Link
              href="/search"
              className="site-action-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Search"
            >
              <Search aria-hidden className="h-[1.35rem] w-[1.35rem]" />
            </Link>
            <Link
              href="/wishlist"
              className={cn(
                "site-action-button relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                pathname === "/wishlist" && "is-active"
              )}
              aria-label={`Wishlist with ${wishlistCount} saved items`}
            >
              <Heart aria-hidden className={cn("h-[1.35rem] w-[1.35rem]", wishlistCount > 0 && "fill-current")} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-xs font-bold text-on-primary-container">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="site-action-button relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => {
                setRecentlyAdded(null);
                trackViewCart(items);
                setDrawerOpen(true);
              }}
              aria-label={`Open cart with ${totals.count} items`}
            >
              <ShoppingBag aria-hidden className="h-[1.35rem] w-[1.35rem]" />
              {totals.count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary-container px-1 text-xs font-bold text-on-primary-container">
                  {totals.count}
                </span>
              )}
            </button>
            <Link
              href={accountHref}
              className="site-action-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Account"
            >
              <User aria-hidden className="h-[1.35rem] w-[1.35rem]" />
            </Link>
          </div>
        </div>

        <div className="section-shell flex h-16 items-center justify-between xl:hidden">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#E8D6BF] bg-white/70 text-[#5C4834] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
          <Link href="/" className="site-mobile-wordmark">
            <PawPrint aria-hidden className="h-4 w-4" />
            <span>{brandName}</span>
          </Link>
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-[#E8D6BF] bg-white/70 text-primary transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              setRecentlyAdded(null);
              trackViewCart(items);
              setDrawerOpen(true);
            }}
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
          <nav className="border-t border-[#E8D6BF] bg-[#FFF9EF] px-4 py-4 shadow-soft xl:hidden" aria-label="Mobile navigation">
            <ul className="grid gap-2">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "site-mobile-nav-link block rounded-full px-4 py-3 text-[#5C4834] transition hover:bg-white hover:text-primary",
                      pathname === item.href && "bg-primary-container text-on-primary-container shadow-soft",
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
                  className="site-mobile-nav-link block rounded-full px-4 py-3 text-[#5C4834] transition hover:bg-white hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className={cn(
                    "site-mobile-nav-link flex items-center justify-between rounded-full px-4 py-3 text-[#5C4834] transition hover:bg-white hover:text-primary",
                    pathname === "/wishlist" && "bg-primary-container text-on-primary-container shadow-soft"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-primary">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href={accountHref}
                  className="site-mobile-nav-link block rounded-full px-4 py-3 text-[#5C4834] transition hover:bg-white hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} recentlyAdded={recentlyAdded} />
    </>
  );
}
