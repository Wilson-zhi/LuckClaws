import dynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { type NavigationItem } from "@/data/navigation";

const WishlistFeedback = dynamic(() =>
  import("@/components/wishlist/WishlistFeedback").then((module) => module.WishlistFeedback)
);

export function SiteShell({
  children,
  navigationItems
}: {
  children: React.ReactNode;
  navigationItems?: NavigationItem[];
}) {
  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#24170E]">
      <a href="#main-content" className="site-skip-link">
        Skip to main content
      </a>
      <Header initialNavigationItems={navigationItems} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WishlistFeedback />
    </div>
  );
}
