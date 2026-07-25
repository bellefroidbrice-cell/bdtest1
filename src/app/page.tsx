import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { VehiclesPreview } from "@/components/sections/vehicles-preview";
import { WhyUs } from "@/components/sections/why-us";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <WhyUs />
      <Services />
      <VehiclesPreview />
      <Cta />
    </main>
  );
}
