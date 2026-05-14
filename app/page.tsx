import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ImpactMetricsSection } from "@/components/impact-metrics-section"
import { PlantGuideSection } from "@/components/plant-guide-section"
import { ScienceBlogSection } from "@/components/science-blog-section"
import { CTASection } from "@/components/cta-section"
import { Disclaimer } from "@/components/disclaimer"
import { DisclaimerModal } from "@/components/disclaimer-modal"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <DisclaimerModal />
      <Navigation />
      
      {/* Add padding top for fixed navigation */}
      <div className="pt-16">
        <HeroSection />
        
        <section id="beneficios">
          <BenefitsSection />
        </section>

        <section id="impacto">
          <ImpactMetricsSection />
        </section>
        
        <section id="guia">
          <PlantGuideSection />
        </section>
        
        <section id="blog">
          <ScienceBlogSection />
        </section>
        
        <Disclaimer />
        
        <CTASection />
        
        <Footer />
      </div>
    </main>
  )
}
