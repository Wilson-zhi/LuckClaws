import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { type NavigationItem } from "@/data/navigation";

export function SiteShell({
  children,
  navigationItems
}: {
  children: React.ReactNode;
  navigationItems?: NavigationItem[];
}) {
  return (
    <>
      <Header initialNavigationItems={navigationItems} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
