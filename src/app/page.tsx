import Hero from "@/components/Hero";
import Services from "@/components/Services";
import GoodHands from "@/components/GoodHands";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Services />
      <GoodHands />
      <CtaBanner />
    </main>
  );
}
