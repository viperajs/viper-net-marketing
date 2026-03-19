import dynamic from "next/dynamic"
import Header from "@/components/header"
import { TuringLanding } from "@/components/ui/hero-landing-page"
import Services from "@/components/services"
import Advantages from "@/components/advantages"
import OurProcess from "@/components/OurProcess"
import Websites from "@/components/websites"
import Reviews from "@/components/reviews"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

const LightPillar = dynamic(() => import("@/components/ui/LightPillar"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#130113]">
      {/* Animated background */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, backgroundColor: '#130113' }}>
        <LightPillar
          topColor="#220e71"
          bottomColor="#130113"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="medium"
        />
      </div>

      <Header />
      <TuringLanding />
      <Services />
      <Advantages />
      <OurProcess />
      <Websites />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
