import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WishlistFeedback } from "@/components/wishlist/WishlistFeedback";
import { type NavigationItem } from "@/data/navigation";

export function SiteShell({
  children,
  navigationItems
}: {
  children: React.ReactNode;
  navigationItems?: NavigationItem[];
}) {
  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#24170E]">
      <Header initialNavigationItems={navigationItems} />
      <main>{children}</main>
      <Footer />
      <WishlistFeedback />
    </div>
  );
}
