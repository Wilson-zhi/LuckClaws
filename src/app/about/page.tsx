import type { Metadata } from "next";
import { AboutJourneyExperience } from "@/components/about/AboutJourneyExperience";
import { SiteShell } from "@/components/layout/SiteShell";
import { getPublicAboutContent } from "@/lib/about-paw-settings";
import { getPublicHeaderNavigationItems } from "@/lib/public-product-data";
import { createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "About LUCK CLAWS | Routine-First Pet Essentials",
    description:
      "Take an interactive tour of how LUCK CLAWS helps pet parents shop practical essentials by routine, from play and walks to rest, comfort, and support.",
    path: "/about",
    openGraphTitle: "About LUCK CLAWS | A Routine-First Shopping Journey",
    openGraphDescription:
      "Explore the LUCK CLAWS routine-first approach through an interactive path for play, walks, rest, comfort, and support.",
    twitterTitle: "About LUCK CLAWS | A Routine-First Shopping Journey",
    twitterDescription:
      "Explore practical pet essentials through a clearer path for play, walks, rest, comfort, and support."
  })
};

function isLogoLikeMedia(url: string) {
  return /logo|luck[-_\s]?claw|pet[-_\s]?suppl/i.test(url);
}

function isVideoMedia(url: string) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

export default async function AboutPage() {
  const [aboutContent, navigationItems] = await Promise.all([
    getPublicAboutContent(),
    getPublicHeaderNavigationItems()
  ]);
  const { hero, pawPath, collectionSection, collectionCards } = aboutContent;
  const heroPosterImage = isLogoLikeMedia(hero.heroImageUrl)
    ? "/images/about-dogs-running.jpg"
    : hero.heroImageUrl;

  return (
    <SiteShell navigationItems={navigationItems}>
      <div
        aria-hidden="true"
        hidden
        dangerouslySetInnerHTML={{
          __html: `<!-- about-content-source: ${aboutContent.diagnostics.source} -->`
        }}
      />
      <AboutJourneyExperience
        hero={hero}
        pawPath={pawPath}
        collectionSection={collectionSection}
        collectionCards={collectionCards}
        heroPosterImage={heroPosterImage}
        heroUsesVideo={isVideoMedia(heroPosterImage)}
      />
    </SiteShell>
  );
}
