import HeroAbout from "@/components/about/HeroAbout";
import SplitScrollValues from "@/components/about/SplitScrollValues";
import ImpactSection from "@/components/about/ImpactSection";

export default function AboutPage() {
  return (
    <main>
      <HeroAbout />

      {/* ── Split Scroll Core Pillars ── */}
      <SplitScrollValues />

      {/* ── Impact & Recognition Section ── */}
      <ImpactSection />
    </main>
  );
}
