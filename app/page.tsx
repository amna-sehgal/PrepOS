import Navbar from '@/components/landing/navbar'
import Hero from '@/components/landing/hero'
import { AppPreview } from '@/components/landing/proof-preview'
import { Features, IndiaSection, HowItWorks, CTAFooter } from '@/components/landing/sections'
 
export default function LandingPage() {
  return (
    <main className="bg-ghost min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <AppPreview />
      <Features />
      <IndiaSection />
      <HowItWorks />
      <CTAFooter />
    </main>
  )
}